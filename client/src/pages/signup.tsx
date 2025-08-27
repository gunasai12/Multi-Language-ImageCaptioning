import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Languages, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

export default function Signup() {
  const handleSignup = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-green-600/30 rounded-full blur-2xl float-animation"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-2xl mb-6 pulse-glow float-animation cursor-pointer hover:scale-105 transition-transform">
              <Languages className="text-3xl text-primary" size={36} />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-muted-foreground text-lg">Join MultiLang Caption today</p>
        </div>

        {/* Signup Card */}
        <Card className="glass border-2 border-white/20 shadow-2xl card-hover">
          <CardContent className="p-8">
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm font-medium text-muted-foreground">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="firstname"
                      type="text"
                      placeholder="John"
                      className="pl-10 h-12 glass border-white/20 focus:border-green-500"
                      data-testid="input-firstname"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Doe"
                    className="h-12 glass border-white/20 focus:border-green-500"
                    data-testid="input-lastname"
                  />
                </div>
              </div>

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
                    placeholder="john@example.com"
                    className="pl-10 h-12 glass border-white/20 focus:border-green-500"
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
                    placeholder="Create a strong password"
                    className="pl-10 h-12 glass border-white/20 focus:border-green-500"
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10 h-12 glass border-white/20 focus:border-green-500"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" data-testid="checkbox-terms" />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <span className="text-green-600 hover:text-green-700 cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-green-600 hover:text-green-700 cursor-pointer">Privacy Policy</span>
                </Label>
              </div>

              {/* Sign Up Button */}
              <Button 
                type="button"
                onClick={handleSignup}
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                data-testid="button-signup"
              >
                <span>Sign Up with Replit</span>
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

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login">
                    <span className="text-green-600 hover:text-green-700 font-medium cursor-pointer transition-colors">
                      Sign in here
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          <h3 className="text-center text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Why choose MultiLang Caption?
          </h3>
          <div className="grid gap-3">
            {[
              { icon: "🚀", text: "Fast AI-powered image captioning" },
              { icon: "🌍", text: "Support for English, Telugu, and Hindi" },
              { icon: "📱", text: "Easy drag-and-drop interface" },
              { icon: "💾", text: "Save and download your captions" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 glass rounded-lg p-3 card-hover">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{benefit.icon}</span>
                </div>
                <span className="text-sm text-muted-foreground">{benefit.text}</span>
                <CheckCircle className="ml-auto text-green-500" size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}