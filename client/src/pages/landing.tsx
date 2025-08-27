import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-400/30 to-pink-600/30 rounded-full blur-2xl float-animation"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 glass rounded-2xl mb-8 pulse-glow float-animation">
            <Languages className="text-4xl text-primary" size={44} />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MultiLang Caption
          </h1>
          <p className="text-muted-foreground text-xl mb-6">AI-powered multilingual image captioning</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">English</span>
            <span className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-full">Telugu</span>
            <span className="px-4 py-2 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">Hindi</span>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="glass border-2 border-white/20 shadow-2xl card-hover">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Get Started Today
            </h2>
            <p className="text-center text-muted-foreground mb-8 text-lg leading-relaxed">
              Upload images and get AI-generated captions in multiple languages. Join thousands of users already using our platform.
            </p>
            
            <div className="space-y-4">
              <Link href="/signup">
                <Button 
                  className="w-full h-14 text-xl font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  data-testid="button-signup"
                >
                  Create Account
                </Button>
              </Link>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-transparent px-3 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="w-full h-14 text-xl font-medium glass border-2 border-white/30 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-xl p-6 card-hover">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🔄</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Instant Upload</p>
          </div>
          <div className="glass rounded-xl p-6 card-hover">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🧠</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">AI Powered</p>
          </div>
          <div className="glass rounded-xl p-6 card-hover">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">📥</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Download Text</p>
          </div>
        </div>
      </div>
    </div>
  );
}
