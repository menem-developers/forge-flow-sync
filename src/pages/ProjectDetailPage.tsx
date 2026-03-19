import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Clock, User, AlertTriangle } from "lucide-react";
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
};

type Status = "completed" | "pending" | "delayed" | "not-started" | "in-progress";

interface StatusHistory {
  status: Status; updatedBy: string; updatedDate: string; remarks: string;
  revisionNumber: number; delayReason?: string; createdBy: string; createdDate: string;
  lastModifiedBy: string; lastModifiedDate: string; versionNumber: number;
}

const deptTabs = [
  "Overview", "Tender", "Design", "Drawing", "QAP", "BOM Validation",
  "Purchase", "Production", "Finishing", "Dispatch",
];

const deptStatuses: Record<string, { current: Status; progress: number; history: StatusHistory[] }> = {
  Tender: {
    current: "completed", progress: 100,
    history: [
      { status: "completed", updatedBy: "Amit Patel", updatedDate: "2026-01-15", remarks: "Quotation accepted", revisionNumber: 2, createdBy: "Admin", createdDate: "2026-01-05", lastModifiedBy: "Amit Patel", lastModifiedDate: "2026-01-15", versionNumber: 3 },
      { status: "in-progress", updatedBy: "Amit Patel", updatedDate: "2026-01-10", remarks: "Negotiation in progress", revisionNumber: 1, createdBy: "Admin", createdDate: "2026-01-05", lastModifiedBy: "Amit Patel", lastModifiedDate: "2026-01-10", versionNumber: 2 },
    ],
  },
  Design: { current: "in-progress", progress: 60, history: [
    { status: "in-progress", updatedBy: "Priya Sharma", updatedDate: "2026-02-15", remarks: "Design phase started", revisionNumber: 1, createdBy: "Admin", createdDate: "2026-01-16", lastModifiedBy: "Priya Sharma", lastModifiedDate: "2026-02-15", versionNumber: 2 },
  ] },
  Drawing: { current: "pending", progress: 10, history: [] },
  QAP: { current: "not-started", progress: 0, history: [] },
  "BOM Validation": { current: "not-started", progress: 0, history: [] },
  Purchase: { current: "not-started", progress: 0, history: [] },
  Production: { current: "not-started", progress: 0, history: [] },
  Finishing: { current: "not-started", progress: 0, history: [] },
  Dispatch: { current: "not-started", progress: 0, history: [] },
};

const qapItems = [
  { id: "QAP-001", activity: "Material Test Certificate Review", status: "not-started" as Status, remarks: "", revision: 0 },
  { id: "QAP-002", activity: "Dimensional Inspection Plan", status: "not-started" as Status, remarks: "", revision: 0 },
  { id: "QAP-003", activity: "Welding Procedure Qualification", status: "not-started" as Status, remarks: "", revision: 0 },
  { id: "QAP-004", activity: "Hydro Test Procedure", status: "not-started" as Status, remarks: "", revision: 0 },
  { id: "QAP-005", activity: "Final Inspection & Certification", status: "not-started" as Status, remarks: "", revision: 0 },
];

const bomItems = [
  { id: "BOM-001", item: "SA 516 Gr.70 Shell Plate", qty: "2 Nos", status: "not-started" as Status, remarks: "" },
  { id: "BOM-002", item: "SA 182 F304 Tube Sheet", qty: "2 Nos", status: "not-started" as Status, remarks: "" },
  { id: "BOM-003", item: "SA 179 Tubes (25.4 OD)", qty: "450 Nos", status: "not-started" as Status, remarks: "" },
  { id: "BOM-004", item: "SA 105 Flanges (150#)", qty: "8 Nos", status: "not-started" as Status, remarks: "" },
  { id: "BOM-005", item: "Gaskets - Spiral Wound", qty: "12 Nos", status: "not-started" as Status, remarks: "" },
];

const productionTasks = [
  { taskId: "TSK-001", name: "Cutting", startDate: "2026-03-01", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
  { taskId: "TSK-002", name: "Machining", startDate: "2026-03-05", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
  { taskId: "TSK-003", name: "Assembly", startDate: "2026-03-10", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
  { taskId: "TSK-004", name: "Welding", startDate: "2026-03-15", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
  { taskId: "TSK-005", name: "Inspection", startDate: "2026-03-20", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
  { taskId: "TSK-006", name: "Testing", startDate: "2026-03-25", completionDate: "", status: "not-started" as Status, progress: 0, delayIndicator: false, remarks: "" },
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

  const renderStatusHeader = (dept: string) => {
    const data = deptStatuses[dept];
    if (!data) return null;
    return (
      <div className="rounded-md border p-4 space-y-4">
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
            <label className="text-sm font-medium">Update Status:</label>
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
          <Textarea placeholder="Add remarks..." rows={1} className="flex-1 min-w-[200px] h-8 py-1.5" />
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90 transition-opacity">Update</button>
          <div className="border-l pl-3 ml-auto">
            <label className="text-xs text-muted-foreground cursor-pointer hover:text-primary flex items-center gap-1">
              <Upload className="w-3 h-3" /> Upload Doc
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderAuditInfo = (dept: string) => {
    const data = deptStatuses[dept];
    if (!data) return null;
    return (
      <div className="rounded-md border p-3 bg-muted/30">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Audit</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div><span className="text-muted-foreground">Created By:</span> <span className="font-medium">Admin</span></div>
          <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">2026-01-05</span></div>
          <div><span className="text-muted-foreground">Modified By:</span> <span className="font-medium">{data.history[0]?.lastModifiedBy || "—"}</span></div>
          <div><span className="text-muted-foreground">Modified:</span> <span className="font-medium">{data.history[0]?.lastModifiedDate || "—"}</span></div>
          <div><span className="text-muted-foreground">Version:</span> <span className="font-medium">{data.history[0]?.versionNumber || 1}</span></div>
        </div>
      </div>
    );
  };

  const renderHistoryTable = (dept: string) => {
    const data = deptStatuses[dept];
    if (!data || data.history.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Status History</h4>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead><TableHead>Updated By</TableHead><TableHead>Date</TableHead>
                <TableHead>Rev</TableHead><TableHead>Remarks</TableHead><TableHead>Delay Reason</TableHead>
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
    );
  };

  const renderDeptTab = (dept: string) => (
    <div className="space-y-4">
      {renderStatusHeader(dept)}
      {renderAuditInfo(dept)}
      {renderHistoryTable(dept)}
    </div>
  );

  const renderQAPTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("QAP")}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead><TableHead>Activity</TableHead>
              <TableHead className="w-28">Status</TableHead><TableHead>Remarks</TableHead><TableHead className="w-16">Rev</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qapItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                <TableCell className="font-medium">{item.activity}</TableCell>
                <TableCell>
                  <Select defaultValue={item.status}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input className="h-7 text-xs" placeholder="Add remarks..." /></TableCell>
                <TableCell className="text-center text-xs">{item.revision}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderAuditInfo("QAP")}
    </div>
  );

  const renderBOMTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("BOM Validation")}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead><TableHead>Item Description</TableHead>
              <TableHead className="w-24">Quantity</TableHead><TableHead className="w-28">Status</TableHead><TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bomItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                <TableCell className="font-medium">{item.item}</TableCell>
                <TableCell className="text-muted-foreground">{item.qty}</TableCell>
                <TableCell>
                  <Select defaultValue={item.status}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Verified</SelectItem>
                      <SelectItem value="delayed">Query Raised</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input className="h-7 text-xs" placeholder="Add remarks..." /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderAuditInfo("BOM Validation")}
    </div>
  );

  const renderProductionTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Production")}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Task ID</TableHead><TableHead>Task</TableHead>
              <TableHead>Start Date</TableHead><TableHead>End Date</TableHead>
              <TableHead className="w-28">Status</TableHead><TableHead className="w-20">Progress</TableHead>
              <TableHead>Remarks</TableHead><TableHead className="w-14">Delay</TableHead>
              <TableHead className="w-16">Docs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionTasks.map((t) => (
              <TableRow key={t.taskId}>
                <TableCell className="font-mono text-xs">{t.taskId}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{t.startDate}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{t.completionDate || "—"}</TableCell>
                <TableCell>
                  <Select defaultValue={t.status}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Progress value={t.progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{t.progress}%</span>
                  </div>
                </TableCell>
                <TableCell><Input className="h-7 text-xs" placeholder="Remarks..." /></TableCell>
                <TableCell className="text-center">{t.delayIndicator ? <AlertTriangle className="w-4 h-4 text-destructive" /> : "—"}</TableCell>
                <TableCell><button className="text-primary text-xs hover:underline">Upload</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderAuditInfo("Production")}
    </div>
  );

  const renderDispatchTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Dispatch")}
      <div className="rounded-md border p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Dispatch Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Dispatch Date", value: dispatchData.dispatchDate || "Not scheduled" },
            { label: "Transporter", value: dispatchData.transporterName || "—" },
            { label: "LR Number", value: dispatchData.lrNumber || "—" },
            { label: "Vehicle No.", value: dispatchData.vehicleNumber || "—" },
            { label: "Tracking Ref", value: dispatchData.trackingReference || "—" },
            { label: "Delivery Confirmation", value: dispatchData.deliveryConfirmationDate || "—" },
          ].map((item) => (
            <div key={item.label} className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">{item.label}</p>
              <p className="font-medium">{item.value}</p>
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
      {renderAuditInfo("Dispatch")}
    </div>
  );

  const renderFinishingTab = () => (
    <div className="space-y-4">
      {renderStatusHeader("Finishing")}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead><TableHead className="w-28">Status</TableHead>
              <TableHead>Remarks</TableHead><TableHead className="w-20">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {["Spares", "Painting", "Name Plate", "Sandblasting", "Packing"].map((task) => (
              <TableRow key={task}>
                <TableCell className="font-medium">{task}</TableCell>
                <TableCell>
                  <Select defaultValue="not-started">
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input className="h-7 text-xs" placeholder="Remarks..." /></TableCell>
                <TableCell><Progress value={0} className="h-1.5" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderAuditInfo("Finishing")}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Project Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { l: "Project ID", v: projectData.projectId },
            { l: "Job ID", v: projectData.jobId },
            { l: "Tag ID", v: projectData.tagId },
            { l: "Customer", v: projectData.customerName },
            { l: "Tender Name", v: projectData.tenderName },
            { l: "Priority", v: projectData.priority },
            { l: "Delivery Date", v: projectData.deliveryDate },
            { l: "Overall Progress", v: `${projectData.overallProgress}%` },
          ].map((item) => (
            <div key={item.l}>
              <p className="text-muted-foreground text-xs mb-0.5">{item.l}</p>
              <p className="font-medium text-foreground">{item.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Department Status Summary</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead><TableHead>Status</TableHead>
                <TableHead>Progress</TableHead><TableHead>Updated By</TableHead>
                <TableHead>Date</TableHead><TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(deptStatuses).map(([dept, data]) => (
                <TableRow key={dept}>
                  <TableCell className="font-medium">{dept}</TableCell>
                  <TableCell><StatusBadge status={data.current}>{statusLabels[data.current]}</StatusBadge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={data.progress} className="h-1.5 w-16" />
                      <span className="text-xs text-muted-foreground">{data.progress}%</span>
                    </div>
                  </TableCell>
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
    if (tab === "QAP") return renderQAPTab();
    if (tab === "BOM Validation") return renderBOMTab();
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
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{projectData.overallProgress}% Complete</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {projectData.tagId} · {projectData.jobId} · {projectData.customerName} · {projectData.tenderName}
          </p>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="rounded-md border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Stage Progress</h3>
          <span className="text-xs text-muted-foreground">{projectData.overallProgress}% Overall</span>
        </div>
        <div className="flex items-center gap-1">
          {deptTabs.slice(1).map((tab) => {
            const dept = deptStatuses[tab];
            const status = dept?.current || "not-started";
            const progress = dept?.progress || 0;
            const colors: Record<string, string> = {
              completed: "bg-status-completed", "in-progress": "bg-status-in-progress",
              pending: "bg-status-pending", delayed: "bg-status-delayed", "not-started": "bg-muted",
            };
            return (
              <div key={tab} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-2.5 rounded-full bg-muted overflow-hidden`}>
                  <div className={`h-full rounded-full transition-all ${colors[status]}`} style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground truncate max-w-full">{tab}</span>
                <span className="text-[9px] font-medium text-muted-foreground">{progress}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs - Full width, no sidebar */}
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

      {/* Activity Timeline - Bottom */}
      <div className="rounded-md border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Activity Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityLog.map((activity, i) => (
            <div key={i} className="flex gap-3 text-sm p-3 rounded-md hover:bg-muted/50 transition-colors">
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
  );
}
