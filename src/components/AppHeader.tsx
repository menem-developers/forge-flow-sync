import { useState } from "react";
import { Search, Bell, ChevronDown, User, Lock, LogOut } from "lucide-react";

export function AppHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-card border-b">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects, jobs, customers..."
          className="w-full h-9 pl-9 pr-4 rounded-md border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground">AD</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-none">Admin User</p>
              <p className="text-[11px] text-muted-foreground">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <User className="w-4 h-4 text-muted-foreground" />
                  View Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Change Password
                </button>
                <div className="border-t my-1" />
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
