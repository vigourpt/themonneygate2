import React, { useState } from "react";
import { Search, ArrowRight, Loader2, PlusCircle, Info, DollarSign, BarChart } from "lucide-react";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { Alert } from "components/Alert";
import brain from "brain";
import { toast, Toaster } from "sonner";

interface KeywordMetrics {
  keyword: string;
  search_volume: number;
  competition: string;
  cpc: number;
  category: string;
  difficulty?: number;
  traffic_potential?: number;
}

interface KeywordAnalysis {
  seed_keyword: string;
  tool_keywords: KeywordMetrics[];
  monetization_keywords: KeywordMetrics[];
  tags: string[];
  is_sample_data?: boolean;
}

interface Props {
  onMonetizationKeywordSelect?: (keyword: string) => void;
  onToolKeywordSelect?: (keyword: string) => void;
  compact?: boolean;
}

export function KeywordResearch({ onMonetizationKeywordSelect, onToolKeywordSelect, compact = false }: Props) {
  const [seedKeyword, setSeedKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<KeywordAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Use sonner toast directly

  const handleAnalyzeKeyword = async () => {
    if (!seedKeyword.trim()) {
      setError("Please enter a keyword to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Call the fixed version of the backend API
      // First try the fixed endpoint
      try {
        const response = await brain.analyze_keywords_fixed({
          seed_keyword: seedKeyword.trim(),
          limit: 10
        });

        const result = await response.json();
        setAnalysisResult(result);
      } catch (primaryErr) {
        console.warn("Primary API failed, trying fallback:", primaryErr);
        // If that fails, try the fallback endpoint
        const fallbackResponse = await brain.analyze_keywords_fallback_fixed({
          seed_keyword: seedKeyword.trim(),
          limit: 10
        });

        const fallbackResult = await fallbackResponse.json();
        setAnalysisResult(fallbackResult);
      }
    } catch (err) {
      console.error("Error analyzing keywords:", err);
      setError("Failed to analyze keywords. Please try again later.");
      toast.error("Error", {
        description: "Failed to analyze keywords. Please try again later."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeywordSelect = (keyword: string, category: string) => {
    if (category === "tool" && onToolKeywordSelect) {
      onToolKeywordSelect(keyword);
      toast.success("Tool Keyword Selected", {
        description: `You selected "${keyword}" as your tool keyword`
      });
    } else if (category === "monetization" && onMonetizationKeywordSelect) {
      onMonetizationKeywordSelect(keyword);
      toast.success("Monetization Keyword Selected", {
        description: `You selected "${keyword}" as your monetization keyword`
      });
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Calculate progress bar width based on max volume in the set
  const getVolumeBarWidth = (volume: number, category: string) => {
    if (!analysisResult) return "0%";
    
    const maxVolume = Math.max(
      ...analysisResult[category === "tool" ? "tool_keywords" : "monetization_keywords"]
        .map(kw => kw.search_volume)
    );

    return `${Math.min(100, (volume / maxVolume) * 100)}%`;
  };

  const getCpcBarWidth = (cpc: number) => {
    if (!analysisResult) return "0%";
    
    const maxCpc = Math.max(
      ...analysisResult.monetization_keywords.map(kw => kw.cpc)
    );

    return `${Math.min(100, (cpc / maxCpc) * 100)}%`;
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return "bg-zinc-300";
    if (difficulty < 30) return "bg-green-500";
    if (difficulty < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-zinc-600";
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      {!compact && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Keyword Research Tool</h2>
          <p className="text-zinc-600">
            Discover low-competition keywords for your tools and high-value monetization opportunities.
          </p>
        </div>
      )}

      <Card>
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Enter a seed keyword (e.g. budgeting, savings, investing)"
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyzeKeyword()}
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={isAnalyzing}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleAnalyzeKeyword}
              disabled={isAnalyzing || !seedKeyword.trim()}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Keywords</>
              )}
            </Button>
          </div>

          {error && (
            <Alert
              variant="error"
              title="Error"
              message={error}
              className="mt-4"
            />
          )}

          {analysisResult && (
            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool Keywords */}
                <Card className="border">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-md flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Low-Competition Tool Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-xs text-zinc-500 mb-1 flex justify-between">
                      <span>Keyword</span>
                      <div className="flex space-x-6">
                        <span className="w-16 text-right">Volume</span>
                        <span className="w-16 text-right">Competition</span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 relative">
                      <div className="absolute top-0 right-0 w-full h-10 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
                      <div className="absolute bottom-0 right-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
                      <div className="text-center text-xs text-blue-600 font-medium mb-2 sticky top-0 bg-blue-50 py-1 rounded-md shadow-sm z-10">⬇️ Scroll for more keywords ⬇️</div>
                      {analysisResult.tool_keywords.map((kw, i) => (
                        <div
                          key={i}
                          className="p-2 hover:bg-blue-50 rounded-md transition-colors relative group"
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate flex-1 mr-4">{kw.keyword}</div>
                            <div className="flex space-x-6 items-center">
                              <div className="w-16 text-right text-sm">{formatVolume(kw.search_volume)}</div>
                              <div className={`w-16 text-right text-sm font-medium ${getCompetitionColor(kw.competition)}`}>
                                {kw.competition}
                              </div>
                            </div>
                          </div>

                          {/* Progress bars */}
                          <div className="mt-1.5">
                            <div className="text-xs text-zinc-500 mb-0.5">Search Volume</div>
                            <div className="w-full bg-zinc-100 rounded-full h-1.5 relative overflow-hidden">
                              <div
                                className="absolute h-full bg-blue-500 rounded-full"
                                style={{ width: getVolumeBarWidth(kw.search_volume, "tool") }}
                              ></div>
                            </div>
                          </div>

                          {kw.difficulty !== undefined && (
                            <div className="mt-1.5">
                              <div className="text-xs text-zinc-500 mb-0.5 flex justify-between">
                                <span>Difficulty</span>
                                <span>{kw.difficulty}/100</span>
                              </div>
                              <div className="w-full bg-zinc-100 rounded-full h-1.5 relative overflow-hidden">
                                <div
                                  className={`absolute h-full ${getDifficultyColor(kw.difficulty)} rounded-full`}
                                  style={{ width: `${kw.difficulty}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {onToolKeywordSelect && (
                            <button
                              onClick={() => handleKeywordSelect(kw.keyword, "tool")}
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <div className="flex">
                        <Info className="h-4 w-4 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          These low-competition keywords are ideal for creating tools and content that can attract free organic traffic.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monetization Keywords */}
                <Card className="border">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-md flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      High-Value Monetization Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-xs text-zinc-500 mb-1 flex justify-between">
                      <span>Keyword</span>
                      <div className="flex space-x-6">
                        <span className="w-16 text-right">CPC</span>
                        <span className="w-16 text-right">Volume</span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 relative">
                      <div className="absolute top-0 right-0 w-full h-10 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
                      <div className="absolute bottom-0 right-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
                      <div className="text-center text-xs text-green-600 font-medium mb-2 sticky top-0 bg-green-50 py-1 rounded-md shadow-sm z-10">⬇️ Scroll for more keywords ⬇️</div>
                      {analysisResult.monetization_keywords.map((kw, i) => (
                        <div
                          key={i}
                          className="p-2 hover:bg-green-50 rounded-md transition-colors relative group"
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate flex-1 mr-4">{kw.keyword}</div>
                            <div className="flex space-x-6 items-center">
                              <div className="w-16 text-right text-sm">${kw.cpc.toFixed(2)}</div>
                              <div className="w-16 text-right text-sm">{formatVolume(kw.search_volume)}</div>
                            </div>
                          </div>

                          {/* Progress bars */}
                          <div className="mt-1.5">
                            <div className="text-xs text-zinc-500 mb-0.5">Cost Per Click</div>
                            <div className="w-full bg-zinc-100 rounded-full h-1.5 relative overflow-hidden">
                              <div
                                className="absolute h-full bg-green-500 rounded-full"
                                style={{ width: getCpcBarWidth(kw.cpc) }}
                              ></div>
                            </div>
                          </div>

                          {kw.difficulty !== undefined && (
                            <div className="mt-1.5">
                              <div className="text-xs text-zinc-500 mb-0.5 flex justify-between">
                                <span>Difficulty</span>
                                <span>{kw.difficulty}/100</span>
                              </div>
                              <div className="w-full bg-zinc-100 rounded-full h-1.5 relative overflow-hidden">
                                <div
                                  className={`absolute h-full ${getDifficultyColor(kw.difficulty)} rounded-full`}
                                  style={{ width: `${kw.difficulty}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {onMonetizationKeywordSelect && (
                            <button
                              onClick={() => handleKeywordSelect(kw.keyword, "monetization")}
                              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-green-50 rounded-md">
                      <div className="flex">
                        <Info className="h-4 w-4 text-green-700 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-700">
                          Target these high-CPC keywords for monetization via affiliate programs or paid advertising.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysisResult.is_sample_data && (
                <div className="mt-4 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This is sample data. API returned no results for your query. The data shown is for demonstration purposes only.
                    </p>
                  </div>
                </div>
              )}

              {/* Money Door Strategy */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-blue-700" />
                  Money Door Strategy
                </h3>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="bg-white rounded-lg p-3 border mb-4 md:mb-0 md:mr-4">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Create Content For:</p>
                        <p className="text-sm text-blue-800 font-bold">
                          {analysisResult.tool_keywords[0]?.keyword || ""}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatVolume(analysisResult.tool_keywords[0]?.search_volume || 0)} searches/mo | {analysisResult.tool_keywords[0]?.competition} competition
                        </p>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-6 w-6 text-zinc-400 mx-4 hidden md:block" />
                  <div className="rotate-90 md:hidden my-2">
                    <ArrowRight className="h-6 w-6 text-zinc-400" />
                  </div>

                  <div className="bg-white rounded-lg p-3 border mb-4 md:mb-0 md:mr-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Monetize With:</p>
                        <p className="text-sm text-green-800 font-bold">
                          {analysisResult.monetization_keywords[0]?.keyword || ""}
                        </p>
                        <p className="text-xs text-zinc-500">
                          ${analysisResult.monetization_keywords[0]?.cpc.toFixed(2) || "0.00"}/click | {formatVolume(analysisResult.monetization_keywords[0]?.search_volume || 0)} searches/mo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex-1">
                    <p className="text-sm text-blue-800">Strategy:</p>
                    <p className="text-sm">Create tools and content targeting <strong>{analysisResult.tool_keywords[0]?.keyword}</strong>, then redirect this traffic to <strong>{analysisResult.monetization_keywords[0]?.keyword}</strong> affiliate offers for maximum revenue.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
