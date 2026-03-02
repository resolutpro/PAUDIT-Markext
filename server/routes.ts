import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
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

  return httpServer;
}
