import { Check, AlertTriangle, X, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SeoAnalysis } from "@shared/schema";

interface SocialPreviewsProps {
  analysis: SeoAnalysis;
}

export function SocialPreviews({ analysis }: SocialPreviewsProps) {
  const { ogTags, twitterTags, domain, title } = analysis;

  const fbTitle = ogTags?.['og:title'] || title || domain;
  const fbDescription = ogTags?.['og:description'] || '';
  const fbImage = ogTags?.['og:image'];

  const twitterTitle = twitterTags?.['twitter:title'] || fbTitle;
  const twitterDescription = twitterTags?.['twitter:description'] || fbDescription;
  const twitterCard = twitterTags?.['twitter:card'];
  const twitterImage = twitterTags?.['twitter:image'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Facebook Preview */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook Preview
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              {fbImage ? (
                <img src={fbImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {domain}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-1 break-words">
                {fbTitle}
              </h4>
              {fbDescription && (
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight break-words">
                  {fbDescription.length > 100 ? `${fbDescription.substring(0, 100)}...` : fbDescription}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {!fbImage && (
              <Badge variant="secondary">
                <AlertTriangle className="h-3 w-3 mr-1" />
                No og:image
              </Badge>
            )}
            {ogTags?.['og:title'] && (
              <Badge variant="default">
                <Check className="h-3 w-3 mr-1" />
                og:title present
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Twitter Preview */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-400 dark:text-blue-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter Preview
          </h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              {twitterImage || fbImage ? (
                <img src={twitterImage || fbImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-1 break-words">
                {twitterTitle}
              </h4>
              {twitterDescription && (
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight mb-2 break-words">
                  {twitterDescription.length > 80 ? `${twitterDescription.substring(0, 80)}...` : twitterDescription}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="break-all">{domain}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {!twitterCard && (
              <Badge variant="destructive">
                <X className="h-3 w-3 mr-1" />
                No twitter:card
              </Badge>
            )}
            {!twitterImage && !fbImage && (
              <Badge variant="secondary">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Missing twitter:image
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
