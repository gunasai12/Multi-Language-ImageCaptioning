import { Link, useLocation } from "wouter";
import { Languages, Home, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function NavigationHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="glass border-b border-white/20 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg pulse-glow">
              <Languages className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                MultiLang Caption
              </span>
              {user && (
                <span className="text-sm text-muted-foreground">
                  Welcome to MultiLang Caption{' '}
                  <span className="font-medium text-blue-600">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.email?.split('@')[0] || 'User'}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
        <nav className="flex items-center space-x-2">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "ghost"} 
              size="sm"
              className={`nav-item transition-all duration-300 ${
                location === "/" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-white/10"
              }`}
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
              className={`nav-item transition-all duration-300 ${
                location === "/history" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-white/10"
              }`}
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
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
