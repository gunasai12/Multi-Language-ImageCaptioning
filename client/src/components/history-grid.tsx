import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Image } from "@shared/schema";

export default function HistoryGrid() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images, isLoading, error } = useQuery<Image[]>({
    queryKey: ['/api/images'],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      toast({
        title: "Success",
        description: "Image and captions deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    },
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
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => downloadCaptions(image)}
                  data-testid={`button-download-${image.id}`}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <Download size={16} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-delete-${image.id}`}
                      className="hover:bg-red-50 hover:text-red-600"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass border-2 border-white/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Delete Image
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-base">
                        Are you sure you want to delete this image and all its captions? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4 glass rounded-lg p-3 border border-white/20">
                      <img 
                        src={image.imageUrl} 
                        alt={image.originalName}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium text-foreground">{image.originalName}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(image.createdAt!).toLocaleString()}
                      </p>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="glass border border-white/20 hover:bg-white/10"
                        data-testid={`button-cancel-delete-${image.id}`}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                        onClick={() => deleteMutation.mutate(image.id)}
                        data-testid={`button-confirm-delete-${image.id}`}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
