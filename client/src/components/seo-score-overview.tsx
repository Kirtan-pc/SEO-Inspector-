import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { SeoAnalysis } from "@shared/schema";

interface SeoScoreOverviewProps {
  analysis: SeoAnalysis;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 bg-green-100";
  if (score >= 60) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Work";
}

export function SeoScoreOverview({ analysis }: SeoScoreOverviewProps) {
  const { scores } = analysis;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">SEO Score Overview</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last analyzed: </span>
            <span className="text-sm text-gray-700 font-medium">
              {formatDistanceToNow(new Date(analysis.analyzedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(scores?.overall || 0)}`}>
                <span className="text-2xl font-bold">{scores?.overall || 0}</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Overall Score</h4>
            <p className="text-sm text-gray-500">{getScoreLabel(scores?.overall || 0)}</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(scores?.meta || 0)}`}>
                <span className="text-2xl font-bold">{scores?.meta || 0}</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Meta Tags</h4>
            <p className="text-sm text-gray-500">{getScoreLabel(scores?.meta || 0)}</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(scores?.social || 0)}`}>
                <span className="text-2xl font-bold">{scores?.social || 0}</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Social Media</h4>
            <p className="text-sm text-gray-500">{getScoreLabel(scores?.social || 0)}</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(scores?.technical || 0)}`}>
                <span className="text-2xl font-bold">{scores?.technical || 0}</span>
              </div>
            </div>
            <h4 className="font-medium text-gray-900">Technical</h4>
            <p className="text-sm text-gray-500">{getScoreLabel(scores?.technical || 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
