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
        return <Check className="text-green-600 dark:text-green-400 text-xs" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600 dark:text-yellow-400 text-xs" />;
      case 'error':
        return <X className="text-red-600 dark:text-red-400 text-xs" />;
      default:
        return <AlertTriangle className="text-yellow-600 dark:text-yellow-400 text-xs" />;
    }
  };

  const getBackgroundForType = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
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
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {recommendation.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                  {recommendation.description}
                </p>
                {recommendation.code && (
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono block whitespace-pre-wrap break-words">
                      {recommendation.code}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
