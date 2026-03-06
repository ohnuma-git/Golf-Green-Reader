import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, AlertCircle, ScanLine } from "lucide-react";
import { useAnalyzeGreen } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AROverlay } from "./ar-overlay";
import { motion, AnimatePresence } from "framer-motion";

const videoConstraints = {
  facingMode: { exact: "environment" }, // Prefer back camera
  aspectRatio: 16/9,
};

// Fallback if environment camera not found (e.g. laptop)
const fallbackConstraints = {
  facingMode: "user",
};

export function CameraView() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ direction: string; severity: string; advice: string } | null>(null);
  const { toast } = useToast();
  
  const analyzeMutation = useAnalyzeGreen();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      handleAnalyze(imageSrc);
    } else {
      toast({
        title: "Camera Error",
        description: "Could not capture image. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    }
  }, [webcamRef]);

  const handleAnalyze = async (base64Image: string) => {
    try {
      const result = await analyzeMutation.mutateAsync({ image: base64Image });
      setAnalysis({
        direction: result.slopeDirection,
        severity: result.slopeSeverity,
        advice: result.advice,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      setImgSrc(null); // Reset on error
    }
  };

  const clear = () => {
    setImgSrc(null);
    setAnalysis(null);
  };

  const isScanning = analyzeMutation.isPending;

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Camera Viewfinder */}
      <div className="relative flex-1 overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt="captured" className="w-full h-full object-cover" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            forceScreenshotSourceSize={true}
            onUserMediaError={() => {
              toast({ title: "Camera Error", description: "Trying fallback camera...", variant: "destructive" });
            }}
          />
        )}

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-x-0 h-1 bg-primary/80 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-scan" />
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-primary/30 flex items-center gap-3">
                 <ScanLine className="w-5 h-5 text-primary animate-spin" />
                 <span className="text-primary font-display font-bold tracking-widest uppercase text-sm">Analyzing Terrain...</span>
               </div>
            </div>
          </div>
        )}

        {/* AR Overlay Result */}
        <AnimatePresence>
          {analysis && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <AROverlay slopeDirection={analysis.direction} slopeSeverity={analysis.severity} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls / Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 pb-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <AnimatePresence mode="wait">
          {analysis ? (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Analysis Result</h3>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-display font-bold text-white capitalize">{analysis.direction}</span>
                     <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                       analysis.severity === 'steep' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                     }`}>
                       {analysis.severity}
                     </span>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={clear} className="rounded-full h-10 w-10 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-3 mt-2">
                {analysis.advice}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {!isScanning && (
                <p className="text-white/70 text-sm font-medium text-shadow text-center max-w-[200px]">
                  Align hole and ball in view
                </p>
              )}
              <Button 
                size="lg" 
                disabled={isScanning}
                onClick={capture}
                className="
                  h-20 w-20 rounded-full border-4 border-white/20 
                  bg-gradient-to-tr from-primary to-primary/80 
                  shadow-[0_0_30px_rgba(34,197,94,0.4)]
                  hover:scale-105 active:scale-95 transition-all duration-300
                  flex items-center justify-center
                  group
                "
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors">
                  <Camera className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
