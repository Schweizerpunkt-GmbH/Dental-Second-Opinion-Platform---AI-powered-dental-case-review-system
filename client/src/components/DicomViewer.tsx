import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download } from 'lucide-react';

interface DicomViewerProps {
  fileUrl: string;
  fileName: string;
}

export function DicomViewer({ fileUrl, fileName }: DicomViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple image viewer fallback for non-DICOM files
    if (!fileName.toLowerCase().endsWith('.dcm')) {
      return;
    }

    // DICOM viewer initialization would go here
    // For now, we'll show a placeholder
    setError('DICOM viewer is being initialized...');
  }, [fileUrl, fileName]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  // For non-DICOM images, show simple viewer
  if (!fileName.toLowerCase().endsWith('.dcm')) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{fileName}</CardTitle>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleZoomIn}
                data-testid="button-zoom-in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleZoomOut}
                data-testid="button-zoom-out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleRotate}
                data-testid="button-rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleReset}
                data-testid="button-reset"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                asChild
                data-testid="button-download-image"
              >
                <a href={fileUrl} download={fileName}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex items-center justify-center bg-muted/50 rounded-lg min-h-[400px] overflow-hidden">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-[600px] object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // DICOM viewer
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{fileName}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleZoomIn}
              data-testid="button-dicom-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleZoomOut}
              data-testid="button-dicom-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleRotate}
              data-testid="button-dicom-rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={viewportRef}
          className="relative flex items-center justify-center bg-black rounded-lg min-h-[400px]"
          data-testid="dicom-viewport"
        >
          {error ? (
            <div className="text-center p-8">
              <p className="text-white">{error}</p>
              <p className="text-sm text-gray-400 mt-2">DICOM file: {fileName}</p>
            </div>
          ) : (
            <div className="text-white">Loading DICOM...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
