import { useAnalyses } from "@/hooks/use-analysis";
import { format } from "date-fns";
import { Activity, ArrowRight, MapPin } from "lucide-react";

export default function HistoryPage() {
  const { data: analyses, isLoading, isError } = useAnalyses();

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Recent Scans</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Activity className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-xl font-bold text-white">Failed to load history</h3>
        <p className="text-muted-foreground mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-6 border border-white/5">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-white font-display">No Reads Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Your scanned greens will appear here. Go to the scanner to read your first putt.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pt-20 pb-24 px-4 sm:px-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white">Green History</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {analyses.length} Reads
          </span>
        </div>

        <div className="space-y-4">
          {analyses.map((item) => (
            <div 
              key={item.id} 
              className="group bg-card border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-32">
                {/* Thumbnail Image */}
                <div className="w-1/3 relative overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-card/100 z-10" />
                  <img 
                    src={item.imageBase64} 
                    alt="Green Scan" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 z-20">
                     <span className="text-[10px] font-mono text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
                       {/* Assuming date exists but might be mocked if fresh */}
                       {/* In a real app, parse item.createdAt */}
                       SCAN #{item.id}
                     </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-primary font-display font-bold uppercase text-lg leading-none">
                        {item.slopeDirection}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                         item.slopeSeverity === 'steep' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-green-400 border-green-500/20 bg-green-500/10'
                      }`}>
                        {item.slopeSeverity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.advice}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
