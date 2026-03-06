import { Link, useLocation } from "wouter";
import { Camera, History, Menu } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Camera, label: "Scanner" },
    { href: "/history", icon: History, label: "History" },
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Top Header - Minimalist */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <span className="font-display font-bold text-black text-sm">GR</span>
          </div>
          <span className="font-display font-bold text-white tracking-wider text-sm">GreenReader<span className="text-primary">AR</span></span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="z-50 bg-card/90 backdrop-blur-lg border-t border-border pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={`
                flex flex-col items-center justify-center w-full h-full gap-1
                transition-colors duration-200
                ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}>
                <item.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
