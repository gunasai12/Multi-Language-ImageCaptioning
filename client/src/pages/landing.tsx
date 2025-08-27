import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-400/30 to-pink-600/30 rounded-full blur-2xl float-animation"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-2xl mb-6 pulse-glow float-animation">
            <Languages className="text-3xl text-primary" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MultiLang Caption
          </h1>
          <p className="text-muted-foreground text-lg">AI-powered multilingual image captioning</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">English</span>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Telugu</span>
            <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Hindi</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass border-2 border-white/20 shadow-2xl card-hover">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-center text-muted-foreground mb-8 text-lg leading-relaxed">
              Sign in to start generating multilingual captions for your images with our advanced AI technology
            </p>
            <Button 
              onClick={handleLogin} 
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              data-testid="button-login"
            >
              Sign In with Replit
            </Button>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-lg p-4 card-hover">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔄</span>
            </div>
            <p className="text-xs text-muted-foreground">Instant Upload</p>
          </div>
          <div className="glass rounded-lg p-4 card-hover">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🧠</span>
            </div>
            <p className="text-xs text-muted-foreground">AI Powered</p>
          </div>
          <div className="glass rounded-lg p-4 card-hover">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📥</span>
            </div>
            <p className="text-xs text-muted-foreground">Download Text</p>
          </div>
        </div>
      </div>
    </div>
  );
}
