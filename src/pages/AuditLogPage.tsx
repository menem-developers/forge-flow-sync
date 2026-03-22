import { useState } from "react";
import { Search } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AuditEntry {
  id: string;
  userName: string;
  feature: string;
  action: string;
  tagId: string;
  newValue: string;
  timestamp: string;
}

const auditData: AuditEntry[] = [
  { id: "AUD-001", userName: "priya.sharma", feature: "Design", action: "Status Updated", tagId: "HE-101", newValue: "In Progress", timestamp: "2026-03-22 14:30:22" },
  { id: "AUD-002", userName: "sanjay.mehta", feature: "Finance", action: "Advance Recorded", tagId: "HE-101", newValue: "₹13,50,000", timestamp: "2026-03-22 10:15:45" },
  { id: "AUD-003", userName: "amit.patel", feature: "Purchase", action: "Status Updated", tagId: "TE-201", newValue: "Delayed", timestamp: "2026-03-21 09:30:10" },
  { id: "AUD-004", userName: "deepak.singh", feature: "Production", action: "Task Started", tagId: "HE-102", newValue: "Cutting - In Progress", timestamp: "2026-03-21 08:00:00" },
  { id: "AUD-005", userName: "rajesh.kumar", feature: "Project", action: "Project Created", tagId: "TE-205", newValue: "PRJ-2024-008", timestamp: "2026-03-20 09:00:00" },
  { id: "AUD-006", userName: "vikram.rao", feature: "BOM", action: "Approved", tagId: "HE-102", newValue: "Completed", timestamp: "2026-03-19 15:30:00" },
  { id: "AUD-007", userName: "rajesh.kumar", feature: "User Master", action: "User Created", tagId: "—", newValue: "Neha Gupta", timestamp: "2026-03-18 11:20:00" },
  { id: "AUD-008", userName: "priya.sharma", feature: "Design", action: "Status Updated", tagId: "TE-203", newValue: "Delayed", timestamp: "2026-03-17 13:10:55" },
  { id: "AUD-009", userName: "logistics.team", feature: "Dispatch", action: "Dispatched", tagId: "HE-104", newValue: "LR-2026-0089", timestamp: "2026-03-16 16:00:00" },
  { id: "AUD-010", userName: "sanjay.mehta", feature: "Finance", action: "Invoice Generated", tagId: "HE-104", newValue: "INV-2026-0045", timestamp: "2026-03-15 10:00:00" },
  { id: "AUD-011", userName: "amit.patel", feature: "Tender", action: "Lead Converted", tagId: "HE-105", newValue: "PRJ-2024-009", timestamp: "2026-03-14 14:00:00" },
  { id: "AUD-012", userName: "deepak.singh", feature: "Employee Activity", action: "Work Plan Added", tagId: "HE-102", newValue: "Shell welding", timestamp: "2026-03-13 07:30:00" },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [featureFilter, setFeatureFilter] = useState("All");

  const filtered = auditData.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.tagId.toLowerCase().includes(search.toLowerCase());
    const matchesFeature = featureFilter === "All" || a.feature === featureFilter;
    return matchesSearch && matchesFeature;
  });

  const columns = [
    { key: "userName", header: "Username", render: (a: AuditEntry) => <span className="text-sm font-medium font-mono">{a.userName}</span> },
    { key: "feature", header: "Feature", render: (a: AuditEntry) => (
      <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{a.feature}</span>
    )},
    { key: "action", header: "Action", render: (a: AuditEntry) => <span className="text-sm">{a.action}</span> },
    { key: "tagId", header: "Tag ID", render: (a: AuditEntry) => <span className="text-xs font-mono text-primary">{a.tagId}</span> },
    { key: "newValue", header: "New Value", render: (a: AuditEntry) => <span className="text-xs font-medium">{a.newValue}</span> },
    { key: "timestamp", header: "Timestamp", render: (a: AuditEntry) => <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{a.timestamp}</span> },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Track all user activities and system changes</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by username, action, or Tag ID..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </div>
        <Select value={featureFilter} onValueChange={setFeatureFilter}>
          <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="All Features" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Features</SelectItem>
            {["Project", "Design", "Finance", "Purchase", "Production", "Tender", "Dispatch", "BOM", "User Master", "Employee Activity"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(a) => a.id} pageSize={10} showExport={false} />
    </div>
  );
}
