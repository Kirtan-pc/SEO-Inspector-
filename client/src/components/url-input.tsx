import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SeoAnalysis } from "@shared/schema";

interface UrlInputProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (analysis: SeoAnalysis) => void;
}

export function UrlInput({ onAnalysisStart, onAnalysisComplete }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (analysis: SeoAnalysis) => {
      onAnalysisComplete(analysis);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${analysis.domain}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    onAnalysisStart();
    analyzeMutation.mutate(url.trim());
  };

  const handleSampleUrl = (sampleUrl: string) => {
    setUrl(`https://${sampleUrl}`);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyze Website SEO</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="font-mono text-sm"
              disabled={analyzeMutation.isPending}
            />
          </div>
          <Button 
            type="submit" 
            disabled={analyzeMutation.isPending || !url.trim()}
            className="min-w-[120px]"
          >
            {analyzeMutation.isPending ? (
              "Analyzing..."
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Try:</span>
          <button 
            type="button"
            onClick={() => handleSampleUrl("github.com")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            github.com
          </button>
          <button 
            type="button"
            onClick={() => handleSampleUrl("stripe.com")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            stripe.com
          </button>
          <button 
            type="button"
            onClick={() => handleSampleUrl("tailwindcss.com")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            tailwindcss.com
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
