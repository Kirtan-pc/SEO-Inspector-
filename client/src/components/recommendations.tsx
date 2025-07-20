import { Lightbulb, AlertTriangle, X, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SeoAnalysis } from "@shared/schema";

interface RecommendationsProps {
  analysis: SeoAnalysis;
}

export function Recommendations({ analysis }: RecommendationsProps) {
  const { recommendations } = analysis;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="text-green-600 text-xs" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600 text-xs" />;
      case 'error':
        return <X className="text-red-600 text-xs" />;
      default:
        return <AlertTriangle className="text-yellow-600 text-xs" />;
    }
  };

  const getBackgroundForType = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-yellow-100';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
          Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-6 h-6 ${getBackgroundForType(recommendation.type)} rounded-full flex items-center justify-center`}>
                  {getIconForType(recommendation.type)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {recommendation.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {recommendation.description}
                </p>
                {recommendation.code && (
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block whitespace-pre-wrap">
                      {recommendation.code}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <p className="text-gray-500">No recommendations available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
