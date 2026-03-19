import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const kpis = [
  { label: "Active Projects", value: "42", change: "+3 this week", icon: FolderKanban, trend: "up" as const, filter: "in-progress" },
  { label: "On Schedule", value: "28", change: "66.7%", icon: TrendingUp, trend: "up" as const, filter: "completed" },
  { label: "Pending Actions", value: "15", change: "Across 8 projects", icon: Clock, trend: "neutral" as const, filter: "pending" },
  { label: "Delayed", value: "6", change: "Requires attention", icon: AlertTriangle, trend: "down" as const, filter: "delayed" },
];

const departmentData = [
  { name: "Tender", count: 8, fill: "hsl(153, 97%, 20%)" },
  { name: "Design", count: 12, fill: "hsl(210, 80%, 52%)" },
  { name: "Purchase", count: 6, fill: "hsl(38, 92%, 50%)" },
  { name: "Production", count: 18, fill: "hsl(153, 70%, 40%)" },
  { name: "Finishing", count: 5, fill: "hsl(25, 95%, 53%)" },
  { name: "Dispatch", count: 4, fill: "hsl(220, 13%, 69%)" },
  { name: "Finance", count: 9, fill: "hsl(280, 60%, 50%)" },
];

const recentProjects = [
  { id: "JOB-2024-001", tag: "HE-101", customer: "Reliance Industries", status: "in-progress" as const, priority: "high", delivery: "2026-04-15", progress: 35 },
  { id: "JOB-2024-002", tag: "HE-102", customer: "Tata Steel", status: "in-progress" as const, priority: "medium", delivery: "2026-03-20", progress: 72 },
  { id: "JOB-2024-003", tag: "TE-201", customer: "BPCL", status: "delayed" as const, priority: "critical", delivery: "2026-03-01", progress: 55 },
  { id: "JOB-2024-004", tag: "HE-103", customer: "IOCL", status: "pending" as const, priority: "medium", delivery: "2026-05-10", progress: 15 },
  { id: "JOB-2024-005", tag: "TE-202", customer: "HPCL", status: "not-started" as const, priority: "low", delivery: "2026-06-01", progress: 0 },
];

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  delayed: "Delayed",
  pending: "Pending",
  "not-started": "Not Started",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("this-month");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of all manufacturing operations</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards - Interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            onClick={() => navigate(`/projects?status=${kpi.filter}`)}
            className="kpi-card cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {kpi.trend === "up" && <ArrowUpRight className="w-3 h-3 text-status-completed" />}
              {kpi.change}
            </p>
            <div className="mt-2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Click to view projects →
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department workload */}
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Department Workload</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status summary with progress bars */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status Summary</h3>
          <div className="space-y-4">
            {[
              { status: "completed" as const, label: "Completed", count: 12, pct: 29 },
              { status: "in-progress" as const, label: "In Progress", count: 18, pct: 43 },
              { status: "pending" as const, label: "Pending", count: 6, pct: 14 },
              { status: "delayed" as const, label: "Delayed", count: 4, pct: 9 },
              { status: "not-started" as const, label: "Not Started", count: 2, pct: 5 },
            ].map((item) => (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <StatusBadge status={item.status}>{item.label}</StatusBadge>
                  <span className="text-sm font-semibold text-foreground">{item.count} <span className="text-xs font-normal text-muted-foreground">({item.pct}%)</span></span>
                </div>
                <Progress value={item.pct} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-foreground">Recent Projects</h3>
          <button
            onClick={() => navigate("/projects")}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Tag ID</th>
              <th>Customer</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((p) => (
              <tr
                key={p.id}
                className="cursor-pointer"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <td className="font-medium text-primary">{p.id}</td>
                <td>{p.tag}</td>
                <td>{p.customer}</td>
                <td>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Progress value={p.progress} className="h-1.5 flex-1" />
                    <span className="text-xs font-medium text-muted-foreground w-8">{p.progress}%</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={p.status}>{statusLabels[p.status]}</StatusBadge>
                </td>
                <td className="text-muted-foreground">{p.delivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
