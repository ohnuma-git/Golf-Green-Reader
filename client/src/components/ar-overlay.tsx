import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Minus } from "lucide-react";

interface AROverlayProps {
  slopeDirection: string;
  slopeSeverity: string;
}

export function AROverlay({ slopeDirection, slopeSeverity }: AROverlayProps) {
  // Determine overlay visual based on direction
  const getVisual = () => {
    const severityScale = slopeSeverity === "steep" ? 1.5 : slopeSeverity === "moderate" ? 1 : 0.8;
    const color = slopeSeverity === "steep" ? "#ef4444" : "#84cc16"; // Red for steep, Green for gentle
    
    switch (slopeDirection.toLowerCase()) {
      case "left":
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-1"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ x: [-10, 0, -10], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  <ChevronLeft size={80 * severityScale} color={color} strokeWidth={3} className="drop-shadow-lg" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case "right":
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-1"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ x: [0, 10, 0], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  <ChevronRight size={80 * severityScale} color={color} strokeWidth={3} className="drop-shadow-lg" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case "up":
      case "uphill":
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
             {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [10, 0, 10], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  <ChevronUp size={80 * severityScale} color={color} strokeWidth={3} className="drop-shadow-lg" />
                </motion.div>
              ))}
          </div>
        );
      case "down":
      case "downhill":
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
             {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [-10, 0, -10], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  <ChevronDown size={80 * severityScale} color={color} strokeWidth={3} className="drop-shadow-lg" />
                </motion.div>
              ))}
          </div>
        );
      default: // Flat or unknown
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <motion.div 
               animate={{ scaleX: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
             >
                <Minus size={120} className="text-primary drop-shadow-lg" strokeWidth={4} />
             </motion.div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Augmented Reality Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(132,204,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:1000px] [transform:rotateX(60deg)_translateY(-100px)] origin-bottom" />
      
      {getVisual()}
    </>
  );
}
