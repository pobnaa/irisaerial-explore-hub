import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-dark)] p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <div className="inline-block p-4 bg-primary/10 rounded-3xl mb-8 animate-bounce">
          <div className="w-20 h-20 bg-[var(--gradient-primary)] rounded-2xl flex items-center justify-center shadow-[var(--shadow-glow)]">
            <span className="text-4xl font-bold text-primary-foreground">IA</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
          Mapping the Future with Precision
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 mb-4">
          Geospatial Solutions & Modern Surveying Services
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          State-of-the-art technologies for infrastructure, railways, roads, mining, agriculture, telecom, and energy sectors.
        </p>

        <div className="space-y-6">
          <div className="inline-block p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              AI & Innovation
            </h2>
            <p className="text-muted-foreground mb-6">
              Empowering businesses with cutting-edge technologies
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate("/login")}
              className="gap-2 text-lg px-8 py-6"
            >
              <Rocket className="w-5 h-5" />
              Explore
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
