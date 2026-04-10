import { useState } from "react";
import {
  Search, Plus, MoreHorizontal, Shield, Eye, Pencil, Trash2, RotateCcw, AlertTriangle,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable } from "@/components/DataTable";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const FEATURES = [
  { key: "project", label: "Projects", desc: "Project tracking & management" },
  { key: "tender", label: "Tenders", desc: "Tender / Lead management" },
  { key: "employee", label: "Employee Activity", desc: "Daily activity & overtime" },
  { key: "user", label: "User Master", desc: "User & role management" },
  { key: "finance", label: "Finance", desc: "Invoice & payment tracking" },
  { key: "settings", label: "Settings", desc: "System configuration" },
] as const;

type FeatureKey = typeof FEATURES[number]["key"];
type CrudFlags = { view: boolean; add: boolean; edit: boolean; delete: boolean };
type FeaturePermissions = Record<FeatureKey, CrudFlags>;

interface UserData {
  userId: string; employeeId: string; firstName: string; lastName: string;
  email: string; mobile: string; username: string; department: string; role: string;
  reportingManager: string; status: "active" | "inactive";
  lastLogin: string;
  featurePermissions: FeaturePermissions;
  assignedProjects: string[];
  clientCompanyName?: string; clientCompanyId?: string;
  linkedProjectIds?: string[]; accessExpiryDate?: string; viewOnlyFlag?: boolean;
}

const allCrud = (v: boolean, a: boolean, e: boolean, d: boolean): CrudFlags => ({ view: v, add: a, edit: e, delete: d });
const fullAccess: CrudFlags = allCrud(true, true, true, true);
const readOnly: CrudFlags = allCrud(true, false, false, false);
const noAccess: CrudFlags = allCrud(false, false, false, false);
const crudAccess: CrudFlags = allCrud(true, true, true, false);

const adminPerms = (): FeaturePermissions => ({ project: fullAccess, tender: fullAccess, employee: fullAccess, user: fullAccess, finance: fullAccess, settings: fullAccess });
const managerPerms = (): FeaturePermissions => ({ project: fullAccess, tender: crudAccess, employee: crudAccess, user: readOnly, finance: readOnly, settings: noAccess });
const employeePerms = (): FeaturePermissions => ({ project: readOnly, tender: noAccess, employee: readOnly, user: noAccess, finance: noAccess, settings: noAccess });
const clientPerms = (): FeaturePermissions => ({ project: readOnly, tender: noAccess, employee: noAccess, user: noAccess, finance: readOnly, settings: noAccess });

const defaultPermsForRole = (role: string): FeaturePermissions => {
  switch (role) {
    case "Admin": return adminPerms();
    case "Manager": return managerPerms();
    case "Employee": return employeePerms();
    case "Client": return clientPerms();
    default: return employeePerms();
  }
};

const allProjects = [
  { id: "PRJ-2024-001", tag: "HE-001", title: "Shell & Tube HE" },
  { id: "PRJ-2024-002", tag: "HE-002", title: "Plate HE" },
  { id: "PRJ-2024-003", tag: "ACC-001", title: "Air Cooled Condenser" },
  { id: "PRJ-2024-004", tag: "HE-004", title: "Double Pipe HE" },
  { id: "PRJ-2024-005", tag: "WHR-001", title: "Waste Heat Recovery" },
  { id: "PRJ-2024-006", tag: "SHE-001", title: "Spiral HE" },
  { id: "PRJ-2024-007", tag: "FH-001", title: "Fired Heater" },
];

const users: UserData[] = [
  { userId: "USR-001", employeeId: "EMP-101", firstName: "Rajesh", lastName: "Kumar", email: "rajesh@company.com", mobile: "+91 9876543210", username: "rajesh.kumar", department: "Management", role: "Admin", reportingManager: "—", status: "active", lastLogin: "2 hours ago", featurePermissions: adminPerms(), assignedProjects: [] },
  { userId: "USR-002", employeeId: "EMP-102", firstName: "Priya", lastName: "Sharma", email: "priya@company.com", mobile: "+91 9876543211", username: "priya.sharma", department: "Design", role: "Employee", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "5 hours ago", featurePermissions: { ...employeePerms(), tender: readOnly }, assignedProjects: [] },
  { userId: "USR-003", employeeId: "EMP-103", firstName: "Amit", lastName: "Patel", email: "amit@company.com", mobile: "+91 9876543212", username: "amit.patel", department: "Purchase", role: "Employee", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "1 day ago", featurePermissions: { ...employeePerms(), tender: readOnly }, assignedProjects: [] },
  { userId: "USR-004", employeeId: "EMP-104", firstName: "Deepak", lastName: "Singh", email: "deepak@company.com", mobile: "+91 9876543213", username: "deepak.singh", department: "Production", role: "Employee", reportingManager: "Vikram Rao", status: "active", lastLogin: "3 hours ago", featurePermissions: employeePerms(), assignedProjects: [] },
  { userId: "USR-005", employeeId: "EMP-105", firstName: "Sanjay", lastName: "Mehta", email: "sanjay@company.com", mobile: "+91 9876543214", username: "sanjay.mehta", department: "Finance", role: "Manager", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "1 day ago", featurePermissions: { ...managerPerms(), finance: fullAccess }, assignedProjects: [] },
  { userId: "USR-006", employeeId: "EMP-106", firstName: "Neha", lastName: "Gupta", email: "neha@company.com", mobile: "+91 9876543215", username: "neha.gupta", department: "Sales", role: "Employee", reportingManager: "Amit Patel", status: "inactive", lastLogin: "2 weeks ago", featurePermissions: { ...employeePerms(), tender: readOnly }, assignedProjects: [] },
  { userId: "USR-007", employeeId: "", firstName: "BPCL", lastName: "Admin", email: "admin@bpcl.com", mobile: "+91 9876543216", username: "bpcl.admin", department: "External", role: "Client", reportingManager: "—", status: "active", lastLogin: "4 hours ago", featurePermissions: clientPerms(), assignedProjects: ["PRJ-2024-003"], clientCompanyName: "BPCL", clientCompanyId: "CLT-001", linkedProjectIds: ["PRJ-2024-003"], accessExpiryDate: "2026-12-31", viewOnlyFlag: true },
  { userId: "USR-008", employeeId: "EMP-108", firstName: "Vikram", lastName: "Rao", email: "vikram@company.com", mobile: "+91 9876543217", username: "vikram.rao", department: "Operations", role: "Manager", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "30 min ago", featurePermissions: managerPerms(), assignedProjects: [] },
];

const departments = ["All", "Management", "Design", "Purchase", "Production", "Finance", "Sales", "Operations", "External"];

function getPermSummary(fp: FeaturePermissions): { features: number; crud: string[] } {
  let features = 0;
  const cruds = new Set<string>();
  for (const f of FEATURES) {
    const p = fp[f.key];
    if (p.view || p.add || p.edit || p.delete) features++;
    if (p.view) cruds.add("V");
    if (p.add) cruds.add("A");
    if (p.edit) cruds.add("E");
    if (p.delete) cruds.add("D");
  }
  return { features, crud: Array.from(cruds) };
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserData | null>(null);
  const [editUser, setEditUser] = useState<Partial<UserData> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || u.department === deptFilter;
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesDept && matchesRole;
  });

  const openAdd = () => {
    setEditUser({
      firstName: "", lastName: "", email: "", mobile: "", username: "", department: "", role: "Employee",
      reportingManager: "", status: "active", featurePermissions: employeePerms(), assignedProjects: [],
    });
    setDialogOpen(true);
  };

  const handleRoleChange = (role: string) => {
    setEditUser((prev) => prev ? { ...prev, role, featurePermissions: defaultPermsForRole(role), assignedProjects: role === "Client" ? prev.assignedProjects || [] : [] } : prev);
  };

  const toggleFeatureCrud = (featureKey: FeatureKey, crud: keyof CrudFlags) => {
    setEditUser((prev) => {
      if (!prev?.featurePermissions) return prev;
      const current = prev.featurePermissions[featureKey];
      // Client: only view allowed
      if (prev.role === "Client" && crud !== "view") return prev;
      const updated = { ...current, [crud]: !current[crud] };
      // If disabling view, disable all
      if (crud === "view" && !updated.view) {
        updated.add = false; updated.edit = false; updated.delete = false;
      }
      return { ...prev, featurePermissions: { ...prev.featurePermissions, [featureKey]: updated } };
    });
  };

  const toggleProjectAssign = (projId: string) => {
    setEditUser((prev) => {
      if (!prev) return prev;
      const current = prev.assignedProjects || [];
      const next = current.includes(projId) ? current.filter((p) => p !== projId) : [...current, projId];
      return { ...prev, assignedProjects: next };
    });
  };

  const isClient = editUser?.role === "Client";
  const showProjectAssign = editUser?.role === "Manager" || editUser?.role === "Employee" || editUser?.role === "Client";

  const columns = [
    { key: "name", header: "Name", render: (u: UserData) => <span className="font-medium text-sm">{u.firstName} {u.lastName}</span> },
    { key: "employeeId", header: "Emp. ID", render: (u: UserData) => <span className="text-xs text-muted-foreground">{u.employeeId || "—"}</span> },
    { key: "email", header: "Email", render: (u: UserData) => <span className="text-muted-foreground text-xs">{u.email}</span> },
    { key: "role", header: "Role", render: (u: UserData) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
        u.role === "Admin" ? "bg-primary/10 text-primary" :
        u.role === "Manager" ? "bg-blue-50 text-blue-700" :
        u.role === "Client" ? "bg-amber-50 text-amber-700" :
        "bg-accent text-accent-foreground"
      }`}><Shield className="w-3 h-3" />{u.role}</span>
    )},
    { key: "department", header: "Dept", render: (u: UserData) => <span className="text-muted-foreground text-xs">{u.department}</span> },
    { key: "features", header: "Features", render: (u: UserData) => {
      const s = getPermSummary(u.featurePermissions);
      return <span className="text-xs text-muted-foreground">{s.features}/{FEATURES.length} modules</span>;
    }},
    { key: "permissions", header: "Access", render: (u: UserData) => {
      const s = getPermSummary(u.featurePermissions);
      return (
        <div className="flex gap-1">
          {s.crud.includes("V") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">V</span>}
          {s.crud.includes("A") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">A</span>}
          {s.crud.includes("E") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">E</span>}
          {s.crud.includes("D") && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">D</span>}
        </div>
      );
    }},
    { key: "status", header: "Status", render: (u: UserData) => (
      <StatusBadge status={u.status === "active" ? "completed" : "not-started"}>{u.status === "active" ? "Active" : "Inactive"}</StatusBadge>
    )},
    {
      key: "actions", header: "", headerClassName: "w-10", className: "w-10",
      render: (u: UserData) => (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setActionMenu(actionMenu === u.userId ? null : u.userId)} className="p-1.5 rounded hover:bg-muted">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {actionMenu === u.userId && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                <button onClick={() => { setViewUser(u); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Eye className="w-3.5 h-3.5" /> View Details</button>
                <button onClick={() => { setEditUser({ ...u }); setDialogOpen(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="w-3.5 h-3.5" /> Edit User</button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><RotateCcw className="w-3.5 h-3.5" /> Reset Password</button>
                <div className="border-t my-1" />
                <button onClick={() => { setDeleteConfirm(u.userId); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">User Master</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered users</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            {["Admin", "Manager", "Employee", "Client"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(u) => u.userId} pageSize={10} showExport={false} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editUser?.userId ? "Edit User" : "Create New User"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="core" className="mt-4">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: isClient ? "1fr 1fr 1fr" : "1fr 1fr" }}>
              <TabsTrigger value="core">Core Info</TabsTrigger>
              <TabsTrigger value="access">Role & Permissions</TabsTrigger>
              {isClient && <TabsTrigger value="client">Client Details</TabsTrigger>}
            </TabsList>

            {/* CORE INFO TAB */}
            <TabsContent value="core" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>User ID</Label><Input value={editUser?.userId || "Auto generated"} disabled /></div>
                <div className="space-y-2"><Label>Employee ID (Optional)</Label><Input placeholder="EMP-XXX" /></div>
                <div className="space-y-2"><Label>First Name</Label><Input placeholder="First name" /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Last name" /></div>
                <div className="space-y-2"><Label>Email (Login ID)</Label><Input type="email" placeholder="email@company.com" /></div>
                <div className="space-y-2"><Label>Username</Label><Input placeholder="username" /></div>
                <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="space-y-2"><Label>Mobile Number</Label><Input placeholder="+91 98765 43210" /></div>
                <div className="space-y-2">
                  <Label>Department (Optional)</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{departments.filter(d => d !== "All").map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role <span className="text-destructive">*</span></Label>
                  <Select value={editUser?.role || ""} onValueChange={handleRoleChange}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>{["Admin", "Manager", "Employee", "Client"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    {editUser?.role === "Admin" && "Full access to all features and modules."}
                    {editUser?.role === "Manager" && "CRUD on projects, configurable access to other modules."}
                    {editUser?.role === "Employee" && "Read-only by default. Grant feature access as needed."}
                    {editUser?.role === "Client" && "Read-only access to assigned projects and finance only."}
                  </p>
                </div>
                <div className="space-y-2"><Label>Reporting Manager</Label><Input placeholder="Manager name" /></div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* ROLE & PERMISSIONS TAB */}
            <TabsContent value="access" className="space-y-5 mt-4">
              {/* Role summary */}
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Role: {editUser?.role || "—"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {editUser?.role === "Admin" && "Admins have full CRUD access to all features. Permissions are locked."}
                  {editUser?.role === "Manager" && "Managers get default CRUD on key modules. Customize per-feature below."}
                  {editUser?.role === "Employee" && "Employees get read-only project access by default. Enable additional features below."}
                  {editUser?.role === "Client" && "Clients can only view assigned projects and their finance. No other module access."}
                </p>
              </div>

              {/* Feature-based permissions table */}
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-[1fr_60px_60px_60px_60px] gap-0 bg-muted/50 px-4 py-2 border-b">
                  <span className="text-xs font-semibold text-muted-foreground">Feature Module</span>
                  <span className="text-xs font-semibold text-muted-foreground text-center">View</span>
                  <span className="text-xs font-semibold text-muted-foreground text-center">Add</span>
                  <span className="text-xs font-semibold text-muted-foreground text-center">Edit</span>
                  <span className="text-xs font-semibold text-muted-foreground text-center">Delete</span>
                </div>
                {FEATURES.map((feat) => {
                  const perms = editUser?.featurePermissions?.[feat.key] || noAccess;
                  const isAdmin = editUser?.role === "Admin";
                  const isClientRole = editUser?.role === "Client";
                  // Client: only project & finance with view-only
                  const clientDisabled = isClientRole && feat.key !== "project" && feat.key !== "finance";
                  const clientCrudDisabled = isClientRole; // no add/edit/delete for client
                  const rowDisabled = isAdmin || clientDisabled;

                  return (
                    <div key={feat.key} className={`grid grid-cols-[1fr_60px_60px_60px_60px] gap-0 px-4 py-3 border-b last:border-b-0 items-center ${rowDisabled ? "opacity-50" : "hover:bg-muted/20"}`}>
                      <div>
                        <p className="text-sm font-medium">{feat.label}</p>
                        <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isAdmin ? true : perms.view}
                          disabled={isAdmin || clientDisabled}
                          onCheckedChange={() => toggleFeatureCrud(feat.key, "view")}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isAdmin ? true : perms.add}
                          disabled={isAdmin || clientDisabled || clientCrudDisabled}
                          onCheckedChange={() => toggleFeatureCrud(feat.key, "add")}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isAdmin ? true : perms.edit}
                          disabled={isAdmin || clientDisabled || clientCrudDisabled}
                          onCheckedChange={() => toggleFeatureCrud(feat.key, "edit")}
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isAdmin ? true : perms.delete}
                          disabled={isAdmin || clientDisabled || clientCrudDisabled}
                          onCheckedChange={() => toggleFeatureCrud(feat.key, "delete")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Project-level access */}
              {showProjectAssign && (
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-semibold mb-1">Project-Level Access</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {isClient
                      ? "Select projects this client can view (by Tag ID / Job ID). Only these projects and their finance will be visible."
                      : "Assign specific projects this user can access. Leave empty for all projects."
                    }
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {allProjects.map((p) => (
                      <label key={p.id} className="flex items-center gap-3 text-sm hover:bg-muted/50 p-2 rounded cursor-pointer border">
                        <Checkbox
                          checked={editUser?.assignedProjects?.includes(p.id) || false}
                          onCheckedChange={() => toggleProjectAssign(p.id)}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{p.tag}</span>
                          <span className="text-muted-foreground mx-1.5">|</span>
                          <span className="text-muted-foreground">{p.id}</span>
                          <span className="text-muted-foreground mx-1.5">—</span>
                          <span>{p.title}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Example summary */}
              {editUser?.role && editUser.role !== "Admin" && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">Access Preview</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {FEATURES.map((feat) => {
                      const p = editUser.featurePermissions?.[feat.key];
                      if (!p || (!p.view && !p.add && !p.edit && !p.delete)) return (
                        <div key={feat.key} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive/60" />
                          <span>{feat.label}: <span className="font-medium text-destructive">No Access</span></span>
                        </div>
                      );
                      const flags = [p.view && "View", p.add && "Add", p.edit && "Edit", p.delete && "Delete"].filter(Boolean).join(", ");
                      return (
                        <div key={feat.key} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span>{feat.label}: <span className="font-medium">{flags}</span></span>
                        </div>
                      );
                    })}
                    {editUser.assignedProjects && editUser.assignedProjects.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="font-medium">Assigned Projects: </span>
                        {editUser.assignedProjects.map((id) => {
                          const proj = allProjects.find((p) => p.id === id);
                          return proj ? `${proj.tag} (${proj.id})` : id;
                        }).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* CLIENT DETAILS TAB */}
            {isClient && (
              <TabsContent value="client" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Client Company Name</Label><Input placeholder="Company" /></div>
                  <div className="space-y-2"><Label>Client Company ID</Label><Input placeholder="CLT-XXX" /></div>
                  <div className="space-y-2"><Label>Access Expiry Date</Label><Input type="date" /></div>
                  <div className="flex items-center gap-2 col-span-2 p-3 rounded-md border">
                    <span className="text-sm font-medium">View Only Flag</span>
                    <Switch checked disabled />
                    <span className="text-xs text-muted-foreground">(Always true for Client)</span>
                  </div>
                </div>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs text-amber-800">
                    <strong>Client Access:</strong> This user will only see the Projects and Finance modules for their assigned projects. All other features are hidden from their panel.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">
              {editUser?.userId ? "Update User" : "Create User"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { l: "User ID", v: viewUser.userId }, { l: "Employee ID", v: viewUser.employeeId || "—" },
                  { l: "Name", v: `${viewUser.firstName} ${viewUser.lastName}` }, { l: "Email", v: viewUser.email },
                  { l: "Username", v: viewUser.username }, { l: "Mobile", v: viewUser.mobile },
                  { l: "Department", v: viewUser.department }, { l: "Role", v: viewUser.role },
                  { l: "Manager", v: viewUser.reportingManager }, { l: "Status", v: viewUser.status },
                ].map((item) => (
                  <div key={item.l}><p className="text-muted-foreground text-xs mb-0.5">{item.l}</p><p className="font-medium">{item.v}</p></div>
                ))}
              </div>
              <div className="rounded-md border p-3">
                <h4 className="text-xs font-semibold mb-2">Feature Permissions</h4>
                <div className="space-y-1.5">
                  {FEATURES.map((feat) => {
                    const p = viewUser.featurePermissions[feat.key];
                    if (!p.view && !p.add && !p.edit && !p.delete) return (
                      <div key={feat.key} className="flex items-center justify-between text-xs py-1">
                        <span className="text-muted-foreground">{feat.label}</span>
                        <span className="text-destructive font-medium">No Access</span>
                      </div>
                    );
                    return (
                      <div key={feat.key} className="flex items-center justify-between text-xs py-1">
                        <span className="font-medium">{feat.label}</span>
                        <div className="flex gap-1">
                          {p.view && <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">V</span>}
                          {p.add && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">A</span>}
                          {p.edit && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">E</span>}
                          {p.delete && <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">D</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {viewUser.assignedProjects.length > 0 && (
                <div className="rounded-md border p-3">
                  <h4 className="text-xs font-semibold mb-2">Assigned Projects</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewUser.assignedProjects.map((id) => {
                      const proj = allProjects.find((p) => p.id === id);
                      return <span key={id} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">{proj ? `${proj.tag} — ${proj.title}` : id}</span>;
                    })}
                  </div>
                </div>
              )}
              {viewUser.role === "Client" && (
                <div className="rounded-md border p-3 space-y-2">
                  <h4 className="text-sm font-semibold">Client Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Company</p><p className="font-medium">{viewUser.clientCompanyName}</p></div>
                    <div><p className="text-muted-foreground text-xs">Company ID</p><p className="font-medium">{viewUser.clientCompanyId}</p></div>
                    <div><p className="text-muted-foreground text-xs">Projects</p><p className="font-medium">{viewUser.linkedProjectIds?.join(", ")}</p></div>
                    <div><p className="text-muted-foreground text-xs">Expiry</p><p className="font-medium">{viewUser.accessExpiryDate}</p></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:opacity-90">Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
