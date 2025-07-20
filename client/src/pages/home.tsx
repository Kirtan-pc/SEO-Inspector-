import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Settings, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlInput } from "@/components/url-input";
import { AnalysisResults } from "@/components/analysis-results";
import { RecentAnalysis } from "@/components/recent-analysis";
import { LoadingOverlay } from "@/components/loading-overlay";
import type { SeoAnalysis } from "@shared/schema";

export default function Home() {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: recentAnalyses, refetch: refetchRecent } = useQuery<SeoAnalysis[]>({
    queryKey: ["/api/recent"],
  });

  const { data: currentAnalysis } = useQuery<SeoAnalysis>({
    queryKey: ["/api/analysis", selectedAnalysisId],
    enabled: !!selectedAnalysisId,
  });

  const handleAnalysisComplete = (analysis: SeoAnalysis) => {
    setSelectedAnalysisId(analysis.id);
    setIsAnalyzing(false);
    refetchRecent();
  };

  const handleLoadAnalysis = (id: number) => {
    setSelectedAnalysisId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">SEO Meta Analyzer</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            <UrlInput 
              onAnalysisStart={() => setIsAnalyzing(true)}
              onAnalysisComplete={handleAnalysisComplete}
            />
            
            {currentAnalysis && (
              <AnalysisResults analysis={currentAnalysis} />
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <RecentAnalysis 
              analyses={recentAnalyses || []}
              onLoadAnalysis={handleLoadAnalysis}
              onRefresh={refetchRecent}
            />
          </aside>
        </div>
      </div>

      {isAnalyzing && <LoadingOverlay />}
    </div>
  );
}
