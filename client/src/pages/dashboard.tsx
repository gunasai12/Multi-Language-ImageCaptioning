import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/navigation-header";
import ImageUpload from "@/components/image-upload";
import CaptionResults from "@/components/caption-results";
import RecentActivitySidebar from "@/components/recent-activity-sidebar";

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
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationHeader />
      
      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Welcome to MultiLang Caption</h1>
              <p className="text-muted-foreground">Upload an image and get AI-generated captions in English, Telugu, and Hindi</p>
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
    </div>
  );
}
