import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Languages className="text-2xl text-primary-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MultiLang Caption</h1>
          <p className="text-muted-foreground mt-2">AI-powered multilingual image captioning</p>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back</h2>
            <p className="text-center text-muted-foreground mb-6">
              Sign in to start generating multilingual captions for your images
            </p>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              data-testid="button-login"
            >
              Sign In with Replit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
