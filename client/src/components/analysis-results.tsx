import { SeoScoreOverview } from "./seo-score-overview";
import { ScoreImprovementGuide } from "./score-improvement-guide";
import { SearchPreview } from "./search-preview";
import { SocialPreviews } from "./social-previews";
import { DetailedAnalysis } from "./detailed-analysis";
import { Recommendations } from "./recommendations";
import type { SeoAnalysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: SeoAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <SeoScoreOverview analysis={analysis} />
      <ScoreImprovementGuide analysis={analysis} />
      <SearchPreview analysis={analysis} />
      <SocialPreviews analysis={analysis} />
      <DetailedAnalysis analysis={analysis} />
      <Recommendations analysis={analysis} />
    </div>
  );
}
