import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MessageSquare, Clock, User } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const tabs = [
  "Overview",
  "Tender",
  "Design",
  "Drawing",
  "QAP",
  "BOM Validation",
  "Purchase",
  "Production",
  "Finishing",
  "Dispatch",
  "Finance",
];

const activityLog = [
  { user: "Rajesh Kumar", action: "Updated Production status to In Progress", time: "2 hours ago", dept: "Production" },
  { user: "Priya Sharma", action: "Uploaded revised drawing v3", time: "5 hours ago", dept: "Design" },
  { user: "Amit Patel", action: "Raised PO for SS316 plates", time: "1 day ago", dept: "Purchase" },
  { user: "Deepak Singh", action: "Approved QAP document", time: "2 days ago", dept: "QAP" },
  { user: "Admin", action: "Created project JOB-2024-001", time: "1 week ago", dept: "System" },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back & header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/projects")}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{id || "JOB-2024-001"}</h1>
            <StatusBadge status="in-progress">In Progress</StatusBadge>
          </div>
          <p className="text-sm text-muted-foreground">HE-101 · Reliance Industries · Shell & Tube Heat Exchanger</p>
        </div>
      </div>

      {/* Project summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Project Value", value: "₹45,00,000" },
          { label: "Advance Received", value: "₹13,50,000" },
          { label: "Delivery Date", value: "15 Apr 2026" },
          { label: "Priority", value: "High" },
        ].map((item) => (
          <div key={item.label} className="kpi-card">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className="text-lg font-bold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Stage Progress</h3>
        <div className="flex items-center gap-1">
          {tabs.slice(0, -1).map((tab, i) => {
            const statuses = ["completed", "completed", "in-progress", "pending", "not-started", "not-started", "not-started", "not-started", "not-started", "not-started"];
            const status = statuses[i] || "not-started";
            const colors: Record<string, string> = {
              completed: "bg-status-completed",
              "in-progress": "bg-status-in-progress",
              pending: "bg-status-pending",
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
      <div className="border-b">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status section */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{activeTab} Details</h3>

            {activeTab === "Overview" ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { l: "Job ID", v: id || "JOB-2024-001" },
                  { l: "Tag ID", v: "HE-101" },
                  { l: "Customer", v: "Reliance Industries" },
                  { l: "Equipment Type", v: "Shell & Tube Heat Exchanger" },
                  { l: "ERPNext PO Ref", v: "PO-2024-0456" },
                  { l: "Created Date", v: "15 Jan 2026" },
                  { l: "Delivery Date", v: "15 Apr 2026" },
                  { l: "Priority", v: "High" },
                ].map((item) => (
                  <div key={item.l}>
                    <p className="text-muted-foreground text-xs mb-0.5">{item.l}</p>
                    <p className="font-medium text-foreground">{item.v}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground">Status:</label>
                  <select className="h-8 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Delayed</option>
                  </select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Update the status of the {activeTab} stage. Changes are logged in the activity timeline.
                </p>
              </div>
            )}
          </div>

          {/* Document upload */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Documents</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or{" "}
                <span className="text-primary font-medium cursor-pointer">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DWG, XLS up to 25MB</p>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Comments</h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary-foreground">AD</span>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full h-20 px-3 py-2 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity sidebar */}
        <div className="bg-card rounded-lg border p-5 h-fit">
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
