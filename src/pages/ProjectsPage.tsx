import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Plus, Trash2, Pencil, Eye, MoreHorizontal, Upload, AlertTriangle,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Status = "completed" | "pending" | "delayed" | "not-started" | "in-progress";
type Priority = "critical" | "high" | "medium" | "low";

interface DepartmentStatus {
  status: Status;
  progress: number;
  plannedDate: string;
  startDate: string;
  completionDate: string;
}

interface Project {
  projectId: string;
  jobId: string;
  tagId: string;
  title: string;
  description: string;
  customerName: string;
  customerContact: string;
  customerEmail: string;
  customerPhone: string;
  erpNextPORef: string;
  poDate: string;
  category: string;
  projectType: string;
  priority: Priority;
  deliveryDate: string;
  createdDate: string;
  overall: Status;
  overallProgress: number;
  projectValue: string;
  currency: string;
  tender: DepartmentStatus;
  design: DepartmentStatus;
  drawing: DepartmentStatus;
  qap: DepartmentStatus;
  bom: DepartmentStatus;
  purchase: DepartmentStatus;
  production: DepartmentStatus;
  finishing: DepartmentStatus;
  dispatch: DepartmentStatus;
}

const mkDept = (s: Status, p: number, planned: string, start = "", end = ""): DepartmentStatus => ({
  status: s, progress: p, plannedDate: planned, startDate: start, completionDate: end,
});

const projects: Project[] = [
  {
    projectId: "PRJ-2024-001", jobId: "JOB-2024-001", tagId: "HE-101", title: "Shell & Tube Heat Exchanger",
    description: "Custom shell and tube HE for Reliance refinery", customerName: "Reliance Industries",
    customerContact: "Mukesh Ambani", customerEmail: "procurement@reliance.com", customerPhone: "+91 9876543210",
    erpNextPORef: "PO-2024-0456", poDate: "2026-01-15", category: "Heat Exchanger", projectType: "Custom",
    priority: "high", deliveryDate: "2026-04-15", createdDate: "2026-01-10", overall: "in-progress", overallProgress: 25,
    projectValue: "₹45,00,000", currency: "INR",
    tender: mkDept("completed", 100, "2026-01-05", "2026-01-05", "2026-01-10"),
    design: mkDept("in-progress", 60, "2026-01-15", "2026-01-16", ""),
    drawing: mkDept("pending", 10, "2026-02-01", "", ""),
    qap: mkDept("not-started", 0, "2026-02-15", "", ""),
    bom: mkDept("not-started", 0, "2026-02-20", "", ""),
    purchase: mkDept("not-started", 0, "2026-03-01", "", ""),
    production: mkDept("not-started", 0, "2026-03-10", "", ""),
    finishing: mkDept("not-started", 0, "2026-03-25", "", ""),
    dispatch: mkDept("not-started", 0, "2026-04-10", "", ""),
  },
  {
    projectId: "PRJ-2024-002", jobId: "JOB-2024-002", tagId: "HE-102", title: "Plate Heat Exchanger",
    description: "Plate type HE for Tata Steel cooling", customerName: "Tata Steel",
    customerContact: "Ravi Kumar", customerEmail: "purchase@tatasteel.com", customerPhone: "+91 9876543211",
    erpNextPORef: "PO-2024-0789", poDate: "2025-12-20", category: "Heat Exchanger", projectType: "Standard",
    priority: "medium", deliveryDate: "2026-03-20", createdDate: "2025-12-20", overall: "in-progress", overallProgress: 72,
    projectValue: "₹32,50,000", currency: "INR",
    tender: mkDept("completed", 100, "2025-12-15", "2025-12-15", "2025-12-20"),
    design: mkDept("completed", 100, "2025-12-25", "2025-12-26", "2026-01-10"),
    drawing: mkDept("completed", 100, "2026-01-05", "2026-01-06", "2026-01-15"),
    qap: mkDept("completed", 100, "2026-01-10", "2026-01-12", "2026-01-20"),
    bom: mkDept("completed", 100, "2026-01-15", "2026-01-16", "2026-01-25"),
    purchase: mkDept("completed", 100, "2026-01-20", "2026-01-22", "2026-02-05"),
    production: mkDept("in-progress", 65, "2026-02-05", "2026-02-06", ""),
    finishing: mkDept("not-started", 0, "2026-03-01", "", ""),
    dispatch: mkDept("not-started", 0, "2026-03-15", "", ""),
  },
  {
    projectId: "PRJ-2024-003", jobId: "JOB-2024-003", tagId: "TE-201", title: "Air Cooled Condenser",
    description: "Industrial ACC for BPCL refinery", customerName: "BPCL",
    customerContact: "Suresh Patel", customerEmail: "projects@bpcl.com", customerPhone: "+91 9876543212",
    erpNextPORef: "PO-2024-1023", poDate: "2025-11-15", category: "Thermal Equipment", projectType: "Custom",
    priority: "critical", deliveryDate: "2026-03-01", createdDate: "2025-11-15", overall: "delayed", overallProgress: 55,
    projectValue: "₹78,00,000", currency: "INR",
    tender: mkDept("completed", 100, "2025-11-10", "2025-11-10", "2025-11-15"),
    design: mkDept("completed", 100, "2025-11-20", "2025-11-22", "2025-12-10"),
    drawing: mkDept("completed", 100, "2025-12-01", "2025-12-02", "2025-12-15"),
    qap: mkDept("completed", 100, "2025-12-10", "2025-12-12", "2025-12-22"),
    bom: mkDept("completed", 100, "2025-12-15", "2025-12-16", "2025-12-28"),
    purchase: mkDept("delayed", 40, "2026-01-05", "2026-01-08", ""),
    production: mkDept("not-started", 0, "2026-01-25", "", ""),
    finishing: mkDept("not-started", 0, "2026-02-15", "", ""),
    dispatch: mkDept("not-started", 0, "2026-02-25", "", ""),
  },
  {
    projectId: "PRJ-2024-004", jobId: "JOB-2024-004", tagId: "HE-103", title: "Double Pipe HE",
    description: "Double pipe HE for IOCL", customerName: "IOCL",
    customerContact: "Anil Mehta", customerEmail: "engineering@iocl.com", customerPhone: "+91 9876543213",
    erpNextPORef: "PO-2024-1156", poDate: "2026-01-05", category: "Heat Exchanger", projectType: "Repeat Order",
    priority: "medium", deliveryDate: "2026-05-10", createdDate: "2026-01-05", overall: "in-progress", overallProgress: 18,
    projectValue: "₹22,00,000", currency: "INR",
    tender: mkDept("completed", 100, "2026-01-01", "2026-01-01", "2026-01-05"),
    design: mkDept("in-progress", 45, "2026-01-15", "2026-01-18", ""),
    drawing: mkDept("not-started", 0, "2026-02-01", "", ""),
    qap: mkDept("not-started", 0, "2026-02-15", "", ""),
    bom: mkDept("not-started", 0, "2026-02-25", "", ""),
    purchase: mkDept("not-started", 0, "2026-03-05", "", ""),
    production: mkDept("not-started", 0, "2026-03-20", "", ""),
    finishing: mkDept("not-started", 0, "2026-04-15", "", ""),
    dispatch: mkDept("not-started", 0, "2026-05-01", "", ""),
  },
  {
    projectId: "PRJ-2024-005", jobId: "JOB-2024-005", tagId: "TE-202", title: "Waste Heat Recovery Unit",
    description: "WHRU for HPCL", customerName: "HPCL",
    customerContact: "Rajesh Gupta", customerEmail: "projects@hpcl.com", customerPhone: "+91 9876543214",
    erpNextPORef: "PO-2024-1289", poDate: "2026-02-01", category: "Thermal Equipment", projectType: "Custom",
    priority: "low", deliveryDate: "2026-06-01", createdDate: "2026-02-01", overall: "not-started", overallProgress: 5,
    projectValue: "₹55,00,000", currency: "INR",
    tender: mkDept("in-progress", 30, "2026-01-25", "2026-01-28", ""),
    design: mkDept("not-started", 0, "2026-02-15", "", ""),
    drawing: mkDept("not-started", 0, "2026-03-01", "", ""),
    qap: mkDept("not-started", 0, "2026-03-15", "", ""),
    bom: mkDept("not-started", 0, "2026-03-25", "", ""),
    purchase: mkDept("not-started", 0, "2026-04-05", "", ""),
    production: mkDept("not-started", 0, "2026-04-20", "", ""),
    finishing: mkDept("not-started", 0, "2026-05-10", "", ""),
    dispatch: mkDept("not-started", 0, "2026-05-25", "", ""),
  },
  {
    projectId: "PRJ-2024-006", jobId: "JOB-2024-006", tagId: "HE-104", title: "Spiral Heat Exchanger",
    description: "Spiral HE for GAIL", customerName: "GAIL",
    customerContact: "Vikram Rao", customerEmail: "procurement@gail.com", customerPhone: "+91 9876543215",
    erpNextPORef: "PO-2024-0876", poDate: "2025-10-15", category: "Heat Exchanger", projectType: "Standard",
    priority: "medium", deliveryDate: "2026-02-28", createdDate: "2025-10-15", overall: "completed", overallProgress: 100,
    projectValue: "₹41,00,000", currency: "INR",
    tender: mkDept("completed", 100, "2025-10-10", "2025-10-10", "2025-10-15"),
    design: mkDept("completed", 100, "2025-10-20", "2025-10-22", "2025-11-05"),
    drawing: mkDept("completed", 100, "2025-11-01", "2025-11-02", "2025-11-12"),
    qap: mkDept("completed", 100, "2025-11-10", "2025-11-12", "2025-11-22"),
    bom: mkDept("completed", 100, "2025-11-15", "2025-11-16", "2025-11-28"),
    purchase: mkDept("completed", 100, "2025-11-20", "2025-11-22", "2025-12-10"),
    production: mkDept("completed", 100, "2025-12-05", "2025-12-06", "2026-01-20"),
    finishing: mkDept("completed", 100, "2026-01-20", "2026-01-21", "2026-02-05"),
    dispatch: mkDept("completed", 100, "2026-02-10", "2026-02-12", "2026-02-15"),
  },
  {
    projectId: "PRJ-2024-007", jobId: "JOB-2024-007", tagId: "TE-203", title: "Fired Heater Assembly",
    description: "Fired heater for NTPC", customerName: "NTPC",
    customerContact: "Arun Singh", customerEmail: "projects@ntpc.com", customerPhone: "+91 9876543216",
    erpNextPORef: "PO-2024-1345", poDate: "2025-12-01", category: "Thermal Equipment", projectType: "Custom",
    priority: "high", deliveryDate: "2026-04-25", createdDate: "2025-12-01", overall: "delayed", overallProgress: 22,
    projectValue: "₹67,50,000", currency: "INR",
    tender: mkDept("completed", 100, "2025-11-25", "2025-11-25", "2025-12-01"),
    design: mkDept("delayed", 35, "2025-12-10", "2025-12-15", ""),
    drawing: mkDept("not-started", 0, "2026-01-05", "", ""),
    qap: mkDept("not-started", 0, "2026-01-20", "", ""),
    bom: mkDept("not-started", 0, "2026-02-01", "", ""),
    purchase: mkDept("not-started", 0, "2026-02-15", "", ""),
    production: mkDept("not-started", 0, "2026-03-01", "", ""),
    finishing: mkDept("not-started", 0, "2026-03-25", "", ""),
    dispatch: mkDept("not-started", 0, "2026-04-15", "", ""),
  },
];

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress", completed: "Completed", delayed: "Delayed",
  pending: "Pending", "not-started": "Not Started",
};

const deptKeys = [
  { key: "tender", label: "Tender" },
  { key: "design", label: "Design" },
  { key: "drawing", label: "Drawing" },
  { key: "qap", label: "QAP" },
  { key: "bom", label: "BOM" },
  { key: "purchase", label: "Purchase" },
  { key: "production", label: "Prod." },
  { key: "finishing", label: "Finish" },
  { key: "dispatch", label: "Dispatch" },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.projectId.toLowerCase().includes(s) || p.jobId.toLowerCase().includes(s) ||
      p.customerName.toLowerCase().includes(s) || p.tagId.toLowerCase().includes(s) || p.title.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "all" || p.overall === statusFilter;
    const matchesPriority = priorityFilter === "all" || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getDeptStatusColor = (status: Status) => {
    const map: Record<Status, string> = {
      completed: "hsl(var(--status-completed))",
      "in-progress": "hsl(var(--status-in-progress))",
      delayed: "hsl(var(--status-delayed))",
      pending: "hsl(var(--status-pending))",
      "not-started": "hsl(var(--status-not-started))",
    };
    return map[status];
  };

  const columns = [
    { key: "projectId", header: "Project ID", render: (p: Project) => <span className="font-medium text-primary whitespace-nowrap text-xs">{p.projectId}</span> },
    { key: "tagId", header: "Tag ID", render: (p: Project) => <span className="font-mono text-xs">{p.tagId}</span> },
    { key: "customer", header: "Customer", render: (p: Project) => <span className="whitespace-nowrap text-xs">{p.customerName}</span> },
    ...deptKeys.map((d) => ({
      key: d.key,
      header: d.label,
      headerClassName: "text-center px-1",
      className: "text-center px-1",
      render: (p: Project) => {
        const dept = p[d.key as keyof Project] as DepartmentStatus;
        return (
          <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
            <span className="text-[10px] font-semibold" style={{ color: getDeptStatusColor(dept.status) }}>{dept.progress}%</span>
            <div className="w-full max-w-[36px] h-1.5 rounded-full overflow-hidden bg-muted">
              <div className="h-full rounded-full transition-all" style={{ width: `${dept.progress}%`, backgroundColor: getDeptStatusColor(dept.status) }} />
            </div>
          </div>
        );
      },
    })),
    {
      key: "overall", header: "Overall", headerClassName: "text-center", className: "text-center",
      render: (p: Project) => (
        <div className="flex items-center gap-1.5 min-w-[65px]">
          <Progress value={p.overallProgress} className="h-1.5 flex-1" />
          <span className="text-xs font-semibold">{p.overallProgress}%</span>
        </div>
      ),
    },
    { key: "priority", header: "Priority", render: (p: Project) => <PriorityBadge priority={p.priority} /> },
    { key: "delivery", header: "Delivery", render: (p: Project) => <span className="text-muted-foreground text-xs whitespace-nowrap">{p.deliveryDate}</span> },
    { key: "status", header: "Status", render: (p: Project) => <StatusBadge status={p.overall}>{statusLabels[p.overall]}</StatusBadge> },
    {
      key: "actions", header: "", headerClassName: "w-10", className: "w-10",
      render: (p: Project) => (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setActionMenu(actionMenu === p.projectId ? null : p.projectId)} className="p-1.5 rounded hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {actionMenu === p.projectId && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                <button onClick={() => { navigate(`/projects/${p.projectId}`); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => { setEditProject({ ...p }); setDialogOpen(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <div className="border-t my-1" />
                <button onClick={() => { setDeleteConfirm(p.projectId); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
        </div>
        <button onClick={() => { setEditProject({}); setDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="All Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(p) => p.projectId} onRowClick={(p) => navigate(`/projects/${p.projectId}`)} pageSize={10} showExport={false} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editProject?.projectId ? "Edit Project" : "Create New Project"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic">Project Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="dates">Department Dates</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Project ID</Label><Input value="PRJ-2024-XXX" disabled /></div>
                <div className="space-y-2"><Label>Job ID (Client Item ID)</Label><Input placeholder="JOB-2024-XXX" /></div>
                <div className="space-y-2"><Label>Tag ID (Internal)</Label><Input placeholder="HE-XXX" /></div>
                <div className="space-y-2"><Label>Project Title</Label><Input placeholder="Shell & Tube HE" /></div>
                <div className="space-y-2 col-span-2"><Label>Description</Label><Textarea placeholder="Detailed description..." rows={2} /></div>
                <div className="space-y-2"><Label>ERPNext PO Reference</Label><Input placeholder="PO-2024-XXXX" /></div>
                <div className="space-y-2"><Label>PO Date</Label><Input type="date" /></div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="heat-exchanger">Heat Exchanger</SelectItem><SelectItem value="thermal">Thermal Equipment</SelectItem><SelectItem value="custom">Custom Fabrication</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="custom">Custom</SelectItem><SelectItem value="repeat">Repeat Order</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Delivery Date</Label><Input type="date" /></div>
              </div>
              <div className="space-y-2">
                <Label>Documents</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop or <span className="text-primary font-medium cursor-pointer">browse</span></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Customer ID</Label><Input placeholder="Linked to Master" /></div>
                <div className="space-y-2"><Label>Customer Name</Label><Input placeholder="Company name" /></div>
                <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="+91 98765 43210" /></div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Project Value</Label><Input placeholder="₹0" /></div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select><SelectTrigger><SelectValue placeholder="INR" /></SelectTrigger>
                    <SelectContent><SelectItem value="INR">INR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Advance Amount</Label><Input placeholder="₹0" /></div>
                <div className="space-y-2"><Label>Advance Received Date</Label><Input type="date" /></div>
                <div className="space-y-2">
                  <Label>Advance Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="received">Received</SelectItem><SelectItem value="na">Not Applicable</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Guarantee Amount</Label><Input placeholder="Optional" /></div>
              </div>
            </TabsContent>

            <TabsContent value="dates" className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground mb-2">Set planned, start, and completion dates for each department</p>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Department</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Planned Date</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Start Date</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Tender", "Design", "Drawing", "QAP", "BOM/Purchase", "Production", "Finishing", "Dispatch"].map((dept) => (
                      <tr key={dept} className="border-t">
                        <td className="px-3 py-2 font-medium text-xs">{dept}</td>
                        <td className="px-3 py-2"><Input type="date" className="h-7 text-xs" /></td>
                        <td className="px-3 py-2"><Input type="date" className="h-7 text-xs" /></td>
                        <td className="px-3 py-2"><Input type="date" className="h-7 text-xs" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">
              {editProject?.projectId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Delete Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong className="text-foreground">{deleteConfirm}</strong>?</p>
            <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3">
              <p className="text-xs text-destructive font-medium">⚠ This action is irreversible</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:opacity-90">Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
