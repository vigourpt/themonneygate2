import React, { useState } from "react";
import { Button } from "components/Button";
import { Card, CardContent } from "components/Card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, Users, TrendingUp, DollarSign, MousePointer, BarChart2, PieChart as PieChartIcon, Activity, Filter } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d" | "all";
type ChartType = "traffic" | "conversions" | "revenue";
type PlatformFilter = "all" | "website" | "social" | "community" | "email";

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [chartType, setChartType] = useState<ChartType>("traffic");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  
  // Sample data - in a real app this would come from analytics APIs
  const trafficData = [
    { date: "Day 1", website: 120, social: 80, community: 45, email: 20 },
    { date: "Day 5", website: 160, social: 100, community: 60, email: 25 },
    { date: "Day 10", website: 180, social: 140, community: 85, email: 40 },
    { date: "Day 15", website: 220, social: 160, community: 95, email: 45 },
    { date: "Day 20", website: 250, social: 190, community: 110, email: 55 },
    { date: "Day 25", website: 280, social: 220, community: 130, email: 65 },
    { date: "Day 30", website: 310, social: 260, community: 150, email: 80 },
  ];
  
  const conversionData = [
    { name: "Savings Tracker", conversions: 45 },
    { name: "Debt Payoff", conversions: 32 },
    { name: "Budget Template", conversions: 38 },
    { name: "Mortgage Letter", conversions: 25 },
  ];
  
  const revenueData = [
    { source: "Affiliate", value: 1250 },
    { source: "Ads", value: 520 },
    { source: "Premium", value: 750 },
    { source: "Other", value: 185 },
  ];
  
  const platformSources = [
    { name: "Website", value: 45 },
    { name: "Social Media", value: 30 },
    { name: "Communities", value: 15 },
    { name: "Email", value: 10 },
  ];
  
  const trafficMetrics = [
    { 
      title: "Total Visitors", 
      value: "1,875",
      change: +12.5,
      icon: <Users className="h-4 w-4" />
    },
    { 
      title: "Conversion Rate", 
      value: "7.4%",
      change: +1.2,
      icon: <TrendingUp className="h-4 w-4" />
    },
    { 
      title: "Total Revenue", 
      value: "$2,705",
      change: +18.3,
      icon: <DollarSign className="h-4 w-4" />
    },
    { 
      title: "Click-Through Rate", 
      value: "5.2%",
      change: -0.8,
      icon: <MousePointer className="h-4 w-4" />
    }
  ];
  
  const optimizationTips = [
    { 
      tip: "Your Debt Payoff tool has the highest conversion from the personal finance subreddit.", 
      action: "Consider sharing more debt-related content in this community."
    },
    { 
      tip: "LinkedIn traffic has a 2x higher conversion rate than Twitter.", 
      action: "Increase LinkedIn posting frequency and reduce Twitter effort."
    },
    { 
      tip: "The affiliate link for Betterment has the highest conversion rate.", 
      action: "Make this link more prominent in your Savings Tracker tool."
    },
    { 
      tip: "Weekend traffic converts 15% better than weekday traffic.", 
      action: "Schedule more post and email sends for Friday and Saturday."
    },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const renderTrafficChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="website" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="social" stroke="#82ca9d" />
        <Line type="monotone" dataKey="community" stroke="#ffc658" />
        <Line type="monotone" dataKey="email" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
  
  const renderConversionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="conversions" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
  
  const renderRevenueChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={revenueData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {revenueData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
  
  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold mb-2 md:mb-0">Analytics Dashboard</h3>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center bg-zinc-100 rounded-md p-1">
                <Button
                  variant={timeRange === "7d" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("7d")}
                >
                  7 Days
                </Button>
                <Button
                  variant={timeRange === "30d" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("30d")}
                >
                  30 Days
                </Button>
                <Button
                  variant={timeRange === "90d" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("90d")}
                >
                  90 Days
                </Button>
                <Button
                  variant={timeRange === "all" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("all")}
                >
                  All Time
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setPlatformFilter(platformFilter === "all" ? "website" : "all")}
                >
                  <Filter size={14} className="mr-1" />
                  {platformFilter === "all" ? "All Sources" : platformFilter}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {trafficMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-500 text-sm">{metric.title}</div>
                  <div className="p-1.5 bg-blue-100 rounded-md text-blue-700">
                    {metric.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className={`flex items-center text-xs mt-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {metric.change >= 0 ? (
                      <ArrowUp size={12} className="mr-1" />
                    ) : (
                      <ArrowDown size={12} className="mr-1" />
                    )}
                    {Math.abs(metric.change)}% vs previous period
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chart Tabs */}
          <div className="mb-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${chartType === 'traffic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-zinc-500'}`}
                onClick={() => setChartType("traffic")}
              >
                <BarChart2 size={16} className="mr-1.5" /> Traffic Sources
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${chartType === 'conversions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-zinc-500'}`}
                onClick={() => setChartType("conversions")}
              >
                <Activity size={16} className="mr-1.5" /> Tool Conversions
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${chartType === 'revenue' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-zinc-500'}`}
                onClick={() => setChartType("revenue")}
              >
                <PieChartIcon size={16} className="mr-1.5" /> Revenue Breakdown
              </button>
            </div>
            
            {chartType === "traffic" && renderTrafficChart()}
            {chartType === "conversions" && renderConversionChart()}
            {chartType === "revenue" && renderRevenueChart()}
          </div>
          
          {/* Data Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <h4 className="font-medium mb-3">Optimization Insights</h4>
              <div className="space-y-3">
                {optimizationTips.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium text-sm mb-1">{item.tip}</div>
                    <div className="text-xs text-blue-600">Recommended Action: {item.action}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Traffic by Platform</h4>
              <div className="border rounded-lg p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={platformSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {platformSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {platformSources.map((platform, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="text-xs">{platform.name}: {platform.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 border rounded-lg p-4 bg-zinc-50">
                <h4 className="font-medium text-sm mb-2">Export Options</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    Generate PDF Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    Schedule Weekly Reports
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
