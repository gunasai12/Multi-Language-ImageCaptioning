import { Link, useLocation } from "wouter";
import { Languages, Home, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavigationHeader() {
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Languages className="text-sm text-primary-foreground" size={16} />
            </div>
            <span className="font-semibold text-lg">MultiLang Caption</span>
          </div>
        </div>
        <nav className="flex items-center space-x-2">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "ghost"} 
              size="sm"
              data-testid="link-dashboard"
            >
              <Home className="mr-2" size={16} />
              Dashboard
            </Button>
          </Link>
          <Link href="/history">
            <Button 
              variant={location === "/history" ? "default" : "ghost"} 
              size="sm"
              data-testid="link-history"
            >
              <History className="mr-2" size={16} />
              History
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-destructive hover:text-destructive"
            data-testid="button-logout"
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
