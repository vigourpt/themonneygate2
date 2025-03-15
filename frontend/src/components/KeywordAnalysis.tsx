import React, { useState, useEffect, useRef } from "react";
import { useUserGuardContext } from "app";
import { DollarSign, Zap, Award, ArrowRight, Search, Save, RefreshCw, ChevronDown, ChevronUp, Calendar, Trash2, Clock, ExternalLink, BarChart2, BookOpen, Filter, CheckCircle } from "lucide-react";
import { Button } from "components/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/Card";
import { useKeywordStore, KeywordMetrics, KeywordAnalysisResult, KeywordSearchParams } from "utils/keywordStore";

export function KeywordAnalysis() {
  const { user } = useUserGuardContext();
  const { search, saveAnalysis, loadAnalyses, analyses, currentAnalysis, loading } = useKeywordStore();
  
  const [activeTab, setActiveTab] = useState<"tools" | "monetization">("tools");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [analysisName, setAnalysisName] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [showSavedAnalyses, setShowSavedAnalyses] = useState(false);
  const [sortMetric, setSortMetric] = useState<"searchVolume" | "cpc" | "competition" | "trafficPotential">("searchVolume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Refs for chart elements
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Load saved analyses on component mount
  useEffect(() => {
    if (user) {
      loadAnalyses(user.uid);
    }
  }, [user, loadAnalyses]);
  
  // Update analysis name when search keyword changes
  useEffect(() => {
    if (currentAnalysis) {
      setAnalysisName(`Analysis for "${currentAnalysis.seedKeyword}"`);
    }
  }, [currentAnalysis]);
  
  // Clear saved message after 3 seconds
  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);
  
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    
    try {
      const params: KeywordSearchParams = {
        seedKeyword: searchKeyword
      };
      await search(params);
    } catch (error) {
      console.error("Error searching keywords:", error);
    }
  };
  
  const handleSaveAnalysis = async () => {
    if (!currentAnalysis || !user) return;
    
    try {
      // Create analysis object from current results
      const analysisToSave = {
        name: analysisName,
        seedKeyword: currentAnalysis.seedKeyword,
        toolKeywords: currentAnalysis.toolKeywords,
        monetizationKeywords: currentAnalysis.monetizationKeywords,
        tags: currentAnalysis.tags
      };
      
      await saveAnalysis(user.uid, analysisToSave);
      setSavedMessage("Analysis saved successfully!");
    } catch (error) {
      console.error("Error saving analysis:", error);
    }
  };
  
  const sortKeywords = (keywords: KeywordMetrics[]) => {
    return [...keywords].sort((a, b) => {
      let aValue, bValue;
      
      if (sortMetric === "competition") {
        // Convert competition level to numeric value
        const competitionValue = { Low: 1, Medium: 2, High: 3 };
        aValue = competitionValue[a.competition];
        bValue = competitionValue[b.competition];
      } else {
        aValue = a[sortMetric] || 0;
        bValue = b[sortMetric] || 0;
      }
      
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  };
  
  const toggleSort = (metric: typeof sortMetric) => {
    if (sortMetric === metric) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortMetric(metric);
      setSortDirection("desc");
    }
  };
  
  // Get current keywords based on active tab
  const currentKeywords = currentAnalysis 
    ? (activeTab === "tools" ? sortKeywords(currentAnalysis.toolKeywords) : sortKeywords(currentAnalysis.monetizationKeywords))
    : [];
    
  // Calculate averages for comparison
  const calculateAverages = () => {
    if (!currentAnalysis) return null;
    
    const toolAvgCpc = currentAnalysis.toolKeywords.reduce((sum, kw) => sum + kw.cpc, 0) / currentAnalysis.toolKeywords.length;
    const monetizationAvgCpc = currentAnalysis.monetizationKeywords.reduce((sum, kw) => sum + kw.cpc, 0) / currentAnalysis.monetizationKeywords.length;
    const cpcRatio = monetizationAvgCpc / toolAvgCpc;
    
    const toolAvgVolume = currentAnalysis.toolKeywords.reduce((sum, kw) => sum + kw.searchVolume, 0) / currentAnalysis.toolKeywords.length;
    const monetizationAvgVolume = currentAnalysis.monetizationKeywords.reduce((sum, kw) => sum + kw.searchVolume, 0) / currentAnalysis.monetizationKeywords.length;
    
    return {
      toolAvgCpc,
      monetizationAvgCpc,
      cpcRatio,
      toolAvgVolume,
      monetizationAvgVolume
    };
  };
  
  const averages = currentAnalysis ? calculateAverages() : null;
  
  // Generate potential value for a keyword
  const calculatePotentialValue = (keyword: KeywordMetrics) => {
    if (keyword.category === "tool") {
      return keyword.searchVolume * (averages?.monetizationAvgCpc || 0) * 0.02; // 2% conversion estimate
    } else {
      return keyword.searchVolume * keyword.cpc * 0.05; // 5% click rate estimate
    }
  };
  
  // Helper function to format large numbers
  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };
  
  // Helper function for competition class
  const getCompetitionClass = (competition: "Low" | "Medium" | "High") => {
    if (competition === "Low") return "bg-green-100 text-green-700";
    if (competition === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };
  
  // Sample historical tool keywords for comparison
  const toolKeywords = [
    {
      keyword: "savings goal tracker",
      searchVolume: "8,100",
      competition: "Low",
      cpc: "$0.42",
      category: "tool"
    },
    {
      keyword: "debt payoff calculator",
      searchVolume: "12,500",
      competition: "Low",
      cpc: "$0.38",
      category: "tool"
    },
    {
      keyword: "mortgage hardship letter template",
      searchVolume: "5,400",
      competition: "Low",
      cpc: "$0.51",
      category: "tool"
    },
    {
      keyword: "budget spreadsheet template",
      searchVolume: "9,700",
      competition: "Low",
      cpc: "$0.47",
      category: "tool"
    },
  ];

  // Sample historical monetization keywords for comparison
  const monetizationKeywords = [
    {
      keyword: "wealth management services",
      searchVolume: "6,200",
      competition: "High",
      cpc: "$15.42",
      category: "service"
    },
    {
      keyword: "debt consolidation companies",
      searchVolume: "8,900",
      competition: "High",
      cpc: "$12.87",
      category: "service"
    },
    {
      keyword: "mortgage refinance rates",
      searchVolume: "7,500",
      competition: "High",
      cpc: "$18.23",
      category: "service"
    },
    {
      keyword: "financial advisor near me",
      searchVolume: "5,800",
      competition: "High",
      cpc: "$16.79",
      category: "service"
    },
  ];

  // Render examples when no analysis is performed yet
  const renderExamples = () => {
    const currentExamples = activeTab === "tools" ? toolKeywords : monetizationKeywords;
    
    return (
      <Card className="overflow-hidden">
        <div className="bg-zinc-50 p-3 border-b">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 font-medium text-sm">Keyword</div>
            <div className="col-span-2 font-medium text-sm text-center">Volume</div>
            <div className="col-span-2 font-medium text-sm text-center">Competition</div>
            <div className="col-span-3 font-medium text-sm text-right">Cost Per Click</div>
          </div>
        </div>
        <CardContent className="p-0">
          {currentExamples.map((keyword, index) => (
            <div 
              key={keyword.keyword} 
              className={`grid grid-cols-12 gap-4 p-3 items-center ${index !== currentExamples.length - 1 ? "border-b" : ""}`}
            >
              <div className="col-span-5 text-sm">"{keyword.keyword}"</div>
              <div className="col-span-2 text-sm text-center">{keyword.searchVolume}</div>
              <div className="col-span-2 text-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getCompetitionClass(keyword.competition)}`}>
                  {keyword.competition}
                </span>
              </div>
              <div className="col-span-3 text-sm text-right font-medium">
                {keyword.cpc}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };
  
  // Generate a table for current analysis results
  const renderAnalysisResults = () => {
    return (
      <Card className="overflow-hidden">
        <div className="bg-zinc-50 p-3 border-b">
          <div className="grid grid-cols-12 gap-4">
            <div 
              className="col-span-4 font-medium text-sm flex items-center cursor-pointer"
              onClick={() => toggleSort("searchVolume")}
            >
              Keyword
              {sortMetric === "searchVolume" && (
                <span className="ml-1">{sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              )}
            </div>
            <div 
              className="col-span-2 font-medium text-sm text-center cursor-pointer"
              onClick={() => toggleSort("searchVolume")}
            >
              Volume
              {sortMetric === "searchVolume" && (
                <span className="ml-1">{sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              )}
            </div>
            <div 
              className="col-span-2 font-medium text-sm text-center cursor-pointer"
              onClick={() => toggleSort("competition")}
            >
              Competition
              {sortMetric === "competition" && (
                <span className="ml-1">{sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              )}
            </div>
            <div 
              className="col-span-2 font-medium text-sm text-right cursor-pointer"
              onClick={() => toggleSort("cpc")}
            >
              Cost Per Click
              {sortMetric === "cpc" && (
                <span className="ml-1">{sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              )}
            </div>
            <div 
              className="col-span-2 font-medium text-sm text-right cursor-pointer"
              onClick={() => toggleSort("trafficPotential")}
            >
              Potential Value
              {sortMetric === "trafficPotential" && (
                <span className="ml-1">{sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              )}
            </div>
          </div>
        </div>
        <CardContent className="p-0 max-h-80 overflow-y-auto">
          {currentKeywords.map((keyword, index) => {
            const potentialValue = calculatePotentialValue(keyword);
            return (
              <div 
                key={keyword.keyword} 
                className={`grid grid-cols-12 gap-4 p-3 items-center hover:bg-zinc-50 ${index !== currentKeywords.length - 1 ? "border-b" : ""}`}
              >
                <div className="col-span-4 text-sm">"{keyword.keyword}"</div>
                <div className="col-span-2 text-sm text-center">{formatNumber(keyword.searchVolume)}</div>
                <div className="col-span-2 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCompetitionClass(keyword.competition)}`}>
                    {keyword.competition}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-right font-medium">
                  ${keyword.cpc.toFixed(2)}
                </div>
                <div className="col-span-2 text-sm text-right font-medium text-green-600">
                  ${potentialValue.toFixed(2)}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };
  
  // Render saved analyses list
  const renderSavedAnalyses = () => {
    if (analyses.length === 0) {
      return (
        <div className="text-center p-6 bg-zinc-50 rounded-lg border">
          <BookOpen className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
          <h4 className="text-zinc-500 font-medium mb-1">No saved analyses yet</h4>
          <p className="text-zinc-400 text-sm">Search for keywords and save your analyses to see them here</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="p-3 border rounded-lg hover:border-blue-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{analysis.name}</h4>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Trash2 size={14} className="text-zinc-500" />
                </Button>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs text-zinc-500">
              <Clock size={12} className="mr-1" />
              {new Date(analysis.lastUpdated).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center">
              <div className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full mr-2">
                {analysis.toolKeywords.length} tool keywords
              </div>
              <div className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                {analysis.monetizationKeywords.length} monetization keywords
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render value comparison chart
  const renderValueComparison = () => {
    if (!currentAnalysis || !averages) return null;
    
    // Maximum CPC values for scaling
    const maxToolCpc = Math.max(...currentAnalysis.toolKeywords.map(kw => kw.cpc));
    const maxMonetizationCpc = Math.max(...currentAnalysis.monetizationKeywords.map(kw => kw.cpc));
    
    // Get top keywords by volume and CPC
    const topToolByVolume = [...currentAnalysis.toolKeywords].sort((a, b) => b.searchVolume - a.searchVolume)[0];
    const topMonetizationByCpc = [...currentAnalysis.monetizationKeywords].sort((a, b) => b.cpc - a.cpc)[0];
    
    return (
      <div className="mt-6 p-4 bg-white rounded-lg border">
        <h4 className="font-medium mb-3">Value Gap Analysis</h4>
        
        <div className="relative py-4" ref={chartContainerRef}>
          {/* Value ratio visualization */}
          <div className="flex items-center mb-6">
            <div className="w-full relative">
              <div className="h-10 w-full bg-zinc-100 rounded-lg overflow-hidden flex">
                <div 
                  className="h-full bg-blue-500 rounded-l-lg flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(100 / (averages.cpcRatio + 1))}%` }}
                >
                  ${averages.toolAvgCpc.toFixed(2)}
                </div>
                <div 
                  className="h-full bg-green-500 rounded-r-lg flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(100 * averages.cpcRatio / (averages.cpcRatio + 1))}%` }}
                >
                  ${averages.monetizationAvgCpc.toFixed(2)}
                </div>
              </div>
              <div className="absolute -top-4 left-0 right-0 flex justify-between">
                <span className="text-xs text-zinc-500">Tool Keywords Avg CPC</span>
                <span className="text-xs text-zinc-500">Monetization Keywords Avg CPC</span>
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <span className="text-sm font-medium text-indigo-600">
                  {averages.cpcRatio.toFixed(1)}x Value Multiplier
                </span>
              </div>
            </div>
          </div>
          
          {/* Best opportunities highlight */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h5 className="text-sm font-medium mb-2 text-blue-700">Best Tool Keyword</h5>
              <div className="text-xs font-semibold mb-1">{topToolByVolume.keyword}</div>
              <div className="flex justify-between text-xs text-blue-800">
                <span>Volume: {formatNumber(topToolByVolume.searchVolume)}</span>
                <span>CPC: ${topToolByVolume.cpc.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h5 className="text-sm font-medium mb-2 text-green-700">Best Monetization Keyword</h5>
              <div className="text-xs font-semibold mb-1">{topMonetizationByCpc.keyword}</div>
              <div className="flex justify-between text-xs text-green-800">
                <span>Volume: {formatNumber(topMonetizationByCpc.searchVolume)}</span>
                <span>CPC: ${topMonetizationByCpc.cpc.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Keyword Value Analysis</CardTitle>
                  <CardDescription>Find lucrative keywords for your Money Door strategy</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSavedAnalyses(!showSavedAnalyses)}
                  >
                    {showSavedAnalyses ? "Hide" : "Show"} Saved Analyses
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Keyword search form */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Find Keywords for Your Tool or Template</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Enter a keyword (e.g., budget planner, debt calculator, etc.)"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    disabled={loading || !searchKeyword.trim()}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Search for keywords related to your tool to find valuable monetization opportunities.
                </p>
              </div>
              
              {/* Results tabs */}
              {currentAnalysis && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Results for "{currentAnalysis.seedKeyword}"</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeTab === "tools" ? "primary" : "outline"} 
                        size="sm"
                        onClick={() => setActiveTab("tools")}
                      >
                        Tool Keywords
                      </Button>
                      <Button 
                        variant={activeTab === "monetization" ? "primary" : "outline"} 
                        size="sm"
                        onClick={() => setActiveTab("monetization")}
                      >
                        Monetization Keywords
                      </Button>
                    </div>
                  </div>
                  
                  {/* Show result metrics */}
                  {renderAnalysisResults()}
                  
                  {/* Save analysis option */}
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex-1 max-w-md">
                      <label className="block text-sm font-medium mb-1">Analysis Name</label>
                      <input
                        type="text"
                        value={analysisName}
                        onChange={(e) => setAnalysisName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleSaveAnalysis}
                      disabled={!analysisName.trim() || loading}
                      className="ml-3"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Analysis
                    </Button>
                  </div>
                  
                  {/* Saved confirmation message */}
                  {savedMessage && (
                    <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-lg flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {savedMessage}
                    </div>
                  )}
                  
                  {/* Value comparison visualization */}
                  {renderValueComparison()}
                </div>
              )}
              
              {/* Show examples if no analysis has been performed */}
              {!currentAnalysis && !loading && (
                <div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">How to Find Profitable Keyword Opportunities</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Enter a keyword related to a tool or template you want to create. The analysis will find low-competition 
                      tool keywords and high-value monetization keywords to create your Hidden Money Door.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium">Example Keywords</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeTab === "tools" ? "primary" : "outline"} 
                        size="sm"
                        onClick={() => setActiveTab("tools")}
                      >
                        Tool Keywords
                      </Button>
                      <Button 
                        variant={activeTab === "monetization" ? "primary" : "outline"} 
                        size="sm"
                        onClick={() => setActiveTab("monetization")}
                      >
                        Monetization Keywords
                      </Button>
                    </div>
                  </div>
                  
                  {renderExamples()}
                </div>
              )}
              
              {/* Loading state */}
              {loading && !currentAnalysis && (
                <div className="text-center py-10">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-zinc-600">Analyzing keywords and finding monetization opportunities...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {showSavedAnalyses ? (
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Your Saved Analyses</CardTitle>
                <CardDescription>Previously saved keyword research</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {renderSavedAnalyses()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Finding Hidden Money Doors</CardTitle>
                <CardDescription>How to leverage keyword value gaps</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-blue-600 mr-2" />
                    <h5 className="font-medium">Low-Competition Keywords</h5>
                  </div>
                  <p className="text-xs text-zinc-600">Create content for keywords with lower cost-per-click (CPC) that are easier to rank for.</p>
                </div>
                
                <div className="flex justify-center">
                  <ArrowDown className="h-6 w-6 text-zinc-300" />
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <h5 className="font-medium">Strategic Redirection</h5>
                  </div>
                  <p className="text-xs text-zinc-600">Your free tool connects users to high-value monetization opportunities.</p>
                  <div className="flex items-center mt-2 justify-center">
                    <div className="text-center px-3 py-1 bg-blue-100 rounded-l-lg">
                      <div className="text-xs text-blue-700">Free Template</div>
                      <div className="text-xs font-medium text-blue-900">$0.45</div>
                    </div>
                    <div className="px-2 text-xs text-zinc-400">↔</div>
                    <div className="text-center px-3 py-1 bg-green-100 rounded-r-lg">
                      <div className="text-xs text-green-700">Premium Service</div>
                      <div className="text-xs font-medium text-green-900">$15+</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowDown className="h-6 w-6 text-zinc-300" />
                </div>
                
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-indigo-600 mr-2" />
                    <h5 className="font-medium">Monetization</h5>
                  </div>
                  <p className="text-xs text-zinc-600">Earn through affiliate commissions, ads, and premium service referrals.</p>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Value Gap Strategy</h5>
                  <p className="text-xs text-zinc-600 mb-2">The most profitable Hidden Money Doors have a significant gap between:</p>
                  <div className="space-y-1 text-xs text-zinc-600">
                    <div className="flex items-center">
                      <BarChart2 className="h-3 w-3 text-zinc-400 mr-1" />
                      <span>CPC of your content keywords</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart2 className="h-3 w-3 text-zinc-400 mr-1" />
                      <span>CPC of monetization keywords</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">Look for at least a 10x difference in CPC value.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    </div>
  );
}
