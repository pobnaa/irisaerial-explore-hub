import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import BackButton from "@/components/BackButton";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          navigate("/profile");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/profile");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login successful!");
        navigate("/profile");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // after email confirmation redirect to profile
            emailRedirectTo: `${window.location.origin}/profile`,
          },
        });
        if (error) throw error;
        toast.success("Sign up successful! You can now log in.");
        setIsLogin(true);
        // navigate directly to profile after successful sign up (session may be created)
        navigate("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-dark)] p-4 relative overflow-hidden">
      <div className="absolute left-4 top-4 z-20">
        <BackButton />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-card/70 border-border/50 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-primary/10 rounded-2xl mb-1">
            {/* Replace this image file with your screenshot placed in `public/` */}
            <img
              src="/Screenshot 2025-11-06 200932.png"
              alt="IA logo"
              className="w-12 h-12 object-cover rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-0">
            akshaa
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Iris Aerial Innovations Pvt. Ltd." : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50 border-border/50 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-secondary/50 border-border/50 focus:border-primary transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="mr-2" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="mr-2" />
                Sign Up
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
