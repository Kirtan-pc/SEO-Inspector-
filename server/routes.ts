import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSeoAnalysisSchema } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

const analyzeUrlSchema = z.object({
  url: z.string().url(),
});

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function calculateScores(metaTags: Record<string, string>, ogTags: Record<string, string>, twitterTags: Record<string, string>) {
  let metaScore = 0;
  let socialScore = 0;
  let technicalScore = 0;

  // Meta score calculation
  if (metaTags.title && metaTags.title.length >= 30 && metaTags.title.length <= 60) metaScore += 40;
  else if (metaTags.title) metaScore += 20;
  
  if (metaTags.description && metaTags.description.length >= 120 && metaTags.description.length <= 160) metaScore += 40;
  else if (metaTags.description) metaScore += 20;
  
  if (metaTags.viewport) metaScore += 20;

  // Social score calculation
  if (ogTags['og:title']) socialScore += 25;
  if (ogTags['og:description']) socialScore += 25;
  if (ogTags['og:image']) socialScore += 25;
  if (ogTags['og:url']) socialScore += 15;
  if (twitterTags['twitter:card']) socialScore += 10;

  // Technical score (simplified)
  technicalScore = 85 + Math.floor(Math.random() * 15); // Placeholder for now

  const overall = Math.round((metaScore + socialScore + technicalScore) / 3);

  return {
    overall,
    meta: metaScore,
    social: socialScore,
    technical: technicalScore,
  };
}

function generateRecommendations(metaTags: Record<string, string>, ogTags: Record<string, string>, twitterTags: Record<string, string>, scores: { overall: number; meta: number; social: number; technical: number }) {
  const recommendations: Array<{
    type: 'warning' | 'error' | 'success';
    title: string;
    description: string;
    code?: string;
  }> = [];

  // Meta score improvements
  if (scores.meta < 80) {
    if (!metaTags.title) {
      recommendations.push({
        type: 'error',
        title: 'Missing Title Tag',
        description: 'Add a descriptive title tag to improve search engine visibility and boost your Meta Score from ' + scores.meta + '/100.',
        code: '<title>Your Page Title Here</title>'
      });
    } else if (metaTags.title.length < 30 || metaTags.title.length > 60) {
      recommendations.push({
        type: 'warning',
        title: 'Optimize Title Length',
        description: `Title should be between 30-60 characters for optimal display. Current: ${metaTags.title.length} chars. This could improve your Meta Score by 20 points.`,
      });
    }

    if (!metaTags.description) {
      recommendations.push({
        type: 'error',
        title: 'Missing Meta Description',
        description: 'Add a meta description to improve click-through rates and boost your Meta Score by up to 40 points.',
        code: '<meta name="description" content="Your compelling page description here (120-160 characters)">'
      });
    } else if (metaTags.description.length < 120 || metaTags.description.length > 160) {
      recommendations.push({
        type: 'warning',
        title: 'Optimize Description Length',
        description: `Meta description should be 120-160 characters. Current: ${metaTags.description.length} chars. Optimizing this could add 20 points to your Meta Score.`,
      });
    }

    if (!metaTags.viewport) {
      recommendations.push({
        type: 'warning',
        title: 'Add Viewport Meta Tag',
        description: 'Include a viewport meta tag for mobile responsiveness. This adds 20 points to your Meta Score.',
        code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      });
    }
  }

  // Social score improvements
  if (scores.social < 80) {
    if (!ogTags['og:title']) {
      recommendations.push({
        type: 'warning',
        title: 'Add Open Graph Title',
        description: 'Include og:title to improve social media sharing. This adds 25 points to your Social Score.',
        code: '<meta property="og:title" content="Your compelling title">'
      });
    }

    if (!ogTags['og:description']) {
      recommendations.push({
        type: 'warning',
        title: 'Add Open Graph Description',
        description: 'Include og:description for better social media previews. This adds 25 points to your Social Score.',
        code: '<meta property="og:description" content="Your page description">'
      });
    }

    if (!ogTags['og:image']) {
      recommendations.push({
        type: 'warning',
        title: 'Add Open Graph Image',
        description: 'Adding an og:image will significantly improve social media sharing and add 25 points to your Social Score.',
        code: '<meta property="og:image" content="https://example.com/social-image.jpg">'
      });
    }

    if (!ogTags['og:url']) {
      recommendations.push({
        type: 'warning',
        title: 'Add Open Graph URL',
        description: 'Include og:url for proper social media attribution. This adds 15 points to your Social Score.',
        code: '<meta property="og:url" content="https://yourwebsite.com/current-page">'
      });
    }

    if (!twitterTags['twitter:card']) {
      recommendations.push({
        type: 'error',
        title: 'Implement Twitter Cards',
        description: 'Add Twitter Card meta tags to control how your content appears on Twitter. This adds 10 points to your Social Score.',
        code: '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="Your title">\n<meta name="twitter:description" content="Your description">\n<meta name="twitter:image" content="https://example.com/image.jpg">'
      });
    }

    if (!twitterTags['twitter:image'] && !ogTags['og:image']) {
      recommendations.push({
        type: 'warning',
        title: 'Add Twitter Image',
        description: 'Include a Twitter-specific image or ensure og:image is present for better Twitter sharing.',
        code: '<meta name="twitter:image" content="https://example.com/twitter-image.jpg">'
      });
    }
  }

  // Technical improvements
  if (scores.technical < 90) {
    recommendations.push({
      type: 'warning',
      title: 'Improve Technical SEO',
      description: 'Consider optimizing page load speed, implementing structured data, and ensuring mobile-friendliness to boost your Technical Score.',
    });
  }

  // Overall score recommendations
  if (scores.overall < 60) {
    recommendations.push({
      type: 'error',
      title: 'Critical SEO Issues Found',
      description: `Your overall SEO score is ${scores.overall}/100. Focus on implementing the above recommendations to significantly improve your search visibility.`,
    });
  } else if (scores.overall < 80) {
    recommendations.push({
      type: 'warning',
      title: 'Good SEO Foundation, Room for Improvement',
      description: `Your SEO score is ${scores.overall}/100. Implementing the suggested improvements could push you into the excellent range (80+).`,
    });
  }

  // Success message for high-performing sites
  if (scores.overall >= 80 && scores.meta >= 80 && scores.social >= 80) {
    recommendations.push({
      type: 'success',
      title: 'Excellent SEO Implementation',
      description: `Outstanding! Your overall score is ${scores.overall}/100. Your site has excellent SEO optimization with proper meta tags and social media integration.`,
    });
  }

  return recommendations;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze URL endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = analyzeUrlSchema.parse(req.body);
      
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Check if we have a recent analysis
      const existing = await storage.getSeoAnalysisByUrl(normalizedUrl);
      if (existing && Date.now() - new Date(existing.analyzedAt).getTime() < 5 * 60 * 1000) {
        return res.json(existing);
      }

      // Fetch the website
      const response = await axios.get(normalizedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'SEO Meta Analyzer Bot 1.0'
        }
      });

      const $ = cheerio.load(response.data);
      const domain = extractDomain(normalizedUrl);

      // Extract meta tags
      const metaTags: Record<string, string> = {};
      metaTags.title = $('title').text().trim();
      
      $('meta').each((_, element) => {
        const name = $(element).attr('name') || $(element).attr('property');
        const content = $(element).attr('content');
        if (name && content) {
          metaTags[name] = content;
        }
      });

      // Extract Open Graph tags
      const ogTags: Record<string, string> = {};
      $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });

      // Extract Twitter tags
      const twitterTags: Record<string, string> = {};
      $('meta[name^="twitter:"]').each((_, element) => {
        const name = $(element).attr('name');
        const content = $(element).attr('content');
        if (name && content) {
          twitterTags[name] = content;
        }
      });

      // Calculate scores
      const scores = calculateScores(metaTags, ogTags, twitterTags);
      
      // Generate recommendations
      const recommendations = generateRecommendations(metaTags, ogTags, twitterTags, scores);

      // Create analysis record
      const analysis = await storage.createSeoAnalysis({
        url: normalizedUrl,
        title: metaTags.title || null,
        domain,
        metaTags,
        ogTags,
        twitterTags,
        scores,
        recommendations,
      });

      res.json(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to analyze website' 
      });
    }
  });

  // Get recent analyses
  app.get("/api/recent", async (req, res) => {
    try {
      const analyses = await storage.getRecentAnalyses(10);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recent analyses' });
    }
  });

  // Get specific analysis
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: 'Analysis not found' });
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analysis' });
    }
  });

  // Delete analysis
  app.delete("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSeoAnalysis(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Analysis not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete analysis' });
    }
  });

  // Clear all analyses
  app.delete("/api/analyses", async (req, res) => {
    try {
      await storage.clearAllAnalyses();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear analyses' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
