import { DollarSign, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const summaryCards = [
  { title: "Total Receivables", value: "₹24,50,000", icon: DollarSign, change: "+12%" },
  { title: "Payments Received", value: "₹18,75,000", icon: CheckCircle, change: "+8%" },
  { title: "Pending Invoices", value: "5", icon: Clock, change: "-2" },
  { title: "Overdue Payments", value: "2", icon: AlertTriangle, change: "+1" },
];

const invoices = [
  { id: "INV-001", project: "HE-2024-001", customer: "Tata Power", amount: "₹5,50,000", status: "Paid", dueDate: "2024-01-15", paidDate: "2024-01-12" },
  { id: "INV-002", project: "HE-2024-003", customer: "Reliance Industries", amount: "₹8,25,000", status: "Pending", dueDate: "2024-02-28", paidDate: "-" },
  { id: "INV-003", project: "HE-2024-005", customer: "Adani Group", amount: "₹3,00,000", status: "Overdue", dueDate: "2024-01-30", paidDate: "-" },
  { id: "INV-004", project: "HE-2024-002", customer: "BHEL", amount: "₹6,75,000", status: "Partial", dueDate: "2024-03-15", paidDate: "-" },
  { id: "INV-005", project: "HE-2024-004", customer: "L&T", amount: "₹4,50,000", status: "Paid", dueDate: "2024-02-10", paidDate: "2024-02-08" },
];

const statusColor: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
  Partial: "bg-blue-100 text-blue-700",
};

export default function FinancePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const allSelected = selected.length === invoices.length;

  const toggleAll = () => setSelected(allSelected ? [] : invoices.map((i) => i.id));
  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financial Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Track invoices, payments, and financial health across projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Tracker</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell><Checkbox checked={selected.includes(inv.id)} onCheckedChange={() => toggle(inv.id)} /></TableCell>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.project}</TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell>{inv.paidDate}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>{inv.status}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
