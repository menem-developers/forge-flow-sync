import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AuditEntry {
  id: string;
  userName: string;
  role: string;
  project: string;
  action: string;
  previousValue: string;
  updatedValue: string;
  timestamp: string;
  department: string;
}

const auditData: AuditEntry[] = [
  { id: "AUD-001", userName: "Priya Sharma", role: "Design", project: "PRJ-2024-001", action: "Updated Design Status", previousValue: "Not Started", updatedValue: "In Progress", timestamp: "2026-02-15 14:30:22", department: "Design" },
  { id: "AUD-002", userName: "Sanjay Mehta", role: "Finance", project: "PRJ-2024-001", action: "Updated Finance Status", previousValue: "Not Started", updatedValue: "In Progress", timestamp: "2026-01-20 10:15:45", department: "Finance" },
  { id: "AUD-003", userName: "Amit Patel", role: "Purchase", project: "PRJ-2024-003", action: "Updated Purchase Status", previousValue: "In Progress", updatedValue: "Delayed", timestamp: "2026-02-01 09:30:10", department: "Purchase" },
  { id: "AUD-004", userName: "Amit Patel", role: "Tender", project: "PRJ-2024-001", action: "Completed Tender", previousValue: "In Progress", updatedValue: "Completed", timestamp: "2026-01-15 16:45:30", department: "Tender" },
  { id: "AUD-005", userName: "Deepak Singh", role: "Production", project: "PRJ-2024-002", action: "Started Production", previousValue: "Not Started", updatedValue: "In Progress", timestamp: "2026-02-10 08:00:00", department: "Production" },
  { id: "AUD-006", userName: "Rajesh Kumar", role: "Admin", project: "PRJ-2024-005", action: "Created Project", previousValue: "—", updatedValue: "PRJ-2024-005", timestamp: "2026-02-01 09:00:00", department: "System" },
  { id: "AUD-007", userName: "Rajesh Kumar", role: "Admin", project: "—", action: "Created User USR-006", previousValue: "—", updatedValue: "Neha Gupta", timestamp: "2025-12-15 11:20:00", department: "System" },
  { id: "AUD-008", userName: "Priya Sharma", role: "Design", project: "PRJ-2024-007", action: "Updated Design Status", previousValue: "In Progress", updatedValue: "Delayed", timestamp: "2026-02-05 13:10:55", department: "Design" },
  { id: "AUD-009", userName: "Vikram Rao", role: "Manager", project: "PRJ-2024-002", action: "Approved BOM Validation", previousValue: "Pending", updatedValue: "Completed", timestamp: "2026-01-28 15:30:00", department: "Operations" },
  { id: "AUD-010", userName: "Sanjay Mehta", role: "Finance", project: "PRJ-2024-006", action: "Generated Invoice", previousValue: "No", updatedValue: "INV-2026-0045", timestamp: "2026-02-25 10:00:00", department: "Finance" },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = auditData.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.project.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || a.role === roleFilter;
    const matchesDept = deptFilter === "All" || a.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const columns = [
    { key: "timestamp", header: "Timestamp", render: (a: AuditEntry) => <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{a.timestamp}</span> },
    { key: "userName", header: "User", render: (a: AuditEntry) => <span className="font-medium text-sm">{a.userName}</span> },
    { key: "role", header: "Role", render: (a: AuditEntry) => (
      <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{a.role}</span>
    ) },
    { key: "project", header: "Project", render: (a: AuditEntry) => <span className="text-xs text-primary font-medium">{a.project}</span> },
    { key: "action", header: "Action", render: (a: AuditEntry) => <span className="text-sm">{a.action}</span> },
    { key: "previousValue", header: "Previous Value", render: (a: AuditEntry) => <span className="text-xs text-muted-foreground">{a.previousValue}</span> },
    { key: "updatedValue", header: "Updated Value", render: (a: AuditEntry) => <span className="text-xs font-medium">{a.updatedValue}</span> },
    { key: "department", header: "Dept", render: (a: AuditEntry) => <span className="text-xs text-muted-foreground">{a.department}</span> },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Track all user activities and system changes</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, action, or project..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            {["Admin", "Tender", "Design", "Production", "Purchase", "Finance", "Manager"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="All Depts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Departments</SelectItem>
            {["Design", "Finance", "Purchase", "Tender", "Production", "Operations", "System"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(a) => a.id} pageSize={10} showExport={false} />
    </div>
  );
}
