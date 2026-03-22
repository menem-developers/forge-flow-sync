import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban, TrendingUp, Clock, AlertTriangle, ArrowUpRight, CalendarDays, Truck, Bell, Activity,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const kpis = [
  { label: "Active Projects", value: "42", change: "+3 this week", icon: FolderKanban, trend: "up" as const, filter: "in-progress" },
  { label: "On Schedule", value: "28", change: "66.7%", icon: TrendingUp, trend: "up" as const, filter: "completed" },
  { label: "Pending", value: "15", change: "Across 8 projects", icon: Clock, trend: "neutral" as const, filter: "pending" },
  { label: "Delayed", value: "6", change: "Requires attention", icon: AlertTriangle, trend: "down" as const, filter: "delayed" },
  { label: "Dispatched", value: "4", change: "This month", icon: Truck, trend: "up" as const, filter: "completed" },
];

const departmentData = [
  { name: "Tender", count: 8, fill: "hsl(153, 97%, 20%)" },
  { name: "Design", count: 12, fill: "hsl(210, 80%, 52%)" },
  { name: "Purchase", count: 6, fill: "hsl(38, 92%, 50%)" },
  { name: "Production", count: 18, fill: "hsl(153, 70%, 40%)" },
  { name: "Finishing", count: 5, fill: "hsl(25, 95%, 53%)" },
  { name: "Dispatch", count: 4, fill: "hsl(220, 13%, 69%)" },
];

const recentActivities = [
  { tagId: "HE-101", action: "Design status updated to In Progress", user: "Priya Sharma", time: "2 hours ago" },
  { tagId: "HE-102", action: "Production started - Cutting phase", user: "Deepak Singh", time: "3 hours ago" },
  { tagId: "TE-201", action: "Purchase delayed - Vendor issue", user: "Amit Patel", time: "5 hours ago" },
  { tagId: "HE-104", action: "Spiral HE dispatched successfully", user: "Logistics Team", time: "6 hours ago" },
  { tagId: "TE-203", action: "QAP revision submitted for approval", user: "Vikram Rao", time: "1 day ago" },
];

const alerts = [
  { tagId: "TE-201", message: "Delivery overdue by 21 days", severity: "critical" as const },
  { tagId: "TE-203", message: "Design delayed - scope change", severity: "high" as const },
  { tagId: "HE-103", message: "Advance payment pending", severity: "medium" as const },
  { tagId: "HE-101", message: "Drawing approval pending from client", severity: "medium" as const },
];

const calendarEvents: Record<string, { tagId: string; type: string }[]> = {
  "2026-03-22": [{ tagId: "HE-101", type: "Design Review" }, { tagId: "TE-201", type: "Overdue" }],
  "2026-03-25": [{ tagId: "HE-102", type: "Delivery Due" }],
  "2026-03-28": [{ tagId: "HE-104", type: "Payment Due" }],
  "2026-04-01": [{ tagId: "TE-201", type: "Payment Due" }],
  "2026-04-10": [{ tagId: "HE-103", type: "Design Start" }],
  "2026-04-15": [{ tagId: "HE-101", type: "Delivery Due" }],
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("this-month");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const today = new Date(2026, 2, 22); // March 22, 2026
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header with date filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Project Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of all manufacturing operations</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>
          {dateRange === "custom" && (
            <div className="flex items-center gap-1.5">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="h-9 px-2 rounded-md border bg-card text-sm" />
              <span className="text-xs text-muted-foreground">to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="h-9 px-2 rounded-md border bg-card text-sm" />
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            onClick={() => navigate(`/projects?status=${kpi.filter}`)}
            className="kpi-card cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              {kpi.trend === "up" && <ArrowUpRight className="w-3 h-3 text-status-completed" />}
              {kpi.change}
            </p>
            <div className="mt-1.5 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Click to view →
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Calendar row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department workload */}
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Department Workload</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 13%, 91%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Calendar */}
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Calendar - March 2026</h3>
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="text-[10px] font-medium text-muted-foreground py-1">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateKey = getDateKey(day);
              const events = calendarEvents[dateKey];
              const isToday = day === 22;
              const isSelected = selectedDate === dateKey;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  className={`relative text-xs h-7 rounded transition-colors ${
                    isToday ? "bg-primary text-primary-foreground font-bold" :
                    isSelected ? "bg-accent text-accent-foreground font-semibold" :
                    events ? "bg-primary/10 text-primary font-medium hover:bg-primary/20" :
                    "text-foreground hover:bg-muted"
                  }`}
                >
                  {day}
                  {events && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
          {selectedDate && calendarEvents[selectedDate] && (
            <div className="mt-3 space-y-1.5 border-t pt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{selectedDate}</p>
              {calendarEvents[selectedDate].map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/50">
                  <span className="font-mono font-medium text-primary">{ev.tagId}</span>
                  <span className="text-muted-foreground">{ev.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <div className="bg-card rounded-lg border">
          <div className="flex items-center gap-2 px-4 py-3 border-b">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Recent Activities</h3>
          </div>
          <div className="divide-y">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-0.5 shrink-0">{a.tagId}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-lg border">
          <div className="flex items-center gap-2 px-4 py-3 border-b">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
          </div>
          <div className="divide-y">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                  a.severity === "critical" ? "text-destructive" : a.severity === "high" ? "text-status-pending" : "text-muted-foreground"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-primary">{a.tagId}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      a.severity === "critical" ? "bg-destructive/10 text-destructive" :
                      a.severity === "high" ? "bg-status-pending/20 text-amber-700" :
                      "bg-muted text-muted-foreground"
                    }`}>{a.severity}</span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Project Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <span className="text-sm font-semibold text-foreground">{item.count}</span>
              </div>
              <Progress value={item.pct} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground text-right">{item.pct}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
