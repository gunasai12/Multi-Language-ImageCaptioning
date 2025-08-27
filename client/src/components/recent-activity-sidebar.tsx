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
    <aside className="w-80 bg-muted/30 border-l border-border p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3">
              <Skeleton className="w-full h-16 rounded mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recentImages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent uploads</p>
          ) : (
            recentImages.map((image) => (
              <div 
                key={image.id} 
                className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                data-testid={`card-recent-${image.id}`}
              >
                <img 
                  src={image.imageUrl} 
                  alt="Recent upload thumbnail" 
                  className="w-full h-16 object-cover rounded mb-2"
                />
                <p className="text-xs text-muted-foreground truncate">
                  {image.captionEnglish?.slice(0, 30)}...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(image.createdAt!).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-6">
        <Link href="/history">
          <button className="w-full text-sm text-primary hover:underline" data-testid="link-view-all">
            View All History →
          </button>
        </Link>
      </div>
    </aside>
  );
}
