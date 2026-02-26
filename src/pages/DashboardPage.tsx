import {
  FolderKanban,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Filter,
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

const kpis = [
  { label: "Active Projects", value: "42", change: "+3 this week", icon: FolderKanban, trend: "up" },
  { label: "On Schedule", value: "28", change: "66.7%", icon: TrendingUp, trend: "up" },
  { label: "Pending Actions", value: "15", change: "Across 8 projects", icon: Clock, trend: "neutral" },
  { label: "Delayed", value: "6", change: "Requires attention", icon: AlertTriangle, trend: "down" },
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
  { id: "JOB-2024-001", tag: "HE-101", customer: "Reliance Industries", status: "in-progress" as const, priority: "high", delivery: "2026-04-15" },
  { id: "JOB-2024-002", tag: "HE-102", customer: "Tata Steel", status: "completed" as const, priority: "medium", delivery: "2026-03-20" },
  { id: "JOB-2024-003", tag: "TE-201", customer: "BPCL", status: "delayed" as const, priority: "critical", delivery: "2026-03-01" },
  { id: "JOB-2024-004", tag: "HE-103", customer: "IOCL", status: "pending" as const, priority: "medium", delivery: "2026-05-10" },
  { id: "JOB-2024-005", tag: "TE-202", customer: "HPCL", status: "not-started" as const, priority: "low", delivery: "2026-06-01" },
];

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  delayed: "Delayed",
  pending: "Pending",
  "not-started": "Not Started",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of all manufacturing operations</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {kpi.trend === "up" && <ArrowUpRight className="w-3 h-3 text-status-completed" />}
              {kpi.change}
            </p>
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

        {/* Status summary */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status Summary</h3>
          <div className="space-y-3">
            {[
              { status: "completed" as const, label: "Completed", count: 12, pct: 29 },
              { status: "in-progress" as const, label: "In Progress", count: 18, pct: 43 },
              { status: "pending" as const, label: "Pending", count: 6, pct: 14 },
              { status: "delayed" as const, label: "Delayed", count: 4, pct: 9 },
              { status: "not-started" as const, label: "Not Started", count: 2, pct: 5 },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status}>{item.label}</StatusBadge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-current"
                      style={{
                        width: `${item.pct}%`,
                        color: `hsl(var(--status-${item.status}))`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-6 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-foreground">Recent Projects</h3>
          <button className="text-sm font-medium text-primary hover:underline">View all</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Tag ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((p) => (
              <tr key={p.id} className="cursor-pointer">
                <td className="font-medium text-primary">{p.id}</td>
                <td>{p.tag}</td>
                <td>{p.customer}</td>
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
