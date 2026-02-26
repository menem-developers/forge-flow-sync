import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Clock, User, FileText, AlertTriangle, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const projectData = {
  projectId: "PRJ-2024-001",
  jobId: "JOB-2024-001",
  tagId: "HE-101",
  title: "Shell & Tube Heat Exchanger",
  customerName: "Reliance Industries",
  tenderName: "Reliance Jamnagar Refinery HE Supply",
  priority: "High",
  deliveryDate: "15 Apr 2026",
  projectValue: "₹45,00,000",
  advanceReceived: "₹13,50,000",
  overall: "in-progress" as const,
};

type Status = "completed" | "pending" | "delayed" | "not-started" | "in-progress";

interface StatusHistory {
  status: Status;
  updatedBy: string;
  updatedDate: string;
  remarks: string;
  revisionNumber: number;
  delayReason?: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  versionNumber: number;
}

const deptTabs = [
  "Overview", "Tender", "Design", "Drawing", "QAP", "BOM Validation",
  "Purchase", "Production", "Finishing", "Dispatch", "Finance",
];

const deptStatuses: Record<string, { current: Status; history: StatusHistory[] }> = {
  Tender: {
    current: "completed",
    history: [
      { status: "completed", updatedBy: "Amit Patel", updatedDate: "2026-01-15", remarks: "Quotation accepted", revisionNumber: 2, createdBy: "Admin", createdDate: "2026-01-05", lastModifiedBy: "Amit Patel", lastModifiedDate: "2026-01-15", versionNumber: 3 },
      { status: "in-progress", updatedBy: "Amit Patel", updatedDate: "2026-01-10", remarks: "Negotiation in progress", revisionNumber: 1, createdBy: "Admin", createdDate: "2026-01-05", lastModifiedBy: "Amit Patel", lastModifiedDate: "2026-01-10", versionNumber: 2 },
      { status: "not-started", updatedBy: "Admin", updatedDate: "2026-01-05", remarks: "Project created", revisionNumber: 0, createdBy: "Admin", createdDate: "2026-01-05", lastModifiedBy: "Admin", lastModifiedDate: "2026-01-05", versionNumber: 1 },
    ],
  },
  Design: {
    current: "in-progress",
    history: [
      { status: "in-progress", updatedBy: "Priya Sharma", updatedDate: "2026-02-15", remarks: "Design phase started", revisionNumber: 1, createdBy: "Admin", createdDate: "2026-01-16", lastModifiedBy: "Priya Sharma", lastModifiedDate: "2026-02-15", versionNumber: 2 },
    ],
  },
  Drawing: { current: "pending", history: [] },
  QAP: { current: "not-started", history: [] },
  "BOM Validation": { current: "not-started", history: [] },
  Purchase: { current: "not-started", history: [] },
  Production: { current: "not-started", history: [] },
  Finishing: { current: "not-started", history: [] },
  Dispatch: { current: "not-started", history: [] },
  Finance: { current: "in-progress", history: [
    { status: "in-progress", updatedBy: "Sanjay Mehta", updatedDate: "2026-01-20", remarks: "Advance payment received", revisionNumber: 1, createdBy: "Admin", createdDate: "2026-01-15", lastModifiedBy: "Sanjay Mehta", lastModifiedDate: "2026-01-20", versionNumber: 2 },
  ] },
};

const productionTasks = [
  { taskId: "TSK-001", name: "Cutting", startDate: "2026-03-01", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
  { taskId: "TSK-002", name: "Machining", startDate: "2026-03-05", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
  { taskId: "TSK-003", name: "Assembly", startDate: "2026-03-10", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
  { taskId: "TSK-004", name: "Welding", startDate: "2026-03-15", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
  { taskId: "TSK-005", name: "Inspection", startDate: "2026-03-20", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
  { taskId: "TSK-006", name: "Testing", startDate: "2026-03-25", completionDate: "", status: "not-started" as Status, delayIndicator: false, remarks: "", documents: [] },
];

const dispatchData = {
  dispatchDate: "", transporterName: "", lrNumber: "", vehicleNumber: "",
  trackingReference: "", deliveryConfirmationDate: "", podDocument: null,
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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const renderDeptTab = (dept: string) => {
    const data = deptStatuses[dept];
    if (!data) return <p className="text-sm text-muted-foreground">No data available for {dept}</p>;

    return (
      <div className="space-y-6">
        {/* Current Status & Comments */}
        <div className="rounded-md border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{dept} - Current Status</h3>
            <StatusBadge status={data.current}>{statusLabels[data.current]}</StatusBadge>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Update Status:</label>
            <select className="h-8 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Delayed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Remarks / Comments</label>
            <Textarea placeholder="Add remarks or comments..." rows={2} />
          </div>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            Update Status
          </button>
        </div>

        {/* Audit info */}
        <div className="rounded-md border p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Audit Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><span className="text-muted-foreground">Created By:</span> <span className="font-medium">Admin</span></div>
            <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">2026-01-05</span></div>
            <div><span className="text-muted-foreground">Version:</span> <span className="font-medium">{data.history.length > 0 ? data.history[0].versionNumber : 1}</span></div>
            <div><span className="text-muted-foreground">Last Modified By:</span> <span className="font-medium">{data.history.length > 0 ? data.history[0].lastModifiedBy : "—"}</span></div>
            <div><span className="text-muted-foreground">Last Modified:</span> <span className="font-medium">{data.history.length > 0 ? data.history[0].lastModifiedDate : "—"}</span></div>
          </div>
        </div>

        {/* Status History */}
        {data.history.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Status History</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Revision</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Delay Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.history.map((h, i) => (
                    <TableRow key={i}>
                      <TableCell><StatusBadge status={h.status}>{statusLabels[h.status]}</StatusBadge></TableCell>
                      <TableCell>{h.updatedBy}</TableCell>
                      <TableCell className="text-muted-foreground">{h.updatedDate}</TableCell>
                      <TableCell>v{h.revisionNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{h.remarks || "—"}</TableCell>
                      <TableCell>{h.delayReason ? <span className="text-destructive">{h.delayReason}</span> : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Document upload */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Documents (Optional)</h4>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop files or <span className="text-primary font-medium cursor-pointer">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DWG, XLS up to 25MB</p>
          </div>
        </div>
      </div>
    );
  };

  const renderProductionTab = () => (
    <div className="space-y-6">
      {renderDeptTab("Production")}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Production Tasks</h4>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delay</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionTasks.map((t) => (
                <TableRow key={t.taskId}>
                  <TableCell className="font-mono text-xs">{t.taskId}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.startDate}</TableCell>
                  <TableCell className="text-muted-foreground">{t.completionDate || "—"}</TableCell>
                  <TableCell><StatusBadge status={t.status}>{statusLabels[t.status]}</StatusBadge></TableCell>
                  <TableCell>{t.delayIndicator ? <AlertTriangle className="w-4 h-4 text-destructive" /> : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.remarks || "—"}</TableCell>
                  <TableCell>
                    <button className="text-primary text-xs hover:underline">Upload</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const renderDispatchTab = () => (
    <div className="space-y-6">
      {renderDeptTab("Dispatch")}
      <div className="rounded-md border p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Dispatch Information</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Dispatch Date", value: dispatchData.dispatchDate || "Not scheduled" },
            { label: "Transporter Name", value: dispatchData.transporterName || "—" },
            { label: "LR Number", value: dispatchData.lrNumber || "—" },
            { label: "Vehicle Number", value: dispatchData.vehicleNumber || "—" },
            { label: "Tracking Reference", value: dispatchData.trackingReference || "—" },
            { label: "Delivery Confirmation", value: dispatchData.deliveryConfirmationDate || "—" },
          ].map((item) => (
            <div key={item.label} className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Proof of Delivery Document</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Upload POD document</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinishingTab = () => (
    <div className="space-y-6">
      {renderDeptTab("Finishing")}
      <div className="rounded-md border p-5">
        <h4 className="text-sm font-semibold text-foreground mb-4">Finishing Tasks</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Spares", "Painting", "Name Plate", "Sandblasting", "Packing"].map((task) => (
            <div key={task} className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm font-medium">{task}</span>
              <StatusBadge status="not-started">Not Started</StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="rounded-md border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Project Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {[
            { l: "Project ID", v: projectData.projectId },
            { l: "Job ID", v: projectData.jobId },
            { l: "Tag ID", v: projectData.tagId },
            { l: "Project Title", v: projectData.title },
            { l: "Customer", v: projectData.customerName },
            { l: "Tender Name", v: projectData.tenderName },
            { l: "Priority", v: projectData.priority },
            { l: "Delivery Date", v: projectData.deliveryDate },
            { l: "Project Value", v: projectData.projectValue },
            { l: "Advance Received", v: projectData.advanceReceived },
          ].map((item) => (
            <div key={item.l}>
              <p className="text-muted-foreground text-xs mb-0.5">{item.l}</p>
              <p className="font-medium text-foreground">{item.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Status Overview */}
      <div className="rounded-md border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Department Status Summary</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead>Updated Date</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(deptStatuses).map(([dept, data]) => (
                <TableRow key={dept}>
                  <TableCell className="font-medium">{dept}</TableCell>
                  <TableCell><StatusBadge status={data.current}>{statusLabels[data.current]}</StatusBadge></TableCell>
                  <TableCell className="text-muted-foreground">{data.history[0]?.updatedBy || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{data.history[0]?.updatedDate || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{data.history[0]?.remarks || "—"}</TableCell>
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
    if (tab === "Production") return renderProductionTab();
    if (tab === "Dispatch") return renderDispatchTab();
    if (tab === "Finishing") return renderFinishingTab();
    return renderDeptTab(tab);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back & header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/projects")} className="p-2 rounded-md hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{projectData.title}</h1>
            <StatusBadge status={projectData.overall}>In Progress</StatusBadge>
          </div>
          <p className="text-sm text-muted-foreground">
            {projectData.tagId} · {projectData.jobId} · {projectData.customerName} · {projectData.tenderName}
          </p>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="rounded-md border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Stage Progress</h3>
        <div className="flex items-center gap-1">
          {deptTabs.slice(1).map((tab) => {
            const dept = deptStatuses[tab];
            const status = dept?.current || "not-started";
            const colors: Record<string, string> = {
              completed: "bg-status-completed",
              "in-progress": "bg-status-in-progress",
              pending: "bg-status-pending",
              delayed: "bg-status-delayed",
              "not-started": "bg-muted",
            };
            return (
              <div key={tab} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full h-2 rounded-full ${colors[status]}`} />
                <span className="text-[10px] text-muted-foreground truncate max-w-full">{tab}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 border-b rounded-none pb-2">
              {deptTabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-3 py-1.5"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            {deptTabs.map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {getTabContent(tab)}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Activity sidebar */}
        <div className="rounded-md border p-5 h-fit">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Timeline
          </h3>
          <div className="space-y-4">
            {activityLog.map((activity, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.time} · {activity.dept}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
