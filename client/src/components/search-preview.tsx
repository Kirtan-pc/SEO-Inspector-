import { Globe, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SeoAnalysis } from "@shared/schema";

interface SearchPreviewProps {
  analysis: SeoAnalysis;
}

export function SearchPreview({ analysis }: SearchPreviewProps) {
  const { url, title, metaTags } = analysis;
  const displayTitle = title || metaTags?.title || analysis.domain;
  const description = metaTags?.description || '';

  const getTitleStatus = () => {
    if (!displayTitle) return null;
    if (displayTitle.length >= 30 && displayTitle.length <= 60) {
      return { type: 'success', text: 'Title optimized' };
    }
    return { type: 'warning', text: 'Title needs optimization' };
  };

  const getDescriptionStatus = () => {
    if (!description) return null;
    if (description.length >= 120 && description.length <= 160) {
      return { type: 'success', text: 'Description length good' };
    }
    return { type: 'warning', text: 'Description needs optimization' };
  };

  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Search Preview
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="max-w-2xl">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-400 font-mono break-all">{url}</span>
            </div>
            <h4 className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-normal leading-6 mb-1 break-words">
              {displayTitle}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-5 break-words">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {titleStatus && (
            <Badge variant={titleStatus.type === 'success' ? 'default' : 'secondary'}>
              {titleStatus.type === 'success' && <Check className="h-3 w-3 mr-1" />}
              {titleStatus.text}
            </Badge>
          )}
          {descriptionStatus && (
            <Badge variant={descriptionStatus.type === 'success' ? 'default' : 'secondary'}>
              {descriptionStatus.type === 'success' && <Check className="h-3 w-3 mr-1" />}
              {descriptionStatus.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
