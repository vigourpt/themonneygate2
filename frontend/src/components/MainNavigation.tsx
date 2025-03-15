import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Search,
  Settings,
  PlusSquare,
  Layers,
  DollarSign,
  ChevronRight,
  Home,
} from "lucide-react";

export function MainNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      label: "Home",
      icon: <Home size={18} />,
      path: "/",
    },
    {
      label: "Keyword Research",
      icon: <Search size={18} />,
      path: "/keyword-research",
    },
    {
      label: "AI Tool Generator",
      icon: <PlusSquare size={18} />,
      path: "/tool-generator",
    },
    {
      label: "Monetization Advisor",
      icon: <DollarSign size={18} />,
      path: "/monetization",
    },
    {
      label: "Analytics",
      icon: <BarChart size={18} />,
      path: "/analytics",
    },
    {
      label: "My Content",
      icon: <Layers size={18} />,
      path: "/content",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      path: "/settings",
    }
  ];

  return (
    <div className="bg-white border-b mb-6 sticky top-0 z-10 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight">MoneyGate</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6 overflow-x-auto pb-2 max-w-2xl hide-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center whitespace-nowrap px-3 py-2 text-sm rounded-md transition-colors ${isActive(item.path) 
                  ? "bg-blue-100 text-blue-800 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-100"}`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <button 
              className="flex items-center text-sm font-medium bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
              onClick={() => navigate("/subscription")}
            >
              <span>Pro Plan</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
