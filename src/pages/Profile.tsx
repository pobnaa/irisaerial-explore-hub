import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

const sampleVideos = [
  { id: 1, title: "Railway Track Survey", url: "/rail1.mp4", survey: "Road Survey" },
  { id: 2, title: "Roadways Survey", url: "/Final 3.mp4", survey: "Road Survey" },
];

const Profile = () => {
  const [tab, setTab] = useState<"profile" | "about">("profile");
  const [recent, setRecent] = useState(sampleVideos);
  // pending upload and chosen survey for upload
  const [pendingVideo, setPendingVideo] = useState<{ title: string; url: string } | null>(null);
  const [uploadSurvey, setUploadSurvey] = useState<string>("Road Survey");
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to login if not authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
    });
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
    } else {
      toast.success("Logged out");
      navigate("/login");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingVideo({ title: file.name, url });
  };

  const openInDashboard = (
    video: { id: number; title: string; url: string; survey?: string }
  ) => {
    // navigate to dashboard and pass video + survey via location state
    navigate("/dashboard", { state: { video, surveyType: video.survey || "Road Survey" } });
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-dark)] p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="flex items-center">
            <BackButton className="mr-3" />
            <div className="flex items-center gap-3">
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
              <p className="text-xs text-muted-foreground">Iris Aerial Innovation Pvt. Ltd.</p>
            </div>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
        <aside className="col-span-1">
          <Card className="p-4">
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded ${tab === "profile" ? "bg-primary/10" : "hover:bg-secondary/20"}`}
                onClick={() => setTab("profile")}
              >
                Profile Settings
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded ${tab === "about" ? "bg-primary/10" : "hover:bg-secondary/20"}`}
                onClick={() => setTab("about")}
              >
                About Us
              </button>
            </div>
          </Card>
        </aside>

        <main className="col-span-3 space-y-6">
          <Card className="p-6">
            {tab === "profile" ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
                <input type="file" accept="video/*" onChange={handleUpload} />
                <p className="text-sm text-muted-foreground mt-2">Choose a video file, pick the survey type and press Submit to add it to Recently Played.</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    {pendingVideo ? (
                      <>
                        <div className="text-sm font-medium">{pendingVideo.title}</div>
                        <div className="text-xs text-muted-foreground">{pendingVideo.url}</div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">No file selected</div>
                    )}
                  </div>

                    <select
                      className="text-sm border rounded px-2 py-1 bg-card text-white appearance-none focus:outline-none"
                      value={uploadSurvey}
                      onChange={(e) => setUploadSurvey(e.target.value)}
                    >
                    <option>Road Survey</option>
                    <option>Train Survey</option>
                  </select>

                  <Button
                    disabled={!pendingVideo}
                    onClick={() => {
                      if (!pendingVideo) {
                        toast.error("Please choose a file before submitting.");
                        return;
                      }
                      const newVideo = { id: Date.now(), title: pendingVideo.title, url: pendingVideo.url, survey: uploadSurvey } as any;
                      setRecent((r) => [newVideo, ...r].slice(0, 8));
                      toast.success(`Uploaded ${newVideo.title} (${uploadSurvey})`);
                      setPendingVideo(null);
                      setUploadSurvey("Road Survey");
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">About Us</h2>
                <p className="text-sm text-muted-foreground">Iris Aerial Innovation Pvt. Ltd. — mapping the future with precision.</p>
              </div>
            )}
          </Card>

          {tab === "profile" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Recently Played / Sample Videos</h3>
              <div className="space-y-2">
                {recent.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/20">
                    <div>
                      <div className="text-sm font-medium">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{v.url}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => openInDashboard(v)}>
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
