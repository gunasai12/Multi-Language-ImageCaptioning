import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, Loader2 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ImageUpload() {
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Image uploaded and captions generated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
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
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  }, [uploadMutation, toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <div 
          className={`upload-zone rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            dragOver ? 'dragover' : ''
          } ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          data-testid="zone-upload"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              {uploadMutation.isPending ? (
                <Loader2 className="text-2xl text-muted-foreground animate-spin" size={32} />
              ) : (
                <CloudUpload className="text-2xl text-muted-foreground" size={32} />
              )}
            </div>
            <div>
              <p className="text-lg font-medium">
                {uploadMutation.isPending 
                  ? "Processing your image..." 
                  : "Drop your image here or click to browse"
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {uploadMutation.isPending 
                  ? "Generating captions in multiple languages..."
                  : "Supports JPG, PNG, GIF up to 10MB"
                }
              </p>
            </div>
            {!uploadMutation.isPending && (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Select Image
              </Button>
            )}
          </div>
          <input 
            type="file" 
            id="file-input" 
            accept="image/*" 
            className="hidden"
            onChange={handleFileInputChange}
            data-testid="input-file"
          />
        </div>
      </CardContent>
    </Card>
  );
}
