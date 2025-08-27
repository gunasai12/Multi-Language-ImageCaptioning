import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { Image } from "@shared/schema";

export default function RecentActivitySidebar() {
  const { toast } = useToast();

  const { data: images, isLoading, error } = useQuery<Image[]>({
    queryKey: ['/api/images'],
    retry: false,
  });

  if (error && isUnauthorizedError(error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const recentImages = images?.slice(0, 3) || [];

  return (
    <aside className="w-80 glass border-l border-white/20 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Recent Activity</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-4 shimmer">
              <Skeleton className="w-full h-16 rounded mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recentImages.length === 0 ? (
            <div className="text-center py-8 glass rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">📷</span>
              </div>
              <p className="text-muted-foreground text-sm">No recent uploads</p>
            </div>
          ) : (
            recentImages.map((image, index) => (
              <div 
                key={image.id} 
                className="glass rounded-xl p-4 card-hover cursor-pointer group"
                data-testid={`card-recent-${image.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={image.imageUrl} 
                  alt="Recent upload thumbnail" 
                  className="w-full h-16 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
                />
                <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">
                  {image.captionEnglish?.slice(0, 35)}...
                </p>
                <p className="text-xs text-muted-foreground mt-1 opacity-60">
                  {new Date(image.createdAt!).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/history">
          <button 
            className="w-full glass rounded-xl p-4 text-sm font-medium bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 group" 
            data-testid="link-view-all"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                View All History
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </button>
        </Link>
      </div>
    </aside>
  );
}
