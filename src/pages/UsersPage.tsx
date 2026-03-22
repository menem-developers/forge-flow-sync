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

interface UserData {
  userId: string; employeeId: string; firstName: string; lastName: string;
  email: string; mobile: string; username: string; department: string; role: string;
  reportingManager: string; status: "active" | "inactive";
  lastLogin: string; financialAccess: boolean; tenderAccess: boolean;
  canView: boolean; canAdd: boolean; canEdit: boolean; canDelete: boolean;
  assignedProjects: string[];
  clientCompanyName?: string; clientCompanyId?: string;
  linkedProjectIds?: string[]; accessExpiryDate?: string; viewOnlyFlag?: boolean;
}

const allProjects = [
  "PRJ-2024-001 - Shell & Tube HE", "PRJ-2024-002 - Plate HE", "PRJ-2024-003 - Air Cooled Condenser",
  "PRJ-2024-004 - Double Pipe HE", "PRJ-2024-005 - Waste Heat Recovery", "PRJ-2024-006 - Spiral HE", "PRJ-2024-007 - Fired Heater",
];

const users: UserData[] = [
  { userId: "USR-001", employeeId: "EMP-101", firstName: "Rajesh", lastName: "Kumar", email: "rajesh@company.com", mobile: "+91 9876543210", username: "rajesh.kumar", department: "Management", role: "Admin", reportingManager: "—", status: "active", lastLogin: "2 hours ago", financialAccess: true, tenderAccess: true, canView: true, canAdd: true, canEdit: true, canDelete: true, assignedProjects: [] },
  { userId: "USR-002", employeeId: "EMP-102", firstName: "Priya", lastName: "Sharma", email: "priya@company.com", mobile: "+91 9876543211", username: "priya.sharma", department: "Design", role: "Employee", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "5 hours ago", financialAccess: false, tenderAccess: false, canView: true, canAdd: true, canEdit: true, canDelete: false, assignedProjects: [] },
  { userId: "USR-003", employeeId: "EMP-103", firstName: "Amit", lastName: "Patel", email: "amit@company.com", mobile: "+91 9876543212", username: "amit.patel", department: "Purchase", role: "Employee", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "1 day ago", financialAccess: false, tenderAccess: true, canView: true, canAdd: true, canEdit: true, canDelete: false, assignedProjects: [] },
  { userId: "USR-004", employeeId: "EMP-104", firstName: "Deepak", lastName: "Singh", email: "deepak@company.com", mobile: "+91 9876543213", username: "deepak.singh", department: "Production", role: "Employee", reportingManager: "Vikram Rao", status: "active", lastLogin: "3 hours ago", financialAccess: false, tenderAccess: false, canView: true, canAdd: false, canEdit: true, canDelete: false, assignedProjects: [] },
  { userId: "USR-005", employeeId: "EMP-105", firstName: "Sanjay", lastName: "Mehta", email: "sanjay@company.com", mobile: "+91 9876543214", username: "sanjay.mehta", department: "Finance", role: "Manager", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "1 day ago", financialAccess: true, tenderAccess: false, canView: true, canAdd: true, canEdit: true, canDelete: false, assignedProjects: [] },
  { userId: "USR-006", employeeId: "EMP-106", firstName: "Neha", lastName: "Gupta", email: "neha@company.com", mobile: "+91 9876543215", username: "neha.gupta", department: "Sales", role: "Employee", reportingManager: "Amit Patel", status: "inactive", lastLogin: "2 weeks ago", financialAccess: false, tenderAccess: true, canView: true, canAdd: true, canEdit: false, canDelete: false, assignedProjects: [] },
  { userId: "USR-007", employeeId: "", firstName: "BPCL", lastName: "Admin", email: "admin@bpcl.com", mobile: "+91 9876543216", username: "bpcl.admin", department: "External", role: "Client", reportingManager: "—", status: "active", lastLogin: "4 hours ago", financialAccess: false, tenderAccess: false, canView: true, canAdd: false, canEdit: false, canDelete: false, assignedProjects: ["PRJ-2024-003"], clientCompanyName: "BPCL", clientCompanyId: "CLT-001", linkedProjectIds: ["PRJ-2024-003"], accessExpiryDate: "2026-12-31", viewOnlyFlag: true },
  { userId: "USR-008", employeeId: "EMP-108", firstName: "Vikram", lastName: "Rao", email: "vikram@company.com", mobile: "+91 9876543217", username: "vikram.rao", department: "Operations", role: "Manager", reportingManager: "Rajesh Kumar", status: "active", lastLogin: "30 min ago", financialAccess: true, tenderAccess: true, canView: true, canAdd: true, canEdit: true, canDelete: true, assignedProjects: [] },
];

const departments = ["All", "Management", "Design", "Purchase", "Production", "Finance", "Sales", "Operations", "External"];

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
    setEditUser({ firstName: "", lastName: "", email: "", mobile: "", username: "", department: "", role: "Employee", reportingManager: "", status: "active", financialAccess: false, tenderAccess: false, canView: true, canAdd: false, canEdit: false, canDelete: false, assignedProjects: [] });
    setDialogOpen(true);
  };

  const isClient = editUser?.role === "Client";
  const isRestricted = editUser?.role === "Client" || editUser?.role === "Manager" || editUser?.role === "Employee";

  const columns = [
    { key: "name", header: "Name", render: (u: UserData) => <span className="font-medium text-sm">{u.firstName} {u.lastName}</span> },
    { key: "employeeId", header: "Emp. ID", render: (u: UserData) => <span className="text-xs text-muted-foreground">{u.employeeId || "—"}</span> },
    { key: "email", header: "Email", render: (u: UserData) => <span className="text-muted-foreground text-xs">{u.email}</span> },
    { key: "username", header: "Username", render: (u: UserData) => <span className="font-mono text-xs">{u.username}</span> },
    { key: "role", header: "Role", render: (u: UserData) => (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-accent text-accent-foreground"><Shield className="w-3 h-3" />{u.role}</span>
    )},
    { key: "department", header: "Dept", render: (u: UserData) => <span className="text-muted-foreground text-xs">{u.department}</span> },
    { key: "permissions", header: "Permissions", render: (u: UserData) => (
      <div className="flex gap-1">
        {u.canView && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">V</span>}
        {u.canAdd && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">A</span>}
        {u.canEdit && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">E</span>}
        {u.canDelete && <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">D</span>}
      </div>
    )},
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editUser?.userId ? "Edit User" : "Create New User"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="core" className="mt-4">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: isClient ? "1fr 1fr 1fr" : "1fr 1fr" }}>
              <TabsTrigger value="core">Core Info</TabsTrigger>
              <TabsTrigger value="access">Permissions</TabsTrigger>
              {isClient && <TabsTrigger value="client">Client Details</TabsTrigger>}
            </TabsList>
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
                  <Label>Role</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>{["Admin", "Manager", "Employee", "Client"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
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
            <TabsContent value="access" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div><p className="text-sm font-medium">Financial Module Access</p><p className="text-xs text-muted-foreground">Allow access to financial data</p></div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div><p className="text-sm font-medium">Tender Module Access</p><p className="text-xs text-muted-foreground">Allow access to tender management</p></div>
                  <Switch />
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-semibold mb-3">Granular Permissions</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[{ key: "canView", label: "View", desc: "View data" }, { key: "canAdd", label: "Add", desc: "Create records" },
                    { key: "canEdit", label: "Edit", desc: "Modify records" }, { key: "canDelete", label: "Delete", desc: "Remove records" }].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between p-2 rounded border">
                      <div><p className="text-sm font-medium">{perm.label}</p><p className="text-[10px] text-muted-foreground">{perm.desc}</p></div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-semibold mb-2">Project Access</h4>
                <p className="text-xs text-muted-foreground mb-3">{isRestricted ? "Assign specific projects" : "Full access to all projects"}</p>
                {isRestricted && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allProjects.map((p) => (
                      <label key={p} className="flex items-center gap-2 text-sm hover:bg-muted/50 p-1 rounded cursor-pointer"><Checkbox /> {p}</label>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
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
                  { l: "Financial Access", v: viewUser.financialAccess ? "Yes" : "No" },
                  { l: "Tender Access", v: viewUser.tenderAccess ? "Yes" : "No" },
                ].map((item) => (
                  <div key={item.l}><p className="text-muted-foreground text-xs mb-0.5">{item.l}</p><p className="font-medium">{item.v}</p></div>
                ))}
              </div>
              <div className="rounded-md border p-3">
                <h4 className="text-xs font-semibold mb-2">Permissions</h4>
                <div className="flex gap-2">
                  {viewUser.canView && <span className="text-xs px-2 py-0.5 rounded bg-muted">View</span>}
                  {viewUser.canAdd && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">Add</span>}
                  {viewUser.canEdit && <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">Edit</span>}
                  {viewUser.canDelete && <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">Delete</span>}
                </div>
              </div>
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
