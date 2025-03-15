import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Layers, DollarSign, User, Settings, BarChart, Search } from "lucide-react";

interface NavigationLink {
  title: string;
  path: string;
  icon: React.ReactNode;
}

// Navigation links for sidebar
const navigationLinks: NavigationLink[] = [
  { title: "Dashboard", path: "/dashboard", icon: <Home className="h-4 w-4" /> },
  { title: "Generate Tools", path: "/tool-generator", icon: <Layers className="h-4 w-4" /> },
  { title: "My Tools", path: "/generated-tools", icon: <FileText className="h-4 w-4" /> },
  { title: "Keyword Research", path: "/keyword-research", icon: <Search className="h-4 w-4" /> },
  { title: "Monetization", path: "/tool-monetization", icon: <DollarSign className="h-4 w-4" /> },
  { title: "Analytics", path: "/analytics", icon: <BarChart className="h-4 w-4" /> },
  { title: "Profile", path: "/profile", icon: <User className="h-4 w-4" /> },
];

interface Props {
  className?: string;
}

export function SideNavigation({ className = "" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {navigationLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-zinc-600 hover:bg-zinc-100'}`}
          >
            <div className={`mr-3 ${isActive ? 'text-blue-700' : 'text-zinc-500'}`}>
              {link.icon}
            </div>
            <span className="font-medium">{link.title}</span>
          </button>
        );
      })}
    </div>
  );
}
