import { seoAnalysis, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";

export interface IStorage {
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getRecentAnalyses(limit?: number): Promise<SeoAnalysis[]>;
  deleteSeoAnalysis(id: number): Promise<boolean>;
  clearAllAnalyses(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, SeoAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentId++;
    const analysis: SeoAnalysis = { 
      ...insertAnalysis, 
      id, 
      analyzedAt: new Date() 
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getRecentAnalyses(limit: number = 10): Promise<SeoAnalysis[]> {
    return Array.from(this.analyses.values())
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, limit);
  }

  async deleteSeoAnalysis(id: number): Promise<boolean> {
    return this.analyses.delete(id);
  }

  async clearAllAnalyses(): Promise<boolean> {
    this.analyses.clear();
    return true;
  }
}

export const storage = new MemStorage();
