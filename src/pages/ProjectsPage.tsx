import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  X,
  Upload,
  Trash2,
  Pencil,
  Eye,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Status = "completed" | "pending" | "delayed" | "not-started" | "in-progress";
type Priority = "critical" | "high" | "medium" | "low";

interface DepartmentStatus {
  status: Status;
  progress: number;
  updatedBy: string;
  updatedDate: string;
  remarks: string;
  revisionNumber: number;
  delayReason?: string;
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
  advanceAmount: string;
  advanceReceivedDate: string;
  advanceStatus: string;
  guaranteeAmount: string;
  guaranteeType: string;
  invoiceGenerated: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDueDate: string;
  paymentStatus: string;
  balanceAmount: string;
  financialRemarks: string;
  tender: DepartmentStatus;
  design: DepartmentStatus;
  drawing: DepartmentStatus;
  qap: DepartmentStatus;
  bomValidation: DepartmentStatus;
  purchase: DepartmentStatus;
  production: DepartmentStatus;
  finishing: DepartmentStatus;
  dispatch: DepartmentStatus;
  finance: DepartmentStatus;
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  versionNumber: number;
}

const makeDeptStatus = (status: Status, progress = 0, by = "System", date = "2026-02-20", remarks = "", rev = 1, delay?: string): DepartmentStatus => ({
  status, progress, updatedBy: by, updatedDate: date, remarks, revisionNumber: rev, delayReason: delay,
});

const projects: Project[] = [
  {
    projectId: "PRJ-2024-001", jobId: "JOB-2024-001", tagId: "HE-101", title: "Shell & Tube Heat Exchanger",
    description: "Custom shell and tube heat exchanger for Reliance refinery", customerName: "Reliance Industries",
    customerContact: "Mukesh Ambani", customerEmail: "procurement@reliance.com", customerPhone: "+91 9876543210",
    erpNextPORef: "PO-2024-0456", poDate: "2026-01-15", category: "Heat Exchanger", projectType: "Custom",
    priority: "high", deliveryDate: "2026-04-15", createdDate: "2026-01-10", overall: "in-progress", overallProgress: 25,
    projectValue: "₹45,00,000", currency: "INR", advanceAmount: "₹13,50,000", advanceReceivedDate: "2026-01-20",
    advanceStatus: "Received", guaranteeAmount: "₹4,50,000", guaranteeType: "Bank Guarantee",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "2026-05-15",
    paymentStatus: "Partial", balanceAmount: "₹31,50,000", financialRemarks: "Advance received",
    tender: makeDeptStatus("completed", 100, "Amit", "2026-01-10"), design: makeDeptStatus("in-progress", 60, "Priya", "2026-02-15"),
    drawing: makeDeptStatus("pending", 10, "Priya", "2026-02-18"), qap: makeDeptStatus("not-started", 0),
    bomValidation: makeDeptStatus("not-started", 0), purchase: makeDeptStatus("not-started", 0),
    production: makeDeptStatus("not-started", 0), finishing: makeDeptStatus("not-started", 0),
    dispatch: makeDeptStatus("not-started", 0), finance: makeDeptStatus("in-progress", 40, "Sanjay", "2026-01-20"),
    createdBy: "Admin", lastModifiedBy: "Priya Sharma", lastModifiedDate: "2026-02-15", versionNumber: 5,
  },
  {
    projectId: "PRJ-2024-002", jobId: "JOB-2024-002", tagId: "HE-102", title: "Plate Heat Exchanger",
    description: "Plate type HE for Tata Steel cooling system", customerName: "Tata Steel",
    customerContact: "Ravi Kumar", customerEmail: "purchase@tatasteel.com", customerPhone: "+91 9876543211",
    erpNextPORef: "PO-2024-0789", poDate: "2025-12-20", category: "Heat Exchanger", projectType: "Standard",
    priority: "medium", deliveryDate: "2026-03-20", createdDate: "2025-12-20", overall: "in-progress", overallProgress: 72,
    projectValue: "₹32,50,000", currency: "INR", advanceAmount: "₹9,75,000", advanceReceivedDate: "2025-12-25",
    advanceStatus: "Received", guaranteeAmount: "₹3,25,000", guaranteeType: "Retention",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "2026-04-20",
    paymentStatus: "Pending", balanceAmount: "₹22,75,000", financialRemarks: "",
    tender: makeDeptStatus("completed", 100), design: makeDeptStatus("completed", 100),
    drawing: makeDeptStatus("completed", 100), qap: makeDeptStatus("completed", 100),
    bomValidation: makeDeptStatus("completed", 100), purchase: makeDeptStatus("completed", 100),
    production: makeDeptStatus("in-progress", 65, "Deepak", "2026-02-10"),
    finishing: makeDeptStatus("not-started", 0), dispatch: makeDeptStatus("not-started", 0),
    finance: makeDeptStatus("in-progress", 50),
    createdBy: "Admin", lastModifiedBy: "Deepak Singh", lastModifiedDate: "2026-02-10", versionNumber: 12,
  },
  {
    projectId: "PRJ-2024-003", jobId: "JOB-2024-003", tagId: "TE-201", title: "Air Cooled Condenser",
    description: "Industrial air cooled condenser for BPCL refinery", customerName: "BPCL",
    customerContact: "Suresh Patel", customerEmail: "projects@bpcl.com", customerPhone: "+91 9876543212",
    erpNextPORef: "PO-2024-1023", poDate: "2025-11-15", category: "Thermal Equipment", projectType: "Custom",
    priority: "critical", deliveryDate: "2026-03-01", createdDate: "2025-11-15", overall: "delayed", overallProgress: 55,
    projectValue: "₹78,00,000", currency: "INR", advanceAmount: "₹23,40,000", advanceReceivedDate: "2025-11-20",
    advanceStatus: "Received", guaranteeAmount: "₹7,80,000", guaranteeType: "Performance Guarantee",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "2026-04-01",
    paymentStatus: "Pending", balanceAmount: "₹54,60,000", financialRemarks: "High value project",
    tender: makeDeptStatus("completed", 100), design: makeDeptStatus("completed", 100),
    drawing: makeDeptStatus("completed", 100), qap: makeDeptStatus("completed", 100),
    bomValidation: makeDeptStatus("completed", 100), purchase: makeDeptStatus("delayed", 40, "Amit", "2026-02-01", "Vendor delay", 2, "Raw material shortage"),
    production: makeDeptStatus("not-started", 0), finishing: makeDeptStatus("not-started", 0),
    dispatch: makeDeptStatus("not-started", 0), finance: makeDeptStatus("pending", 20),
    createdBy: "Admin", lastModifiedBy: "Amit Patel", lastModifiedDate: "2026-02-01", versionNumber: 8,
  },
  {
    projectId: "PRJ-2024-004", jobId: "JOB-2024-004", tagId: "HE-103", title: "Double Pipe Heat Exchanger",
    description: "Double pipe heat exchanger for IOCL", customerName: "IOCL",
    customerContact: "Anil Mehta", customerEmail: "engineering@iocl.com", customerPhone: "+91 9876543213",
    erpNextPORef: "PO-2024-1156", poDate: "2026-01-05", category: "Heat Exchanger", projectType: "Repeat Order",
    priority: "medium", deliveryDate: "2026-05-10", createdDate: "2026-01-05", overall: "in-progress", overallProgress: 18,
    projectValue: "₹22,00,000", currency: "INR", advanceAmount: "₹6,60,000", advanceReceivedDate: "",
    advanceStatus: "Pending", guaranteeAmount: "", guaranteeType: "Not Applicable",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "2026-06-10",
    paymentStatus: "Pending", balanceAmount: "₹22,00,000", financialRemarks: "Awaiting advance",
    tender: makeDeptStatus("completed", 100), design: makeDeptStatus("in-progress", 45),
    drawing: makeDeptStatus("not-started", 0), qap: makeDeptStatus("not-started", 0),
    bomValidation: makeDeptStatus("not-started", 0), purchase: makeDeptStatus("not-started", 0),
    production: makeDeptStatus("not-started", 0), finishing: makeDeptStatus("not-started", 0),
    dispatch: makeDeptStatus("not-started", 0), finance: makeDeptStatus("pending", 10),
    createdBy: "Admin", lastModifiedBy: "Priya Sharma", lastModifiedDate: "2026-02-12", versionNumber: 3,
  },
  {
    projectId: "PRJ-2024-005", jobId: "JOB-2024-005", tagId: "TE-202", title: "Waste Heat Recovery Unit",
    description: "Waste heat recovery for HPCL", customerName: "HPCL",
    customerContact: "Rajesh Gupta", customerEmail: "projects@hpcl.com", customerPhone: "+91 9876543214",
    erpNextPORef: "PO-2024-1289", poDate: "2026-02-01", category: "Thermal Equipment", projectType: "Custom",
    priority: "low", deliveryDate: "2026-06-01", createdDate: "2026-02-01", overall: "not-started", overallProgress: 5,
    projectValue: "₹55,00,000", currency: "INR", advanceAmount: "₹16,50,000", advanceReceivedDate: "",
    advanceStatus: "Not Applicable", guaranteeAmount: "", guaranteeType: "Not Applicable",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "",
    paymentStatus: "Pending", balanceAmount: "₹55,00,000", financialRemarks: "",
    tender: makeDeptStatus("in-progress", 30), design: makeDeptStatus("not-started", 0),
    drawing: makeDeptStatus("not-started", 0), qap: makeDeptStatus("not-started", 0),
    bomValidation: makeDeptStatus("not-started", 0), purchase: makeDeptStatus("not-started", 0),
    production: makeDeptStatus("not-started", 0), finishing: makeDeptStatus("not-started", 0),
    dispatch: makeDeptStatus("not-started", 0), finance: makeDeptStatus("not-started", 0),
    createdBy: "Admin", lastModifiedBy: "Admin", lastModifiedDate: "2026-02-01", versionNumber: 1,
  },
  {
    projectId: "PRJ-2024-006", jobId: "JOB-2024-006", tagId: "HE-104", title: "Spiral Heat Exchanger",
    description: "Spiral HE for GAIL gas processing plant", customerName: "GAIL",
    customerContact: "Vikram Rao", customerEmail: "procurement@gail.com", customerPhone: "+91 9876543215",
    erpNextPORef: "PO-2024-0876", poDate: "2025-10-15", category: "Heat Exchanger", projectType: "Standard",
    priority: "medium", deliveryDate: "2026-02-28", createdDate: "2025-10-15", overall: "completed", overallProgress: 100,
    projectValue: "₹41,00,000", currency: "INR", advanceAmount: "₹12,30,000", advanceReceivedDate: "2025-10-20",
    advanceStatus: "Received", guaranteeAmount: "₹4,10,000", guaranteeType: "Retention",
    invoiceGenerated: "Yes", invoiceNumber: "INV-2026-0045", invoiceDate: "2026-02-25",
    paymentDueDate: "2026-03-28", paymentStatus: "Pending", balanceAmount: "₹28,70,000", financialRemarks: "Invoice sent",
    tender: makeDeptStatus("completed", 100), design: makeDeptStatus("completed", 100),
    drawing: makeDeptStatus("completed", 100), qap: makeDeptStatus("completed", 100),
    bomValidation: makeDeptStatus("completed", 100), purchase: makeDeptStatus("completed", 100),
    production: makeDeptStatus("completed", 100), finishing: makeDeptStatus("completed", 100),
    dispatch: makeDeptStatus("completed", 100), finance: makeDeptStatus("completed", 100),
    createdBy: "Admin", lastModifiedBy: "Sanjay Mehta", lastModifiedDate: "2026-02-25", versionNumber: 22,
  },
  {
    projectId: "PRJ-2024-007", jobId: "JOB-2024-007", tagId: "TE-203", title: "Fired Heater Assembly",
    description: "Fired heater for NTPC power plant", customerName: "NTPC",
    customerContact: "Arun Singh", customerEmail: "projects@ntpc.com", customerPhone: "+91 9876543216",
    erpNextPORef: "PO-2024-1345", poDate: "2025-12-01", category: "Thermal Equipment", projectType: "Custom",
    priority: "high", deliveryDate: "2026-04-25", createdDate: "2025-12-01", overall: "delayed", overallProgress: 22,
    projectValue: "₹67,50,000", currency: "INR", advanceAmount: "₹20,25,000", advanceReceivedDate: "2025-12-10",
    advanceStatus: "Received", guaranteeAmount: "₹6,75,000", guaranteeType: "Bank Guarantee",
    invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "2026-05-25",
    paymentStatus: "Partial", balanceAmount: "₹47,25,000", financialRemarks: "Design delay impacting timeline",
    tender: makeDeptStatus("completed", 100), design: makeDeptStatus("delayed", 35, "Priya", "2026-02-05", "Client revision", 3, "Scope change"),
    drawing: makeDeptStatus("not-started", 0), qap: makeDeptStatus("not-started", 0),
    bomValidation: makeDeptStatus("not-started", 0), purchase: makeDeptStatus("not-started", 0),
    production: makeDeptStatus("not-started", 0), finishing: makeDeptStatus("not-started", 0),
    dispatch: makeDeptStatus("not-started", 0), finance: makeDeptStatus("in-progress", 30),
    createdBy: "Admin", lastModifiedBy: "Priya Sharma", lastModifiedDate: "2026-02-05", versionNumber: 7,
  },
];

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress", completed: "Completed", delayed: "Delayed",
  pending: "Pending", "not-started": "Not Started",
};

const emptyProject = (): Partial<Project> => ({
  title: "", description: "", jobId: "", tagId: "", customerName: "", customerContact: "",
  customerEmail: "", customerPhone: "", erpNextPORef: "", poDate: "", category: "Heat Exchanger",
  projectType: "Standard", priority: "medium", deliveryDate: "",
  projectValue: "", currency: "INR", advanceAmount: "", advanceReceivedDate: "",
  advanceStatus: "Pending", guaranteeAmount: "", guaranteeType: "Not Applicable",
  invoiceGenerated: "No", invoiceNumber: "", invoiceDate: "", paymentDueDate: "",
  paymentStatus: "Pending", balanceAmount: "", financialRemarks: "",
});

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
    const matchesSearch =
      p.projectId.toLowerCase().includes(search.toLowerCase()) ||
      p.jobId.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.tagId.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.overall === statusFilter;
    const matchesPriority = priorityFilter === "all" || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openAdd = () => {
    setEditProject(emptyProject());
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditProject({ ...p });
    setDialogOpen(true);
    setActionMenu(null);
  };

  const deptColumns = [
    { key: "tender", label: "Tender" },
    { key: "design", label: "Design" },
    { key: "drawing", label: "Drawing" },
    { key: "qap", label: "QAP" },
    { key: "bomValidation", label: "BOM" },
    { key: "purchase", label: "Purchase" },
    { key: "production", label: "Prod." },
    { key: "finishing", label: "Finish" },
    { key: "dispatch", label: "Dispatch" },
    { key: "finance", label: "Finance" },
  ];

  const columns = [
    { key: "projectId", header: "Project ID", render: (p: Project) => <span className="font-medium text-primary whitespace-nowrap">{p.projectId}</span> },
    { key: "tagId", header: "Tag ID", render: (p: Project) => <span className="font-mono text-xs">{p.tagId}</span> },
    { key: "customer", header: "Customer", render: (p: Project) => <span className="whitespace-nowrap">{p.customerName}</span> },
    ...deptColumns.map((d) => ({
      key: d.key,
      header: d.label,
      headerClassName: "text-center px-1",
      className: "text-center px-1",
      render: (p: Project) => {
        const dept = p[d.key as keyof Project] as DepartmentStatus;
        return (
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-full max-w-[40px] h-1.5 rounded-full overflow-hidden bg-muted`}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${dept.progress}%`,
                  backgroundColor: dept.status === "completed" ? "hsl(var(--status-completed))"
                    : dept.status === "delayed" ? "hsl(var(--status-delayed))"
                    : dept.status === "in-progress" ? "hsl(var(--status-in-progress))"
                    : dept.status === "pending" ? "hsl(var(--status-pending))"
                    : "hsl(var(--status-not-started))"
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{dept.progress}%</span>
          </div>
        );
      },
    })),
    {
      key: "overallProgress",
      header: "Overall",
      headerClassName: "text-center",
      className: "text-center",
      render: (p: Project) => (
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <Progress value={p.overallProgress} className="h-1.5 flex-1" />
          <span className="text-xs font-semibold text-foreground">{p.overallProgress}%</span>
        </div>
      ),
    },
    { key: "priority", header: "Priority", render: (p: Project) => <PriorityBadge priority={p.priority} /> },
    { key: "delivery", header: "Delivery", render: (p: Project) => <span className="text-muted-foreground text-xs whitespace-nowrap">{p.deliveryDate}</span> },
    { key: "overall", header: "Status", render: (p: Project) => <StatusBadge status={p.overall}>{statusLabels[p.overall]}</StatusBadge> },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (p: Project) => (
        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setActionMenu(actionMenu === p.projectId ? null : p.projectId)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {actionMenu === p.projectId && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
                <button onClick={() => { navigate(`/projects/${p.projectId}`); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => openEdit(p)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <div className="border-t my-1" />
                <button onClick={() => { setDeleteConfirm(p.projectId); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Project ID, Job ID, Tag, or Customer..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
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
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(p) => p.projectId}
        onRowClick={(p) => navigate(`/projects/${p.projectId}`)}
        pageSize={10}
        showExport={false}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProject?.projectId ? "Edit Project" : "Create New Project"}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic">Project Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project ID</Label>
                  <Input value="PRJ-2024-XXX" disabled placeholder="Auto generated" />
                </div>
                <div className="space-y-2">
                  <Label>Job ID (Client Item ID)</Label>
                  <Input placeholder="e.g. JOB-2024-001" />
                </div>
                <div className="space-y-2">
                  <Label>Tag ID (Internal)</Label>
                  <Input placeholder="e.g. HE-101" />
                </div>
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input placeholder="Shell & Tube Heat Exchanger" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Project Description</Label>
                  <Textarea placeholder="Detailed description..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>ERPNext PO Reference</Label>
                  <Input placeholder="PO-2024-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>PO Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Project Category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heat-exchanger">Heat Exchanger</SelectItem>
                      <SelectItem value="thermal-equipment">Thermal Equipment</SelectItem>
                      <SelectItem value="custom-fabrication">Custom Fabrication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="repeat-order">Repeat Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Documents</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files or <span className="text-primary font-medium cursor-pointer">browse</span>
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Customer ID</Label><Input placeholder="Linked to Customer Master" /></div>
                <div className="space-y-2"><Label>Customer Name</Label><Input placeholder="Reliance Industries" /></div>
                <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="+91 98765 43210" /></div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Project Value</Label><Input placeholder="₹45,00,000" /></div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select><SelectTrigger><SelectValue placeholder="INR" /></SelectTrigger>
                    <SelectContent><SelectItem value="INR">INR</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Advance Amount</Label><Input placeholder="₹13,50,000" /></div>
                <div className="space-y-2"><Label>Advance Received Date</Label><Input type="date" /></div>
                <div className="space-y-2">
                  <Label>Advance Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="received">Received</SelectItem><SelectItem value="na">Not Applicable</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Guarantee Amount</Label><Input placeholder="Optional" /></div>
                <div className="space-y-2">
                  <Label>Guarantee Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="retention">Retention</SelectItem><SelectItem value="bank">Bank Guarantee</SelectItem><SelectItem value="performance">Performance Guarantee</SelectItem><SelectItem value="na">Not Applicable</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Generated</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Invoice Number</Label><Input placeholder="INV-2026-XXXX" /></div>
                <div className="space-y-2"><Label>Invoice Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Payment Due Date</Label><Input type="date" /></div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Balance Amount (Auto Calculated)</Label><Input disabled placeholder="Auto calculated" /></div>
                <div className="space-y-2 col-span-2"><Label>Financial Remarks</Label><Textarea placeholder="Any financial notes..." rows={2} /></div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
              {editProject?.projectId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete project <strong className="text-foreground">{deleteConfirm}</strong>?
            </p>
            <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3">
              <p className="text-xs text-destructive font-medium">⚠ Warning: This action is irreversible</p>
              <p className="text-xs text-muted-foreground mt-1">All project data, department statuses, documents, and activity logs will be permanently deleted.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:opacity-90">Delete Project</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
