import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const seoAnalysis = pgTable("seo_analysis", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  domain: text("domain").notNull(),
  metaTags: json("meta_tags").$type<Record<string, string>>(),
  ogTags: json("og_tags").$type<Record<string, string>>(),
  twitterTags: json("twitter_tags").$type<Record<string, string>>(),
  scores: json("scores").$type<{
    overall: number;
    meta: number;
    social: number;
    technical: number;
  }>(),
  recommendations: json("recommendations").$type<Array<{
    type: 'warning' | 'error' | 'success';
    title: string;
    description: string;
    code?: string;
  }>>(),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalysis).omit({
  id: true,
  analyzedAt: true,
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalysis.$inferSelect;
