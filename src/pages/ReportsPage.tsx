import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const departmentData = [
  { name: "Tender", completed: 12, pending: 3, delayed: 1 },
  { name: "Design", completed: 10, pending: 5, delayed: 2 },
  { name: "Production", completed: 8, pending: 6, delayed: 3 },
  { name: "Purchase", completed: 9, pending: 4, delayed: 1 },
  { name: "Finishing", completed: 7, pending: 5, delayed: 2 },
  { name: "Dispatch", completed: 11, pending: 2, delayed: 1 },
];

const statusDistribution = [
  { name: "Completed", value: 42, color: "hsl(var(--status-completed))" },
  { name: "In Progress", value: 25, color: "hsl(var(--primary))" },
  { name: "Pending", value: 15, color: "hsl(var(--status-pending))" },
  { name: "Delayed", value: 8, color: "hsl(var(--status-delayed))" },
];

const monthlyTrend = [
  { month: "Sep", projects: 4 },
  { month: "Oct", projects: 6 },
  { month: "Nov", projects: 5 },
  { month: "Dec", projects: 8 },
  { month: "Jan", projects: 7 },
  { month: "Feb", projects: 9 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Project performance insights and department analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Department Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--status-completed))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(var(--status-pending))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="hsl(var(--status-delayed))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Project Status Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Monthly Project Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="projects" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
