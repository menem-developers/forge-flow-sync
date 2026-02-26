import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  RotateCcw,
  Shield,
  Eye,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const users = [
  { name: "Rajesh Kumar", email: "rajesh@company.com", role: "Admin", department: "Management", status: "active" as const, lastLogin: "2 hours ago" },
  { name: "Priya Sharma", email: "priya@company.com", role: "Design", department: "Design", status: "active" as const, lastLogin: "5 hours ago" },
  { name: "Amit Patel", email: "amit@company.com", role: "Purchase", department: "Purchase", status: "active" as const, lastLogin: "1 day ago" },
  { name: "Deepak Singh", email: "deepak@company.com", role: "Production", department: "Production", status: "active" as const, lastLogin: "3 hours ago" },
  { name: "Sanjay Mehta", email: "sanjay@company.com", role: "Finance", department: "Finance", status: "active" as const, lastLogin: "1 day ago" },
  { name: "Neha Gupta", email: "neha@company.com", role: "Tender", department: "Sales", status: "inactive" as const, lastLogin: "2 weeks ago" },
  { name: "BPCL Admin", email: "admin@bpcl.com", role: "Client", department: "External", status: "active" as const, lastLogin: "4 hours ago" },
  { name: "Vikram Rao", email: "vikram@company.com", role: "Manager", department: "Operations", status: "active" as const, lastLogin: "30 min ago" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.email}>
                <td className="font-medium">{u.name}</td>
                <td className="text-muted-foreground">{u.email}</td>
                <td>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-accent text-accent-foreground">
                    <Shield className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="text-muted-foreground">{u.department}</td>
                <td>
                  <StatusBadge status={u.status === "active" ? "completed" : "not-started"}>
                    {u.status === "active" ? "Active" : "Inactive"}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground text-xs">{u.lastLogin}</td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setActionMenu(actionMenu === u.email ? null : u.email)}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {actionMenu === u.email && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                            <Eye className="w-3.5 h-3.5" /> Edit User
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                            <RotateCcw className="w-3.5 h-3.5" /> Reset Password
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                            <Eye className="w-3.5 h-3.5" /> View Activity
                          </button>
                          <div className="border-t my-1" />
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted">
                            Deactivate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
