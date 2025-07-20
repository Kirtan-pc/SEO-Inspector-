import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SeoAnalysis } from "@shared/schema";

interface ScoreImprovementGuideProps {
  analysis: SeoAnalysis;
}

function getScoreStatus(score: number) {
  if (score >= 80) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
  if (score >= 60) return { status: 'good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  return { status: 'needs-work', color: 'text-red-600', bg: 'bg-red-100' };
}

function getImprovementPotential(currentScore: number) {
  if (currentScore >= 80) return { potential: 100 - currentScore, priority: 'low' };
  if (currentScore >= 60) return { potential: 80 - currentScore, priority: 'medium' };
  return { potential: 80 - currentScore, priority: 'high' };
}

export function ScoreImprovementGuide({ analysis }: ScoreImprovementGuideProps) {
  const { scores } = analysis;
  
  const categories = [
    {
      name: 'Meta Tags',
      score: scores?.meta || 0,
      icon: Target,
      improvements: [
        { condition: !analysis.metaTags?.title, text: 'Add title tag', points: 40 },
        { condition: analysis.metaTags?.title && (analysis.metaTags.title.length < 30 || analysis.metaTags.title.length > 60), text: 'Optimize title length', points: 20 },
        { condition: !analysis.metaTags?.description, text: 'Add meta description', points: 40 },
        { condition: analysis.metaTags?.description && (analysis.metaTags.description.length < 120 || analysis.metaTags.description.length > 160), text: 'Optimize description length', points: 20 },
        { condition: !analysis.metaTags?.viewport, text: 'Add viewport meta tag', points: 20 }
      ]
    },
    {
      name: 'Social Media',
      score: scores?.social || 0,
      icon: TrendingUp,
      improvements: [
        { condition: !analysis.ogTags?.['og:title'], text: 'Add og:title', points: 25 },
        { condition: !analysis.ogTags?.['og:description'], text: 'Add og:description', points: 25 },
        { condition: !analysis.ogTags?.['og:image'], text: 'Add og:image', points: 25 },
        { condition: !analysis.ogTags?.['og:url'], text: 'Add og:url', points: 15 },
        { condition: !analysis.twitterTags?.['twitter:card'], text: 'Add Twitter Card', points: 10 }
      ]
    },
    {
      name: 'Technical',
      score: scores?.technical || 0,
      icon: AlertCircle,
      improvements: [
        { condition: (scores?.technical || 0) < 90, text: 'Optimize page speed', points: 5 },
        { condition: (scores?.technical || 0) < 85, text: 'Add structured data', points: 5 },
        { condition: (scores?.technical || 0) < 80, text: 'Improve mobile experience', points: 10 }
      ]
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          Score Improvement Roadmap
        </h3>

        <div className="space-y-6">
          {categories.map((category) => {
            const scoreStatus = getScoreStatus(category.score);
            const improvement = getImprovementPotential(category.score);
            const applicableImprovements = category.improvements.filter(imp => imp.condition);
            const totalPotentialPoints = applicableImprovements.reduce((sum, imp) => sum + imp.points, 0);
            const potentialScore = Math.min(100, category.score + totalPotentialPoints);
            
            return (
              <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <category.icon className={`h-5 w-5 ${scoreStatus.color}`} />
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <Badge variant={scoreStatus.status === 'excellent' ? 'default' : 'secondary'}>
                      {category.score}/100
                    </Badge>
                  </div>
                  {applicableImprovements.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Potential</div>
                      <div className="font-semibold text-green-600">
                        +{totalPotentialPoints} pts → {potentialScore}/100
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Current Score</span>
                    <span className={`font-medium ${scoreStatus.color}`}>{category.score}%</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  {potentialScore > category.score && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Potential with fixes</span>
                      <span className="font-medium text-green-600">{potentialScore}%</span>
                    </div>
                  )}
                </div>

                {applicableImprovements.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Quick Wins ({applicableImprovements.length} improvements):
                    </div>
                    {applicableImprovements.map((improvement, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <span className="text-sm text-gray-700">{improvement.text}</span>
                        <Badge variant="outline" className="text-xs">
                          +{improvement.points} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>All optimizations implemented!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall improvement summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Overall Impact</h5>
          <div className="text-sm text-blue-800">
            {(() => {
              const totalImprovements = categories.reduce((total, cat) => 
                total + cat.improvements.filter(imp => imp.condition).length, 0
              );
              const totalPoints = categories.reduce((total, cat) => 
                total + cat.improvements.filter(imp => imp.condition).reduce((sum, imp) => sum + imp.points, 0), 0
              );
              
              if (totalImprovements === 0) {
                return "🎉 Your SEO implementation is excellent! All major optimizations are in place.";
              }
              
              const currentOverall = scores?.overall || 0;
              const potentialOverall = Math.min(100, currentOverall + Math.floor(totalPoints / 3));
              
              return `Implementing ${totalImprovements} improvements could boost your overall score from ${currentOverall} to ${potentialOverall} points.`;
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}