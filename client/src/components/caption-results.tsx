import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Image } from "@shared/schema";

export default function CaptionResults() {
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

  const latestImage = images?.[0];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Caption copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadCaptions = () => {
    if (!latestImage) return;
    
    const content = `Image: ${latestImage.originalName}
Uploaded: ${new Date(latestImage.createdAt!).toLocaleString()}

English:
${latestImage.captionEnglish}

Telugu:
${latestImage.captionTelugu}

Hindi:
${latestImage.captionHindi}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${latestImage.originalName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadAnother = () => {
    document.getElementById('file-input')?.click();
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Captions</h2>
          <div className="space-y-6">
            <Skeleton className="w-full h-48" />
            <div className="space-y-4">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestImage) {
    return (
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Captions</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Upload an image to see generated captions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Captions</h2>
        
        {/* Image Preview */}
        <div className="mb-6">
          <img 
            src={latestImage.imageUrl} 
            alt="Uploaded image preview" 
            className="w-full max-w-md mx-auto rounded-lg shadow-sm"
            data-testid="img-preview"
          />
          <p className="text-center text-sm text-muted-foreground mt-2" data-testid="text-upload-time">
            Uploaded: {new Date(latestImage.createdAt!).toLocaleString()}
          </p>
        </div>

        {/* Caption Results */}
        <div className="grid gap-4">
          {/* English Caption */}
          <div className="caption-card english bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="language-tag text-blue-600">English</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(latestImage.captionEnglish || '')}
                data-testid="button-copy-english"
              >
                <Copy className="text-muted-foreground hover:text-foreground" size={16} />
              </Button>
            </div>
            <p className="text-sm leading-relaxed" data-testid="text-caption-english">
              {latestImage.captionEnglish}
            </p>
          </div>

          {/* Telugu Caption */}
          <div className="caption-card telugu bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="language-tag text-green-600">Telugu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(latestImage.captionTelugu || '')}
                data-testid="button-copy-telugu"
              >
                <Copy className="text-muted-foreground hover:text-foreground" size={16} />
              </Button>
            </div>
            <p className="text-sm leading-relaxed" data-testid="text-caption-telugu">
              {latestImage.captionTelugu}
            </p>
          </div>

          {/* Hindi Caption */}
          <div className="caption-card hindi bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="language-tag text-orange-600">Hindi</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(latestImage.captionHindi || '')}
                data-testid="button-copy-hindi"
              >
                <Copy className="text-muted-foreground hover:text-foreground" size={16} />
              </Button>
            </div>
            <p className="text-sm leading-relaxed" data-testid="text-caption-hindi">
              {latestImage.captionHindi}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            variant="secondary" 
            onClick={downloadCaptions}
            data-testid="button-download"
          >
            <Download className="mr-2" size={16} />
            Download Captions
          </Button>
          <Button onClick={uploadAnother} data-testid="button-upload-another">
            <Upload className="mr-2" size={16} />
            Upload Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
