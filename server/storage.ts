import fs from "fs";
import path from "path";
import type { RouteSummary, RouteDetail } from "@shared/schema";

const contentDir = path.resolve(process.cwd(), "client", "public", "content");

export interface IStorage {
  getAllRoutes(): Promise<RouteSummary[]>;
  getRouteBySlug(slug: string): Promise<RouteDetail | null>;
}

export class FileStorage implements IStorage {
  async getAllRoutes(): Promise<RouteSummary[]> {
    const filePath = path.join(contentDir, "routes.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  }

  async getRouteBySlug(slug: string): Promise<RouteDetail | null> {
    const safeName = slug.replace(/[^a-z0-9-]/gi, "");
    const filePath = path.join(contentDir, "routes", `${safeName}.json`);

    try {
      const data = await fs.promises.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);
      const { _help, ...routeData } = parsed;
      return routeData;
    } catch {
      return null;
    }
  }
}

export const storage = new FileStorage();
