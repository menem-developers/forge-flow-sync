import { useState } from "react";
import { Factory, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Factory className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">FabriTrack</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fabrication Manufacturing Productivity Management
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-xl border shadow-sm p-8">
          <h2 className="text-lg font-semibold text-foreground mb-1">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your credentials to access the system
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full h-10 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 FabriTrack Manufacturing Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
}
