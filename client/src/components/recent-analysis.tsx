import { History, RotateCcw, Trash2, Download, Share, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { exportAnalysisToPDF } from "@/lib/pdf-export";
import type { SeoAnalysis } from "@shared/schema";

interface RecentAnalysisProps {
  analyses: SeoAnalysis[];
  onLoadAnalysis: (id: number) => void;
  onRefresh: () => void;
  currentAnalysis?: SeoAnalysis | null;
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

export function RecentAnalysis({ analyses, onLoadAnalysis, onRefresh, currentAnalysis }: RecentAnalysisProps) {
  const { toast } = useToast();

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/analyses");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recent"] });
      onRefresh();
      toast({
        title: "History Cleared",
        description: "All analysis history has been cleared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleReanalyze = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    // TODO: Implement reanalysis
    console.log('Reanalyzing:', url);
  };

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  const handleExportPDF = async () => {
    if (!currentAnalysis) {
      toast({
        title: "No Analysis Selected",
        description: "Please select an analysis to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      await exportAnalysisToPDF({ 
        analysis: currentAnalysis,
        includeRecommendations: true 
      });
      toast({
        title: "PDF Exported",
        description: `SEO analysis for ${currentAnalysis.domain} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="sticky top-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <History className="h-5 w-5 text-gray-600 mr-2" />
            Recent Analysis
          </h3>
          
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onLoadAnalysis(analysis.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${getScoreColor(analysis.scores?.overall || 0)}`}></div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {analysis.title || analysis.domain}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 font-mono truncate">
                    {analysis.domain}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(analysis.analyzedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-right">
                  <span className={`text-sm font-semibold ${
                    (analysis.scores?.overall || 0) >= 80 ? 'text-green-600' :
                    (analysis.scores?.overall || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {analysis.scores?.overall || 0}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => handleReanalyze(e, analysis.url)}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {analyses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No recent analyses</p>
                <p className="text-gray-400 text-xs mt-1">Analyze a website to get started</p>
              </div>
            )}
          </div>
          
          {analyses.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleClearHistory}
                disabled={clearHistoryMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {clearHistoryMutation.isPending ? "Clearing..." : "Clear History"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleExportPDF}
              disabled={!currentAnalysis}
            >
              <Download className="h-4 w-4 mr-3" />
              Export PDF Report
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Share className="h-4 w-4 mr-3" />
              Share Analysis
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-3" />
              Schedule Recheck
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
