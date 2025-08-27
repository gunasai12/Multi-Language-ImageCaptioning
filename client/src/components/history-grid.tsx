import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Image } from "@shared/schema";

export default function HistoryGrid() {
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

  const downloadCaptions = (image: Image) => {
    const content = `Image: ${image.originalName}
Uploaded: ${new Date(image.createdAt!).toLocaleString()}

English:
${image.captionEnglish}

Telugu:
${image.captionTelugu}

Hindi:
${image.captionHindi}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${image.originalName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-2">Upload your first image to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          data-testid={`card-history-${image.id}`}
        >
          <img 
            src={image.imageUrl} 
            alt={image.originalName} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="mb-3">
              <span className="text-xs text-muted-foreground">
                {new Date(image.createdAt!).toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              {/* English Caption */}
              <div className="caption-card english bg-muted/30 p-2 rounded text-xs">
                <span className="language-tag text-blue-600 block mb-1">EN</span>
                <p className="truncate">{image.captionEnglish}</p>
              </div>
              
              {/* Telugu Caption */}
              <div className="caption-card telugu bg-muted/30 p-2 rounded text-xs">
                <span className="language-tag text-green-600 block mb-1">TE</span>
                <p className="truncate">{image.captionTelugu}</p>
              </div>
              
              {/* Hindi Caption */}
              <div className="caption-card hindi bg-muted/30 p-2 rounded text-xs">
                <span className="language-tag text-orange-600 block mb-1">HI</span>
                <p className="truncate">{image.captionHindi}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                data-testid={`button-view-${image.id}`}
              >
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => downloadCaptions(image)}
                data-testid={`button-download-${image.id}`}
              >
                <Download size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
