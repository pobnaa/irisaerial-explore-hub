import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-dark)] p-4 relative overflow-hidden">
      <div className="absolute left-4 top-4 z-20">
        <BackButton />
      </div>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <div className="inline-block p-2 bg-primary/10 rounded-3xl mb-0 animate-bounce">
          {/* Replace this image file with the attached logo at public/ia-logo.png */}
          <img
            src="/Screenshot 2025-11-06 200932.png"
            alt="IA logo"
            className="w-20 h-20 object-cover rounded-2xl shadow-[var(--shadow-glow)]"
          />
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
              AI & Innovations
            </h2>
            <p className="text-muted-foreground mb-6">
              Empowering businesses with cutting-edge technologies
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={async () => {
                // if already authenticated, go directly to profile, otherwise to login
                const { data: { session } } = await supabase.auth.getSession();
                if (session) navigate("/profile");
                else navigate("/login");
              }}
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
