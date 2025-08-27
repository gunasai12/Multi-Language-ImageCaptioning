import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/navigation-header";
import ImageUpload from "@/components/image-upload";
import CaptionResults from "@/components/caption-results";
import RecentActivitySidebar from "@/components/recent-activity-sidebar";
import SupportChatbot from "@/components/support-chatbot";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-tr from-green-400/10 to-blue-600/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <NavigationHeader />
      
      <div className="flex-1 flex relative z-10">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MultiLang Caption
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Upload an image and get AI-generated captions in English, Telugu, and Hindi. 
                Our advanced AI technology provides accurate and descriptive captions in multiple languages.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-sm text-muted-foreground">Multi-language</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-sm text-muted-foreground">Instant Results</span>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <ImageUpload />

            {/* Results Section */}
            <CaptionResults />
          </div>
        </main>

        {/* Recent Activity Sidebar */}
        <RecentActivitySidebar />
      </div>

      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  );
}
