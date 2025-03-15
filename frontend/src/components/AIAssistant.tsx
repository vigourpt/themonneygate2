import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/Card";
import { Button } from "components/Button";
import { Send, Sparkles, AlertCircle, Check, Loader2 } from "lucide-react";

export interface AIAssistantProps {
  onComplete: (results: any) => void;
}

// Types for the input options
type InputType = "product" | "url" | "niche";

export function AIAssistant({ onComplete }: AIAssistantProps) {
  const [inputType, setInputType] = useState<InputType>("niche");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock AI processing function (in a real app, this would call an API endpoint)
  // Here we use simulated responses to demonstrate the concept
  const processWithAI = async () => {
    if (!inputValue.trim()) {
      setAiStatus("Please enter a value for processing.");
      return;
    }

    setIsProcessing(true);
    setAiStatus("Analyzing your input...");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock responses based on input type
    let results;
    
    if (inputType === "product") {
      setAiStatus("Generating tool ideas related to your product...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      results = {
        toolIdeas: [
          "ROI Calculator for " + inputValue,
          inputValue + " Comparison Tool",
          "Buyer's Guide for " + inputValue,
          inputValue + " Usage Tracker",
          inputValue + " Budget Spreadsheet",
          "Ultimate " + inputValue + " Checklist",
          inputValue + " Selection Matrix"
        ],
        highValueKeywords: [
          inputValue + " best practices",
          "how to choose " + inputValue,
          "professional " + inputValue,
          inputValue + " expert"
        ],
        monetizationStrategies: [
          "Affiliate links to premium " + inputValue + " brands",
          "Sponsored content from " + inputValue + " providers",
          "Premium " + inputValue + " consultation services"
        ]
      };
    } 
    else if (inputType === "url") {
      setAiStatus("Analyzing website content and market opportunities...");
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      results = {
        websiteAnalysis: {
          primaryTopic: "Financial Services",
          contentGaps: ["Interactive tools", "Downloadable templates", "Beginner guides", "Mobile-friendly resources"],
          trafficValue: "Medium-High"
        },
        toolIdeas: [
          "Budget Planner Extension",
          "Financial Health Quiz",
          "Savings Goal Calculator",
          "Debt Snowball Worksheet",
          "Investment Return Calculator",
          "Retirement Readiness Scorecard"
        ],
        monetizationStrategies: [
          "Premium financial consultation upsell",
          "Financial product affiliate links",
          "Email course on financial wellness"
        ]
      };
    } 
    else { // niche
      setAiStatus("Exploring money doors in the " + inputValue + " niche...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      results = {
        nichePotential: "High",
        lowCompetitionKeywords: [
          inputValue + " basics",
          "getting started with " + inputValue,
          inputValue + " for beginners",
          "simple " + inputValue + " guide",
          "DIY " + inputValue + " advice",
          inputValue + " step by step",
          "affordable " + inputValue + " options"
        ],
        highValueKeywords: [
          "professional " + inputValue + " services",
          inputValue + " consultation",
          "enterprise " + inputValue + " solutions",
          "premium " + inputValue + " tools"
        ],
        recommendedTools: [
          inputValue + " ROI Calculator",
          inputValue + " Checklist Template",
          "Beginner's Guide to " + inputValue,
          inputValue + " Decision Matrix"
        ]
      };
    }
    
    setAiResponse(results);
    setAiStatus("Analysis complete");
    setIsProcessing(false);
  };

  const handleComplete = () => {
    if (aiResponse) {
      onComplete(aiResponse);
      
      // Reset the form
      setInputValue("");
      setAiResponse(null);
      setAiStatus(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 border-b pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>AI Money Door Finder</CardTitle>
              <CardDescription>Let AI analyze your starting point and recommend opportunities</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!aiResponse ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">What's your starting point?</label>
              <div className="flex items-center space-x-4 mb-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inputType"
                    checked={inputType === "product"}
                    onChange={() => setInputType("product")}
                    className="mr-2"
                  />
                  <span>Product</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inputType"
                    checked={inputType === "url"}
                    onChange={() => setInputType("url")}
                    className="mr-2"
                  />
                  <span>Website URL</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inputType"
                    checked={inputType === "niche"}
                    onChange={() => setInputType("niche")}
                    className="mr-2"
                  />
                  <span>Niche</span>
                </label>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputType === "product" ? "Enter a product (e.g., 'fitness tracker')" :
                              inputType === "url" ? "Enter a website URL (e.g., 'https://example.com')" :
                              "Enter a niche (e.g., 'personal finance')"}
                  className="w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 disabled:text-zinc-400"
                  onClick={processWithAI}
                  disabled={isProcessing || !inputValue.trim()}
                >
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
              
              {aiStatus && (
                <div className={`mt-4 p-3 rounded-lg ${isProcessing ? 'bg-blue-50' : 'bg-green-50'}`}>
                  {isProcessing ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2 text-blue-600" />
                      <span>{aiStatus}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-600" />
                      <span>{aiStatus}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start">
              <Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Analysis Complete</h4>
                <p className="text-green-700 text-sm">We've analyzed your input and found several money door opportunities!</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {inputType === "product" && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tool Ideas for Your Product</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResponse.toolIdeas.map((idea: string, i: number) => (
                        <li key={i}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">High-Value Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.highValueKeywords.map((keyword: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monetization Strategies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResponse.monetizationStrategies.map((strategy: string, i: number) => (
                        <li key={i}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {inputType === "url" && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Website Analysis</h3>
                    <div className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-zinc-500">Primary Topic:</p>
                          <p className="font-medium">{aiResponse.websiteAnalysis.primaryTopic}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">Traffic Value:</p>
                          <p className="font-medium">{aiResponse.websiteAnalysis.trafficValue}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-zinc-500">Content Gaps:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {aiResponse.websiteAnalysis.contentGaps.map((gap: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recommended Tools</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResponse.toolIdeas.map((idea: string, i: number) => (
                        <li key={i}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monetization Strategies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResponse.monetizationStrategies.map((strategy: string, i: number) => (
                        <li key={i}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {inputType === "niche" && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Niche Potential: <span className="text-green-600">{aiResponse.nichePotential}</span></h3>
                    <p className="text-zinc-600">This niche has strong potential for Hidden Money Doors.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Low-Competition Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.lowCompetitionKeywords.map((keyword: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">High-Value Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.highValueKeywords.map((keyword: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recommended Tools to Create</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiResponse.recommendedTools.map((tool: string, i: number) => (
                        <li key={i}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setInputValue("");
                setAiResponse(null);
                setAiStatus(null);
              }}>
                Start Over
              </Button>
              <Button variant="primary" onClick={handleComplete}>
                Use These Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
