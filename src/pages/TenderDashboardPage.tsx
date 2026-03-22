import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp, CalendarDays } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const kpis = [
  { label: "Total Leads", value: "38", change: "+5 this month", icon: FileText },
  { label: "Approved", value: "14", change: "36.8%", icon: CheckCircle },
  { label: "Pending", value: "12", change: "Under review", icon: Clock },
  { label: "Rejected", value: "8", change: "21.1%", icon: XCircle },
  { label: "Conversion Rate", value: "37%", change: "+4% vs last month", icon: TrendingUp },
];

const statusDistribution = [
  { name: "Approved", value: 14, color: "hsl(153, 70%, 40%)" },
  { name: "Pending", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Submitted", value: 4, color: "hsl(210, 80%, 52%)" },
  { name: "Rejected", value: 8, color: "hsl(0, 84%, 60%)" },
];

const monthlyTrends = [
  { month: "Oct", leads: 5, converted: 2 },
  { month: "Nov", leads: 7, converted: 3 },
  { month: "Dec", leads: 6, converted: 2 },
  { month: "Jan", leads: 8, converted: 3 },
  { month: "Feb", leads: 7, converted: 2 },
  { month: "Mar", leads: 5, converted: 2 },
];

export default function TenderDashboardPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("this-month");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tender Dashboard</h1>
          <p className="text-sm text-muted-foreground">Lead and tender analytics overview</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} onClick={() => navigate("/tenders")} className="kpi-card cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="leads" fill="hsl(210, 80%, 52%)" radius={[4, 4, 0, 0]} name="Total Leads" />
              <Bar dataKey="converted" fill="hsl(153, 97%, 20%)" radius={[4, 4, 0, 0]} name="Converted" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
