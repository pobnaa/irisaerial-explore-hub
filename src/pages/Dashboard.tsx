import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Play, Film } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const categories = [
  {
    id: "innovation",
    name: "AI & Innovation",
    videos: [
      { id: 1, title: "Geospatial AI Solutions", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 2, title: "Drone Technology Overview", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
  {
    id: "railway",
    name: "Railway Projects",
    videos: [
      { id: 3, title: "Railway Track Survey", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 4, title: "Infrastructure Mapping", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
  {
    id: "roads",
    name: "Road Engineering",
    videos: [
      { id: 5, title: "Highway Design", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 6, title: "Road Safety Analysis", url: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
];

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("innovation");
  const [currentVideo, setCurrentVideo] = useState(categories[0].videos[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category && category.videos.length > 0) {
      setCurrentVideo(category.videos[0]);
    }
  };

  const currentCategoryVideos = categories.find(
    (c) => c.id === selectedCategory
  )?.videos || [];

  return (
    <div className="min-h-screen bg-[var(--gradient-dark)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--gradient-primary)] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">IA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Iris Aerial
              </h1>
              <p className="text-xs text-muted-foreground">Video Library</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player - Large Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative group">
                <video
                  key={currentVideo.url}
                  controls
                  className="w-full h-full"
                  autoPlay
                >
                  <source src={currentVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Play className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {currentVideo.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Tabs - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Categories</h3>
              </div>
              
              <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
                <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start px-4 py-3"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-4 space-y-2">
                    {category.videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setCurrentVideo(video)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          currentVideo.id === video.id
                            ? "bg-primary/20 border border-primary"
                            : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {video.title}
                        </p>
                      </button>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
