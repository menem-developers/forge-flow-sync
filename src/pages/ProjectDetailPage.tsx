import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Clock, User, AlertTriangle, Plus, Save, RotateCcw, Image, FileText, X, Search, GripVertical } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const projectData = {
  projectId: "PRJ-2024-001", jobId: "JOB-2024-001", tagId: "HE-101",
  title: "Shell & Tube Heat Exchanger", customerName: "Reliance Industries",
  tenderName: "Reliance Jamnagar Refinery HE Supply", priority: "High",
  deliveryDate: "15 Apr 2026", overall: "in-progress" as const, overallProgress: 25,
  category: "Heat Exchanger", projectType: "Custom", erpPORef: "PO-2024-0456",
  poDate: "15 Jan 2026", projectValue: "₹45,00,000",
};

type Status = "completed" | "pending" | "delayed" | "not-started" | "in-progress";

const deptTabs = ["Overview", "Tender", "Design", "QAP", "BOM/Purchase", "Production", "Finishing", "Dispatch"];

const deptStatuses: Record<string, { current: Status; progress: number; plannedDate: string; startDate: string; completionDate: string }> = {
  Tender: { current: "completed", progress: 100, plannedDate: "2026-01-05", startDate: "2026-01-05", completionDate: "2026-01-10" },
  Design: { current: "in-progress", progress: 60, plannedDate: "2026-01-15", startDate: "2026-01-16", completionDate: "" },
  QAP: { current: "not-started", progress: 0, plannedDate: "2026-02-15", startDate: "", completionDate: "" },
  "BOM/Purchase": { current: "not-started", progress: 0, plannedDate: "2026-02-20", startDate: "", completionDate: "" },
  Production: { current: "not-started", progress: 0, plannedDate: "2026-03-10", startDate: "", completionDate: "" },
  Finishing: { current: "not-started", progress: 0, plannedDate: "2026-03-25", startDate: "", completionDate: "" },
  Dispatch: { current: "not-started", progress: 0, plannedDate: "2026-04-10", startDate: "", completionDate: "" },
};

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress", completed: "Completed", delayed: "Delayed",
  pending: "Pending", "not-started": "Not Started",
};

const activityLog = [
  { user: "Priya Sharma", action: "Updated Design status to In Progress", time: "2026-02-15 14:30", dept: "Design" },
  { user: "Sanjay Mehta", action: "Updated Finance status - Advance received", time: "2026-01-20 10:15", dept: "Finance" },
  { user: "Amit Patel", action: "Completed Tender - Quotation accepted", time: "2026-01-15 16:45", dept: "Tender" },
  { user: "Admin", action: "Created project PRJ-2024-001", time: "2026-01-05 09:00", dept: "System" },
];

const documents = [
  { name: "GA Drawing Rev2.pdf", size: "2.4 MB", date: "2026-02-15", uploadedBy: "Priya Sharma" },
  { name: "PO Document.pdf", size: "1.1 MB", date: "2026-01-15", uploadedBy: "Admin" },
  { name: "Material Specs.xlsx", size: "856 KB", date: "2026-01-10", uploadedBy: "Amit Patel" },
];

const galleryImages = [
  { id: "1", url: "/placeholder.svg", caption: "Shell fabrication progress", date: "2026-03-18" },
  { id: "2", url: "/placeholder.svg", caption: "Tube sheet machined", date: "2026-03-15" },
  { id: "3", url: "/placeholder.svg", caption: "Raw material inspection", date: "2026-03-10" },
  { id: "4", url: "/placeholder.svg", caption: "Baffle plate cutting", date: "2026-03-08" },
];

// QAP table data
const initialQapRows = [
  { id: "1", activity: "Material Test Certificate Review", description: "Review MTC for all raw materials", responsibility: "QA Engineer", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" },
  { id: "2", activity: "Dimensional Inspection Plan", description: "Prepare DIP as per GA drawing", responsibility: "QA Engineer", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" },
  { id: "3", activity: "Welding Procedure Qualification", description: "WPS/PQR qualification", responsibility: "Welding Engineer", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" },
  { id: "4", activity: "Hydro Test Procedure", description: "Hydraulic test as per code", responsibility: "QA Manager", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" },
  { id: "5", activity: "Final Inspection & Certification", description: "Final QA sign-off", responsibility: "QA Manager", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" },
];

// BOM/Purchase table data
const initialBomRows = [
  { id: "1", itemCode: "SA516-70-SH", description: "SA 516 Gr.70 Shell Plate", material: "Carbon Steel", quantity: "2 Nos", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" },
  { id: "2", itemCode: "SA182-F304-TS", description: "SA 182 F304 Tube Sheet", material: "Stainless Steel", quantity: "2 Nos", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" },
  { id: "3", itemCode: "SA179-TB-25", description: "SA 179 Tubes (25.4 OD)", material: "Carbon Steel", quantity: "450 Nos", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" },
  { id: "4", itemCode: "SA105-FL-150", description: "SA 105 Flanges (150#)", material: "Carbon Steel", quantity: "8 Nos", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" },
  { id: "5", itemCode: "GSK-SW-150", description: "Gaskets - Spiral Wound", material: "SS 316L", quantity: "12 Nos", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" },
];

// Production table data
const initialProductionRows = [
  { id: "1", task: "Cutting", plannedDate: "2026-03-10", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
  { id: "2", task: "Machining", plannedDate: "2026-03-14", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
  { id: "3", task: "Assembly", plannedDate: "2026-03-18", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
  { id: "4", task: "Welding", plannedDate: "2026-03-22", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
  { id: "5", task: "Inspection", plannedDate: "2026-03-26", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
  { id: "6", task: "Testing", plannedDate: "2026-03-30", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [qapRows, setQapRows] = useState(initialQapRows);
  const [bomRows, setBomRows] = useState(initialBomRows);
  const [prodRows, setProdRows] = useState(initialProductionRows);
  const [qapSearch, setQapSearch] = useState("");
  const [bomSearch, setBomSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");

  const renderStatusHeader = (dept: string) => {
    const data = deptStatuses[dept];
    if (!data) return null;
    return (
      <div className="rounded-md border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">{dept}</h3>
            <StatusBadge status={data.current}>{statusLabels[data.current]}</StatusBadge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{data.progress}%</span>
            <Progress value={data.progress} className="h-1.5 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Status:</label>
            <Select defaultValue={data.current}>
              <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Add comments..." rows={1} className="flex-1 min-w-[200px] h-8 py-1.5" />
          <label className="text-xs text-muted-foreground cursor-pointer hover:text-primary flex items-center gap-1 border rounded px-2 py-1.5">
            <Upload className="w-3 h-3" /> Upload
          </label>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90">Update</button>
        </div>
      </div>
    );
  };

  const renderDeptTab = (dept: string) => (
    <div className="space-y-4">
      {renderStatusHeader(dept)}
    </div>
  );

  const renderEditableTable = <T extends { id: string }>(
    rows: T[],
    setRows: React.Dispatch<React.SetStateAction<T[]>>,
    searchVal: string,
    setSearchVal: React.Dispatch<React.SetStateAction<string>>,
    headers: { key: string; label: string; width?: string }[],
    renderCell: (row: T, key: string, idx: number) => React.ReactNode,
    newRow: () => T,
  ) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search..."
            className="w-full h-8 pl-8 pr-3 rounded-md border bg-card text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button onClick={() => setRows([...rows, newRow()])} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary border rounded hover:bg-muted">
          <Plus className="w-3 h-3" /> Add Row
        </button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              {headers.map(h => <TableHead key={h.key} className={h.width ? `w-[${h.width}]` : ""}>{h.label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.filter(r => {
              if (!searchVal) return true;
              return JSON.stringify(r).toLowerCase().includes(searchVal.toLowerCase());
            }).map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell className="cursor-grab"><GripVertical className="w-3.5 h-3.5 text-muted-foreground" /></TableCell>
                {headers.map(h => <TableCell key={h.key}>{renderCell(row, h.key, idx)}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs hover:bg-muted"><RotateCcw className="w-3 h-3" /> Reset</button>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90"><Save className="w-3 h-3" /> Save</button>
      </div>
    </div>
  );

  const renderQAPTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("QAP")}
      {renderEditableTable(
        qapRows, setQapRows, qapSearch, setQapSearch,
        [{ key: "activity", label: "Activity" }, { key: "description", label: "Description" }, { key: "responsibility", label: "Responsibility" },
         { key: "status", label: "Status", width: "120px" }, { key: "remarks", label: "Remarks" }, { key: "revision", label: "Rev", width: "60px" },
         { key: "approvedBy", label: "Approved By" }, { key: "date", label: "Date", width: "120px" }],
        (row, key) => {
          if (key === "status") return (
            <Select defaultValue={row.status}><SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="delayed">Delayed</SelectItem></SelectContent>
            </Select>
          );
          if (key === "revision") return <span className="text-xs text-center">{row.revision}</span>;
          if (key === "date") return <Input type="date" className="h-7 text-xs" />;
          return <Input className="h-7 text-xs" defaultValue={(row as any)[key]} placeholder={key} />;
        },
        () => ({ id: String(Date.now()), activity: "", description: "", responsibility: "", status: "not-started" as Status, remarks: "", revision: 0, approvedBy: "", date: "" }),
      )}
    </div>
  );

  const renderBOMTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("BOM/Purchase")}
      {renderEditableTable(
        bomRows, setBomRows, bomSearch, setBomSearch,
        [{ key: "itemCode", label: "Item Code" }, { key: "description", label: "Description" }, { key: "material", label: "Material" },
         { key: "quantity", label: "Qty" }, { key: "vendor", label: "Vendor" }, { key: "poNumber", label: "PO Number" },
         { key: "status", label: "Status", width: "120px" }, { key: "remarks", label: "Remarks" }],
        (row, key) => {
          if (key === "status") return (
            <Select defaultValue={row.status}><SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="delayed">Delayed</SelectItem></SelectContent>
            </Select>
          );
          return <Input className="h-7 text-xs" defaultValue={(row as any)[key]} placeholder={key} />;
        },
        () => ({ id: String(Date.now()), itemCode: "", description: "", material: "", quantity: "", vendor: "", poNumber: "", status: "not-started" as Status, remarks: "" }),
      )}
    </div>
  );

  const renderProductionTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Production")}
      {renderEditableTable(
        prodRows, setProdRows, prodSearch, setProdSearch,
        [{ key: "task", label: "Task" }, { key: "plannedDate", label: "Planned Date" }, { key: "startDate", label: "Start Date" },
         { key: "completionDate", label: "Completion Date" }, { key: "status", label: "Status", width: "120px" },
         { key: "delayIndicator", label: "Delay", width: "60px" }, { key: "remarks", label: "Remarks" }],
        (row, key) => {
          if (key === "status") return (
            <Select defaultValue={row.status}><SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="delayed">Delayed</SelectItem></SelectContent>
            </Select>
          );
          if (key === "delayIndicator") return row.delayIndicator ? <AlertTriangle className="w-4 h-4 text-destructive mx-auto" /> : <span className="text-xs text-muted-foreground">—</span>;
          if (key === "task") return <span className="text-xs font-medium">{row.task}</span>;
          if (key.includes("Date")) return <Input type="date" className="h-7 text-xs" defaultValue={(row as any)[key]} />;
          return <Input className="h-7 text-xs" defaultValue={(row as any)[key]} placeholder={key} />;
        },
        () => ({ id: String(Date.now()), task: "", plannedDate: "", startDate: "", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "" }),
      )}
    </div>
  );

  const renderFinishingTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Finishing")}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead><TableHead className="w-28">Status</TableHead><TableHead>Remarks</TableHead><TableHead className="w-20">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {["Spares", "Painting", "Name Plate", "Sandblasting", "Packing"].map((task) => (
              <TableRow key={task}>
                <TableCell className="font-medium text-xs">{task}</TableCell>
                <TableCell>
                  <Select defaultValue="not-started"><SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input className="h-7 text-xs" placeholder="Remarks..." /></TableCell>
                <TableCell><Progress value={0} className="h-1.5" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderDispatchTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Dispatch")}
      <div className="rounded-md border p-4">
        <h4 className="text-sm font-semibold mb-3">Dispatch Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Dispatch Date", "Transporter Name", "LR Number", "Vehicle Number", "Tracking Reference", "Delivery Confirmation"].map((label) => (
            <div key={label} className="space-y-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Input className="h-8 text-xs" placeholder="Enter..." />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Proof of Delivery</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Upload POD document</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-5">
      {/* SECTION 1: Project Info */}
      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Project Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { l: "Job ID", v: projectData.jobId }, { l: "Tag ID", v: projectData.tagId },
            { l: "Customer", v: projectData.customerName }, { l: "Priority", v: projectData.priority },
            { l: "Delivery Date", v: projectData.deliveryDate },
            { l: "Overall Status", v: `${statusLabels[projectData.overall]} (${projectData.overallProgress}%)` },
            { l: "Category", v: projectData.category }, { l: "Type", v: projectData.projectType },
            { l: "ERPNext PO", v: projectData.erpPORef }, { l: "PO Date", v: projectData.poDate },
            { l: "Project Value", v: projectData.projectValue }, { l: "Tender", v: projectData.tenderName },
          ].map((item) => (
            <div key={item.l}><p className="text-muted-foreground text-xs mb-0.5">{item.l}</p><p className="font-medium text-foreground text-xs">{item.v}</p></div>
          ))}
        </div>
      </div>

      {/* Department task dates */}
      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Department Task Schedule</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead>
                <TableHead>Planned Date</TableHead><TableHead>Start Date</TableHead><TableHead>Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(deptStatuses).map(([dept, data]) => (
                <TableRow key={dept}>
                  <TableCell className="font-medium text-xs">{dept}</TableCell>
                  <TableCell><StatusBadge status={data.current}>{statusLabels[data.current]}</StatusBadge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={data.progress} className="h-1.5 w-16" />
                      <span className="text-xs text-muted-foreground">{data.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{data.plannedDate}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{data.startDate || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{data.completionDate || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const getTabContent = (tab: string) => {
    if (tab === "Overview") return renderOverview();
    if (tab === "QAP") return renderQAPTab();
    if (tab === "BOM/Purchase") return renderBOMTab();
    if (tab === "Production") return renderProductionTab();
    if (tab === "Dispatch") return renderDispatchTab();
    if (tab === "Finishing") return renderFinishingTab();
    return renderDeptTab(tab);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/projects")} className="p-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{projectData.title}</h1>
            <StatusBadge status={projectData.overall}>In Progress</StatusBadge>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{projectData.overallProgress}%</span>
          </div>
          <p className="text-sm text-muted-foreground">{projectData.tagId} · {projectData.jobId} · {projectData.customerName}</p>
        </div>
      </div>

      {/* SECTION 1: Overview info + Stage Progress */}
      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Stage Progress</h3>
          <span className="text-xs text-muted-foreground">{projectData.overallProgress}% Overall</span>
        </div>
        <div className="flex items-center gap-1">
          {deptTabs.slice(1).map((tab) => {
            const dept = deptStatuses[tab];
            const progress = dept?.progress || 0;
            const status = dept?.current || "not-started";
            const colors: Record<string, string> = {
              completed: "bg-status-completed", "in-progress": "bg-status-in-progress",
              pending: "bg-status-pending", delayed: "bg-status-delayed", "not-started": "bg-muted",
            };
            return (
              <div key={tab} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${colors[status]}`} style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground truncate max-w-full">{tab}</span>
                <span className="text-[9px] font-medium text-muted-foreground">{progress}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Documents + Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Documents */}
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><FileText className="w-4 h-4" /> Documents</h3>
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border rounded cursor-pointer hover:bg-muted">
              <Upload className="w-3 h-3" /> Upload
            </label>
          </div>
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{doc.size} · {doc.uploadedBy} · {doc.date}</p>
                  </div>
                </div>
                <button className="text-xs text-primary hover:underline">Download</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-primary hover:underline">Export Merged PDF (Simulated)</button>
        </div>

        {/* Gallery */}
        <div className="rounded-md border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Image className="w-4 h-4" /> Gallery</h3>
            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border rounded cursor-pointer hover:bg-muted">
              <Upload className="w-3 h-3" /> Upload Images
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((img) => (
              <div key={img.id} onClick={() => setEnlargedImage(img.url)} className="relative group cursor-pointer rounded-md overflow-hidden border aspect-square bg-muted">
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <p className="text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enlarged image modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setEnlargedImage(null)}>
          <button className="absolute top-4 right-4 text-white"><X className="w-6 h-6" /></button>
          <img src={enlargedImage} alt="Enlarged" className="max-w-[80vw] max-h-[80vh] rounded-lg" />
        </div>
      )}

      {/* SECTION 3: Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 border-b rounded-none pb-2">
          {deptTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-3 py-1.5">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {deptTabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">{getTabContent(tab)}</TabsContent>
        ))}
      </Tabs>

      {/* Activity Timeline - Bottom */}
      <div className="rounded-md border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Activity Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityLog.map((activity, i) => (
            <div key={i} className="flex gap-3 text-sm p-3 rounded-md hover:bg-muted/50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground text-xs"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time} · {activity.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
