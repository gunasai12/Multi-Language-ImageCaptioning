import { Link, useLocation } from "wouter";
import { Languages, Home, History, LogOut, Menu, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function NavigationHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleCall = () => {
    window.open("tel:8688195228", "_self");
  };

  const handleEmail = () => {
    window.open("mailto:ganumulapally@gmail.com?subject=MultiLang Caption Support", "_blank");
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
          
          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="nav-item hover:bg-white/10 transition-all duration-300"
                data-testid="button-menu"
              >
                <Menu className="mr-2" size={16} />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-2 border-white/20 backdrop-blur-xl" align="end">
              <div className="px-4 py-3 border-b border-white/20">
                <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Customer Support
                </p>
                <p className="text-xs text-muted-foreground">Get help when you need it</p>
              </div>
              
              <DropdownMenuItem 
                onClick={handleCall}
                className="cursor-pointer hover:bg-white/10 transition-colors"
                data-testid="menu-call-support"
              >
                <Phone className="mr-3 text-green-600" size={16} />
                <div>
                  <p className="font-medium">Call Support</p>
                  <p className="text-xs text-muted-foreground">8688195228</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={handleEmail}
                className="cursor-pointer hover:bg-white/10 transition-colors"
                data-testid="menu-email-support"
              >
                <Mail className="mr-3 text-blue-600" size={16} />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">ganumulapally@gmail.com</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => {
                  const event = new CustomEvent('openChatbot');
                  window.dispatchEvent(event);
                }}
                className="cursor-pointer hover:bg-white/10 transition-colors"
                data-testid="menu-chat-support"
              >
                <MessageCircle className="mr-3 text-purple-600" size={16} />
                <div>
                  <p className="font-medium">Chat Support</p>
                  <p className="text-xs text-muted-foreground">Get instant help</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-white/20" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors"
                data-testid="menu-logout"
              >
                <LogOut className="mr-3" size={16} />
                <p className="font-medium">Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
