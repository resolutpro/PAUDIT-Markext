import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { Client } from "@replit/object-storage";
import path from "path";
import fs from "fs";

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
      // Capturamos la ruta del archivo (ej: routes/jerez-en-capas-arte-sacro/test.mp3)
      const filePath = req.params[0];
      const lowerPath = filePath.toLowerCase();

      // 1. Intentar buscar en el sistema de archivos local (public/media)
      const localPath = path.join(process.cwd(), "public", "media", filePath);
      try {
        if (fs.existsSync(localPath)) {
          const stats = fs.statSync(localPath);
          const fileData = fs.readFileSync(localPath);
          setMediaHeaders(res, lowerPath, fileData.length);
          return res.send(fileData);
        }
      } catch (e) {
        console.log(`No se encontró archivo local: ${localPath}`);
      }

      // 2. Si no es local, intentar App Storage
      console.log(`Intentando descargar de App Storage: ${filePath}`);
      const { value: fileData, error } =
        await storageClient.downloadAsBytes(filePath);

      if (error || !fileData) {
        console.error(`Error de App Storage para ${filePath}:`, error);
        return res.status(404).send("Archivo no encontrado");
      }

      setMediaHeaders(res, lowerPath, fileData.length);
      res.send(Buffer.from(fileData));
    } catch (error) {
      console.error("Error cargando archivo multimedia:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

  function setMediaHeaders(res: any, lowerPath: string, contentLength: number) {
    if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (lowerPath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (lowerPath.endsWith(".mp4")) {
      res.setHeader("Content-Type", "video/mp4");
    } else if (lowerPath.endsWith(".mp3")) {
      res.setHeader("Content-Type", "audio/mpeg");
    } else if (lowerPath.endsWith(".wav")) {
      res.setHeader("Content-Type", "audio/wav");
    } else if (lowerPath.endsWith(".m4a")) {
      res.setHeader("Content-Type", "audio/mp4");
    } else if (lowerPath.endsWith(".ogg")) {
      res.setHeader("Content-Type", "audio/ogg");
    }
    res.setHeader("Content-Length", contentLength);
    res.setHeader("Accept-Ranges", "bytes");
  }

  return httpServer;
}
