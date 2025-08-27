import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Languages, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
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
          <Link href="/">
            <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-2xl mb-6 pulse-glow float-animation cursor-pointer hover:scale-105 transition-transform">
              <Languages className="text-3xl text-primary" size={36} />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg">Sign in to your MultiLang Caption account</p>
        </div>

        {/* Login Card */}
        <Card className="glass border-2 border-white/20 shadow-2xl card-hover">
          <CardContent className="p-8">
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 glass border-white/20 focus:border-blue-500"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-12 glass border-white/20 focus:border-blue-500"
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot your password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button 
                type="button"
                onClick={handleLogin}
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-login"
              >
                <span>Sign In with Replit</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/signup">
                    <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors">
                      Sign up here
                    </span>
                  </Link>
                </p>
              </div>
            </form>
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