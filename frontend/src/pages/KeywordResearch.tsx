import React, { useState } from "react";
import { KeywordResearch as KeywordResearchComponent } from "components/KeywordResearch";
import { Lightbulb, Check, ChevronRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "components/Alert";

export default function KeywordResearch() {
  const [showTips, setShowTips] = useState(true);

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-2">Keyword Research</h1>
      <p className="text-zinc-600 mb-6">
        Find profitable "money door" opportunities by analyzing high-value advertising niches.
      </p>

      {showTips && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Keyword Research Tips</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">
              The key to the "Money Door" strategy is finding opportunities where low-competition keywords can lead to high-value monetization niches.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Start with broad niche ideas like "budgeting", "investing", or "retirement planning"</li>
              <li>Look for tool keywords with low competition but good search volume</li>
              <li>Identify related monetization keywords with high CPC (Cost Per Click)</li>
              <li>Create tools around low-competition keywords, then monetize with high-CPC affiliate programs</li>
            </ul>
            <button 
              className="mt-2 flex items-center text-sm text-amber-800 hover:text-amber-900"
              onClick={() => setShowTips(false)}
            >
              <Check className="h-3 w-3 mr-1" />
              Hide Tips
            </button>
          </AlertDescription>
        </Alert>
      )}

      <KeywordResearchComponent />

      <div className="mt-8 bg-zinc-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">How to Use This Data</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="mr-4 p-2 rounded-full bg-blue-100 h-fit text-blue-700 flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Create Tools for Low-Competition Keywords</h3>
              <p className="text-zinc-600 text-sm">
                Build useful tools that target the low-competition keywords you've identified. These tools will attract free organic traffic with minimal marketing effort.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 p-2 rounded-full bg-blue-100 h-fit text-blue-700 flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Insert High-Value Monetization Keywords</h3>
              <p className="text-zinc-600 text-sm">
                Strategically incorporate high-CPC keywords into your tools as affiliate links or recommended resources. This converts free traffic into high-value monetization opportunities.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 p-2 rounded-full bg-blue-100 h-fit text-blue-700 flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Leverage the Traffic Gap</h3>
              <p className="text-zinc-600 text-sm">
                Take advantage of the pricing gap between low-competition traffic acquisition and high-value monetization keywords. This is the essence of the "Money Door" strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
