import { z } from "zod";

export const stopSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string(),
  imageAlt: z.string(),
  text: z.string(),
  audioUrl: z.string(),
  audioTranscript: z.string(),
  lseVideoUrl: z.string(),
  videoTranscript: z.string(),
});

export const routeDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  municipality: z.string(),
  stops: z.array(stopSchema),
});

export const routeSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  municipality: z.string(),
  summary: z.string(),
  image: z.string(),
  stopCount: z.number(),
  duration: z.string(),
  flags: z.object({
    audio: z.boolean(),
    lse: z.boolean(),
    easyRead: z.boolean(),
  }),
});

export type Stop = z.infer<typeof stopSchema>;
export type RouteDetail = z.infer<typeof routeDetailSchema>;
export type RouteSummary = z.infer<typeof routeSummarySchema>;
