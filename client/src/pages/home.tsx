import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlInput } from "@/components/url-input";
import { AnalysisResults } from "@/components/analysis-results";
import { RecentAnalysis } from "@/components/recent-analysis";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SettingsDialog } from "@/components/settings-dialog";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SEO Meta Analyzer</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
              <SettingsDialog />
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
              currentAnalysis={currentAnalysis}
            />
          </aside>
        </div>
      </div>

      {isAnalyzing && <LoadingOverlay />}
    </div>
  );
}
