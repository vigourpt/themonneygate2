import React from "react";
import { TrendingUp, DollarSign, Users, FileText } from "lucide-react";

export function MoneyFlowVisualization() {
  return (
    <div className="w-full bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Understanding Hidden Money Doors</h3>
      
      <div className="relative">
        {/* Flow Chart */}
        <div className="flex flex-col md:flex-row items-center justify-between relative gap-6 md:gap-4 py-8">
          {/* Step 1: Free Content */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 w-full md:w-64 relative z-10">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <h4 className="font-medium">Free/Low-Cost Content</h4>
            </div>
            <p className="text-sm text-zinc-600">Tools, templates, calculators that solve specific problems</p>
            <div className="flex items-center mt-3">
              <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-2 font-medium">Low Competition</div>
              <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Easy to Create</div>
            </div>
          </div>
          
          {/* Arrow Section */}
          <div className="flex flex-col items-center relative z-10">
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
            <div className="md:hidden h-16 w-0.5 bg-gradient-to-b from-blue-400 to-green-400"></div>
            <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white text-xs rounded-full px-3 py-1 my-2 font-medium">
              Strategic Redirection
            </div>
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
            <div className="md:hidden h-16 w-0.5 bg-gradient-to-b from-blue-400 to-green-400"></div>
          </div>
          
          {/* Step 2: Audience Building */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 w-full md:w-64 relative z-10">
            <div className="flex items-center mb-2">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-indigo-700" />
              </div>
              <h4 className="font-medium">Audience Building</h4>
            </div>
            <p className="text-sm text-zinc-600">Attract users looking for free solutions to specific problems</p>
            <div className="flex items-center mt-3">
              <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full mr-2 font-medium">Traffic Generation</div>
              <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">Trust Building</div>
            </div>
          </div>
          
          {/* Arrow Section */}
          <div className="flex flex-col items-center relative z-10">
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-indigo-400 to-green-500"></div>
            <div className="md:hidden h-16 w-0.5 bg-gradient-to-b from-indigo-400 to-green-500"></div>
            <div className="bg-gradient-to-r from-indigo-400 to-green-500 text-white text-xs rounded-full px-3 py-1 my-2 font-medium">
              Monetization Bridge
            </div>
            <div className="hidden md:block w-24 h-0.5 bg-gradient-to-r from-indigo-400 to-green-500"></div>
            <div className="md:hidden h-16 w-0.5 bg-gradient-to-b from-indigo-400 to-green-500"></div>
          </div>
          
          {/* Step 3: High-Value Monetization */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 w-full md:w-64 relative z-10">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
              <h4 className="font-medium">High-Value Offers</h4>
            </div>
            <p className="text-sm text-zinc-600">Connect users to high-value services with significant monetization potential</p>
            <div className="flex items-center mt-3">
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mr-2 font-medium">High Commission</div>
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Repeat Revenue</div>
            </div>
          </div>
        </div>
        
        {/* ROI Arrow */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="flex items-center bg-zinc-50 rounded-full px-4 py-1 border">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-zinc-700">Increasing Profit Potential</span>
          </div>
        </div>
      </div>
      
      {/* Key Points */}
      <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-1">The Door Concept</h5>
          <p className="text-sm text-blue-700">Create free/low-cost content that opens the door to high-value monetization opportunities.</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg">
          <h5 className="font-medium text-indigo-800 mb-1">The Value Gap</h5>
          <p className="text-sm text-indigo-700">Exploit the disconnect between content creation cost and monetization potential.</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h5 className="font-medium text-green-800 mb-1">The Scaling Strategy</h5>
          <p className="text-sm text-green-700">Create multiple money doors to build a portfolio of passive income streams.</p>
        </div>
      </div>
    </div>
  );
}
