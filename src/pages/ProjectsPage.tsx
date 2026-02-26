import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";

const projects = [
  { id: "JOB-2024-001", tag: "HE-101", customer: "Reliance Industries", tender: "completed" as const, design: "in-progress" as const, purchase: "pending" as const, production: "not-started" as const, priority: "high" as const, delivery: "2026-04-15", overall: "in-progress" as const, value: "₹45,00,000" },
  { id: "JOB-2024-002", tag: "HE-102", customer: "Tata Steel", tender: "completed" as const, design: "completed" as const, purchase: "completed" as const, production: "in-progress" as const, priority: "medium" as const, delivery: "2026-03-20", overall: "in-progress" as const, value: "₹32,50,000" },
  { id: "JOB-2024-003", tag: "TE-201", customer: "BPCL", tender: "completed" as const, design: "completed" as const, purchase: "delayed" as const, production: "not-started" as const, priority: "critical" as const, delivery: "2026-03-01", overall: "delayed" as const, value: "₹78,00,000" },
  { id: "JOB-2024-004", tag: "HE-103", customer: "IOCL", tender: "completed" as const, design: "in-progress" as const, purchase: "not-started" as const, production: "not-started" as const, priority: "medium" as const, delivery: "2026-05-10", overall: "in-progress" as const, value: "₹22,00,000" },
  { id: "JOB-2024-005", tag: "TE-202", customer: "HPCL", tender: "in-progress" as const, design: "not-started" as const, purchase: "not-started" as const, production: "not-started" as const, priority: "low" as const, delivery: "2026-06-01", overall: "not-started" as const, value: "₹55,00,000" },
  { id: "JOB-2024-006", tag: "HE-104", customer: "GAIL", tender: "completed" as const, design: "completed" as const, purchase: "completed" as const, production: "completed" as const, priority: "medium" as const, delivery: "2026-02-28", overall: "completed" as const, value: "₹41,00,000" },
  { id: "JOB-2024-007", tag: "TE-203", customer: "NTPC", tender: "completed" as const, design: "delayed" as const, purchase: "not-started" as const, production: "not-started" as const, priority: "high" as const, delivery: "2026-04-25", overall: "delayed" as const, value: "₹67,50,000" },
];

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  delayed: "Delayed",
  pending: "Pending",
  "not-started": "Not Started",
};

const statusShort: Record<string, string> = {
  "in-progress": "IP",
  completed: "✓",
  delayed: "!",
  pending: "…",
  "not-started": "—",
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.overall === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} total projects</p>
        </div>
        <button
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
            placeholder="Search by Job ID, Tag, or Customer..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-md border bg-card text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
            <option value="pending">Pending</option>
            <option value="not-started">Not Started</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 h-9 px-3 rounded-md border text-sm hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>

        <button className="flex items-center gap-2 h-9 px-3 rounded-md border text-sm hover:bg-muted transition-colors ml-auto">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <span className="flex items-center gap-1 cursor-pointer">
                  Job ID <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th>Tag ID</th>
              <th>Customer</th>
              <th>Value</th>
              <th className="text-center">Tender</th>
              <th className="text-center">Design</th>
              <th className="text-center">Purchase</th>
              <th className="text-center">Production</th>
              <th>Priority</th>
              <th>
                <span className="flex items-center gap-1 cursor-pointer">
                  Delivery <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th>Overall</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="cursor-pointer"
              >
                <td className="font-medium text-primary">{p.id}</td>
                <td className="font-mono text-xs">{p.tag}</td>
                <td>{p.customer}</td>
                <td className="text-muted-foreground text-xs">{p.value}</td>
                <td className="text-center">
                  <StatusBadge status={p.tender}>{statusShort[p.tender]}</StatusBadge>
                </td>
                <td className="text-center">
                  <StatusBadge status={p.design}>{statusShort[p.design]}</StatusBadge>
                </td>
                <td className="text-center">
                  <StatusBadge status={p.purchase}>{statusShort[p.purchase]}</StatusBadge>
                </td>
                <td className="text-center">
                  <StatusBadge status={p.production}>{statusShort[p.production]}</StatusBadge>
                </td>
                <td>
                  <PriorityBadge priority={p.priority} />
                </td>
                <td className="text-muted-foreground text-sm">{p.delivery}</td>
                <td>
                  <StatusBadge status={p.overall}>{statusLabels[p.overall]}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
