import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { Client } from "@replit/object-storage";
import path from "path"; // Importación necesaria
import fs from "fs"; // Importación necesaria
import os from "os"; // Importación necesaria

const storageClient = new Client();

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/routes", async (_req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error loading routes index:", error);
      res.status(500).json({ message: "Error al cargar las rutas" });
    }
  });

  app.get("/api/routes/:slug", async (req, res) => {
    try {
      const route = await storage.getRouteBySlug(req.params.slug);
      if (!route) {
        return res.status(404).json({ message: "Ruta no encontrada" });
      }
      res.json(route);
    } catch (error) {
      console.error("Error loading route details:", error);
      res.status(500).json({ message: "Error al cargar los datos de la ruta" });
    }
  });

  app.get(/^\/api\/media\/(.*)/, async (req, res) => {
    try {
      const filePath = req.params[0];

      // 1. Creamos una ruta temporal segura donde guardar el archivo en el servidor.
      // Cambiamos las barras '/' por guiones bajos '_' para evitar crear subcarpetas.
      const safeFilename = filePath.replace(/\//g, "_");
      const tempLocalPath = path.join(os.tmpdir(), safeFilename);

      // 2. Si el archivo NO existe en nuestra carpeta temporal, lo descargamos
      if (!fs.existsSync(tempLocalPath)) {
        console.log(`Descargando a disco desde App Storage: ${filePath}`);

        // ¡Usamos la función de la documentación que guarda a disco!
        const { ok, error } = await storageClient.downloadToFilename(
          filePath,
          tempLocalPath,
        );

        if (!ok) {
          console.error(
            `Error descargando de App Storage para ${filePath}:`,
            error,
          );
          return res.status(404).send("Archivo no encontrado");
        }
        console.log(`✅ Archivo guardado temporalmente en: ${tempLocalPath}`);
      }

      // 3. Dejamos que Express haga su magia.
      // res.sendFile detecta automáticamente el formato (.mp3, .jpg) y maneja
      // los fragmentos de audio (206 Partial Content) de forma nativa.
      res.sendFile(tempLocalPath, (err) => {
        if (err) {
          console.error("Error enviando el archivo al navegador:", err);
          // Si hubo un error cortado por el cliente, borramos el caché por si acaso
          if (fs.existsSync(tempLocalPath)) fs.unlinkSync(tempLocalPath);
        }
      });
    } catch (error) {
      console.error("Error interno en el endpoint multimedia:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

  return httpServer;
}
