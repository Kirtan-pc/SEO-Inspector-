import { Tags, Check, AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SeoAnalysis } from "@shared/schema";

interface DetailedAnalysisProps {
  analysis: SeoAnalysis;
}

function getTagStatus(value: string | undefined, optimal?: { min?: number; max?: number }) {
  if (!value) return { type: 'error', text: 'Missing' };
  
  if (optimal) {
    const length = value.length;
    if (optimal.min && length < optimal.min) return { type: 'warning', text: 'Too short' };
    if (optimal.max && length > optimal.max) return { type: 'warning', text: 'Too long' };
    return { type: 'success', text: 'Good' };
  }
  
  return { type: 'success', text: 'Present' };
}

export function DetailedAnalysis({ analysis }: DetailedAnalysisProps) {
  const { metaTags, ogTags, twitterTags, title } = analysis;
  
  const titleTag = title || metaTags?.title;
  const description = metaTags?.description;
  
  const titleStatus = getTagStatus(titleTag, { min: 30, max: 60 });
  const descriptionStatus = getTagStatus(description, { min: 120, max: 160 });

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Detailed SEO Analysis</h3>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Meta Tags */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Tags className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              Basic Meta Tags
            </h4>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title Tag</span>
                    <Badge 
                      variant={titleStatus.type === 'success' ? 'default' : titleStatus.type === 'warning' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {titleStatus.type === 'success' && <Check className="h-3 w-3 mr-1" />}
                      {titleStatus.type === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {titleStatus.type === 'error' && <X className="h-3 w-3 mr-1" />}
                      {titleStatus.text}
                    </Badge>
                  </div>
                  {titleTag ? (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded break-words">
                        {titleTag}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Length: {titleTag.length} characters (Optimal: 30-60)
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No title tag found</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Meta Description</span>
                    <Badge 
                      variant={descriptionStatus.type === 'success' ? 'default' : descriptionStatus.type === 'warning' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {descriptionStatus.type === 'success' && <Check className="h-3 w-3 mr-1" />}
                      {descriptionStatus.type === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {descriptionStatus.type === 'error' && <X className="h-3 w-3 mr-1" />}
                      {descriptionStatus.text}
                    </Badge>
                  </div>
                  {description ? (
                    <>
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                        {description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Length: {description.length} characters (Optimal: 120-160)
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No meta description found</p>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Meta Keywords</span>
                    <Badge variant="outline" className="ml-2">
                      Not Used
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">Meta keywords are deprecated and not recommended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Open Graph Tags
            </h4>
            <div className="space-y-4">
              {Object.entries(ogTags || {}).map(([property, content]) => (
                <div key={property} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{property}</span>
                      <Badge variant="default" className="ml-2">
                        <Check className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                      {content}
                    </p>
                  </div>
                </div>
              ))}
              
              {!ogTags?.['og:image'] && (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">og:image</span>
                      <Badge variant="secondary" className="ml-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">No og:image meta tag found. Consider adding one for better social media sharing.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Twitter Cards */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter Card Tags
            </h4>
            <div className="space-y-4">
              {Object.entries(twitterTags || {}).map(([name, content]) => (
                <div key={name} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                      <Badge variant="default" className="ml-2">
                        <Check className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                      {content}
                    </p>
                  </div>
                </div>
              ))}
              
              {!twitterTags?.['twitter:card'] && (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">twitter:card</span>
                      <Badge variant="destructive" className="ml-2">
                        <X className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">No Twitter card type specified. Add twitter:card meta tag.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
