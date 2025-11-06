import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Play, Film, Lock } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Session } from "@supabase/supabase-js";

const categories = [
  {
    id: "innovation",
    name: "AI & Innovations",
    videos: [
      {
        id: 2,
        title: "Roadways Survey",
        url: "/Final 3.mp4",
      },
      {
        id: 1,
        title: "Railway Track Survey",
        url: "/rail1.mp4",
      },
    ],
  },
  // more categories later...
];

// per-video detection targets
const videoTargets: Record<string, string[]> = {
  "Roadways Survey": [
    "Default",
    "Road Surface",
    "Trees",
    "Potholes",
    "Vehicles",
  ],
  "Railway Track Survey": [
    "Default",
    "Track Integrity",
    "Signals",
    "Overhead Lines",
    "Stations",
  ],
};

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("innovation");
  const [currentVideo, setCurrentVideo] = useState(categories[0].videos[0]);
  const [viewMode, setViewMode] = useState("default"); // only this will be active
  const navigate = useNavigate();
  const location = useLocation();
  const [incomingSurvey, setIncomingSurvey] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // If navigated with a video in location.state (from Profile), open it
  useEffect(() => {
    const state = (location.state as any) || {};
    if (state.video) {
      setCurrentVideo(state.video);
      setSelectedCategory("innovation");
      setViewMode("default");
      if (state.surveyType) setIncomingSurvey(state.surveyType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
      setViewMode("default"); // reset when switching
    }
  };

  const currentCategoryVideos =
    categories.find((c) => c.id === selectedCategory)?.videos || [];

  // get options based on current video title
  const currentTargets = useMemo(() => {
    return (
      videoTargets[currentVideo.title] || [
        "Default",
        "Object A",
        "Object B",
        "Object C",
      ]
    );
  }, [currentVideo]);

  return (
    <div className="min-h-screen bg-[var(--gradient-dark)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/Screenshot 2025-11-06 200932.png"
                alt="IA logo"
                className="w-10 h-10 object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                akshaa
              </h1>
              <p className="text-xs text-muted-foreground">
                Iris Aerial Innovation Pvt. Ltd.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
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

              {/* Title + Category + Toggle (symmetric row) */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* left part */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      {currentVideo.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        {categories.find((c) => c.id === selectedCategory)?.name}
                      </p>
                      {incomingSurvey ? (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-foreground">
                          {incomingSurvey}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* right part - dynamic toggle + lock info */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Target:</span>
                    <Select
                      value={viewMode}
                      onValueChange={(val) => {
                        // only allow default
                        if (val === "default") {
                          setViewMode("default");
                        } else {
                          // optional: toast here if you want
                          setViewMode("default");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentTargets.map((target, idx) => {
                          const value = target.toLowerCase().replace(/\s+/g, "-");
                          const isDefault = idx === 0 || target === "Default";
                          return (
                            <SelectItem
                              key={target}
                              value={isDefault ? "default" : value}
                              disabled={!isDefault}
                            >
                              {target}
                              {!isDefault && " (Pro)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Advanced detections available for paid users
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Tabs - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card/70 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Categories
                </h3>
              </div>

              <Tabs
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
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
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="mt-4 space-y-2"
                  >
                    {category.videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setCurrentVideo(video);
                          setViewMode("default"); // reset to default when switching video
                        }}
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
