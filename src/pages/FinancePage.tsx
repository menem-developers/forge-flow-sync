import { useState } from "react";
import { Search, Plus, MoreHorizontal, Eye, Pencil, Trash2, AlertTriangle, Save, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface FinanceRecord {
  id: string;
  jobId: string;
  tagId: string;
  customer: string;
  rfqNumber: string;
  tenderNumber: string;
  gemNumber: string;
  erpPONumber: string;
  invoiceValue: string;
  invoiceNumber: string;
  advancePayment: string;
  penaltyFee: string;
  balanceAmount: string;
  woValue: string;
  status: "Paid" | "Pending" | "Partial" | "Overdue";
}

const financeData: FinanceRecord[] = [
  { id: "FIN-001", jobId: "JOB-2024-001", tagId: "HE-101", customer: "Reliance Industries", rfqNumber: "RFQ-2024-056", tenderNumber: "TND-001", gemNumber: "", erpPONumber: "PO-2024-0456", invoiceValue: "₹45,00,000", invoiceNumber: "", advancePayment: "₹13,50,000", penaltyFee: "₹0", balanceAmount: "₹31,50,000", woValue: "₹45,00,000", status: "Partial" },
  { id: "FIN-002", jobId: "JOB-2024-002", tagId: "HE-102", customer: "Tata Steel", rfqNumber: "RFQ-2024-078", tenderNumber: "TND-002", gemNumber: "", erpPONumber: "PO-2024-0789", invoiceValue: "₹32,50,000", invoiceNumber: "", advancePayment: "₹9,75,000", penaltyFee: "₹0", balanceAmount: "₹22,75,000", woValue: "₹32,50,000", status: "Pending" },
  { id: "FIN-003", jobId: "JOB-2024-003", tagId: "TE-201", customer: "BPCL", rfqNumber: "RFQ-2024-099", tenderNumber: "TND-007", gemNumber: "", erpPONumber: "PO-2024-1023", invoiceValue: "₹78,00,000", invoiceNumber: "", advancePayment: "₹23,40,000", penaltyFee: "₹2,00,000", balanceAmount: "₹54,60,000", woValue: "₹78,00,000", status: "Overdue" },
  { id: "FIN-004", jobId: "JOB-2024-006", tagId: "HE-104", customer: "GAIL", rfqNumber: "RFQ-2024-087", tenderNumber: "TND-009", gemNumber: "", erpPONumber: "PO-2024-0876", invoiceValue: "₹41,00,000", invoiceNumber: "INV-2026-0045", advancePayment: "₹12,30,000", penaltyFee: "₹0", balanceAmount: "₹28,70,000", woValue: "₹41,00,000", status: "Pending" },
  { id: "FIN-005", jobId: "JOB-2024-007", tagId: "TE-203", customer: "NTPC", rfqNumber: "RFQ-2024-134", tenderNumber: "TND-010", gemNumber: "", erpPONumber: "PO-2024-1345", invoiceValue: "₹67,50,000", invoiceNumber: "", advancePayment: "₹20,25,000", penaltyFee: "₹0", balanceAmount: "₹47,25,000", woValue: "₹67,50,000", status: "Partial" },
  { id: "FIN-006", jobId: "JOB-2024-004", tagId: "HE-103", customer: "IOCL", rfqNumber: "RFQ-2024-115", tenderNumber: "TND-011", gemNumber: "", erpPONumber: "PO-2024-1156", invoiceValue: "₹22,00,000", invoiceNumber: "", advancePayment: "₹0", penaltyFee: "₹0", balanceAmount: "₹22,00,000", woValue: "₹22,00,000", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-destructive/10 text-destructive",
  Partial: "bg-blue-100 text-blue-700",
};

export default function FinancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<FinanceRecord | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Editable table rows for detail view
  const [detailItems, setDetailItems] = useState([
    { item: "Shell Fabrication", amount: "₹12,00,000", remarks: "Completed" },
    { item: "Tube Bundle Assembly", amount: "₹8,50,000", remarks: "In Progress" },
    { item: "Testing & Certification", amount: "₹3,00,000", remarks: "Pending" },
  ]);

  const filtered = financeData.filter(f => {
    if (search && !f.customer.toLowerCase().includes(search.toLowerCase()) && !f.tagId.toLowerCase().includes(search.toLowerCase()) && !f.jobId.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "All" && f.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { key: "jobId", header: "Job ID", render: (f: FinanceRecord) => <span className="text-xs font-medium text-primary">{f.jobId}</span> },
    { key: "tagId", header: "Tag ID", render: (f: FinanceRecord) => <span className="text-xs font-mono">{f.tagId}</span> },
    { key: "customer", header: "Customer", render: (f: FinanceRecord) => <span className="text-sm">{f.customer}</span> },
    { key: "rfq", header: "RFQ No.", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.rfqNumber}</span> },
    { key: "tender", header: "Tender No.", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.tenderNumber}</span> },
    { key: "gem", header: "GEM No.", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.gemNumber || "—"}</span> },
    { key: "erp", header: "ERP PO", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.erpPONumber}</span> },
    { key: "invoice", header: "Invoice Value", render: (f: FinanceRecord) => <span className="text-xs font-semibold">{f.invoiceValue}</span> },
    { key: "invNo", header: "Inv. No.", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.invoiceNumber || "—"}</span> },
    { key: "advance", header: "Advance", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.advancePayment}</span> },
    { key: "penalty", header: "Penalty", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.penaltyFee}</span> },
    { key: "balance", header: "Balance", render: (f: FinanceRecord) => <span className="text-xs font-semibold text-foreground">{f.balanceAmount}</span> },
    { key: "wo", header: "WO Value", render: (f: FinanceRecord) => <span className="text-xs text-muted-foreground">{f.woValue}</span> },
    { key: "status", header: "Status", render: (f: FinanceRecord) => (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[f.status]}`}>{f.status}</span>
    )},
    { key: "actions", header: "", headerClassName: "w-10", className: "w-10", render: (f: FinanceRecord) => (
      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setActionMenu(actionMenu === f.id ? null : f.id)} className="p-1.5 rounded hover:bg-muted">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        {actionMenu === f.id && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
            <div className="absolute right-0 top-full mt-1 w-40 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
              <button onClick={() => { setDetailOpen(f); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Eye className="w-3.5 h-3.5" /> View</button>
              <button onClick={() => { setDialogOpen(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="w-3.5 h-3.5" /> Edit</button>
              <div className="border-t my-1" />
              <button onClick={() => { setDeleteConfirm(f.id); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
            </div>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Finance</h1>
          <p className="text-sm text-muted-foreground">{financeData.length} financial records</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Job ID, Tag ID, or Customer..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            {["Paid", "Pending", "Partial", "Overdue"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(f) => f.id} pageSize={10} showExport={false} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Finance Entry</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2"><Label>Job ID</Label><Input placeholder="JOB-2024-XXX" /></div>
            <div className="space-y-2"><Label>Tag ID</Label><Input placeholder="HE-XXX" /></div>
            <div className="space-y-2"><Label>Customer</Label><Input placeholder="Customer name" /></div>
            <div className="space-y-2"><Label>RFQ Number</Label><Input placeholder="RFQ-XXXX-XXX" /></div>
            <div className="space-y-2"><Label>Tender Number</Label><Input placeholder="TND-XXX" /></div>
            <div className="space-y-2"><Label>GEM Number</Label><Input placeholder="GEM/XXXX/X/XXXXXXX" /></div>
            <div className="space-y-2"><Label>ERP PO Number</Label><Input placeholder="PO-XXXX-XXXX" /></div>
            <div className="space-y-2"><Label>Invoice Value</Label><Input placeholder="₹0" /></div>
            <div className="space-y-2"><Label>Invoice Number</Label><Input placeholder="INV-XXXX-XXXX" /></div>
            <div className="space-y-2"><Label>Advance Payment</Label><Input placeholder="₹0" /></div>
            <div className="space-y-2"><Label>Penalty Fee</Label><Input placeholder="₹0" /></div>
            <div className="space-y-2"><Label>WO Value</Label><Input placeholder="₹0" /></div>
            <div className="space-y-2"><Label>Balance Amount</Label><Input placeholder="Auto calculated" disabled /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Paid", "Pending", "Partial", "Overdue"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">Save</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View with editable table */}
      <Dialog open={!!detailOpen} onOpenChange={() => setDetailOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Project Finance Detail</DialogTitle></DialogHeader>
          {detailOpen && (
            <div className="space-y-5 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  { l: "PO/WO Number", v: detailOpen.erpPONumber },
                  { l: "Supplier", v: detailOpen.customer },
                  { l: "Date", v: "2026-01-15" },
                  { l: "Total Value", v: detailOpen.woValue },
                ].map(item => (
                  <div key={item.l}><p className="text-muted-foreground text-xs">{item.l}</p><p className="font-medium">{item.v}</p></div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Line Items</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-32">Amount</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailItems.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell><Input className="h-7 text-xs" value={item.item} onChange={e => { const n = [...detailItems]; n[i] = { ...n[i], item: e.target.value }; setDetailItems(n); }} /></TableCell>
                          <TableCell><Input className="h-7 text-xs" value={item.amount} onChange={e => { const n = [...detailItems]; n[i] = { ...n[i], amount: e.target.value }; setDetailItems(n); }} /></TableCell>
                          <TableCell><Input className="h-7 text-xs" value={item.remarks} onChange={e => { const n = [...detailItems]; n[i] = { ...n[i], remarks: e.target.value }; setDetailItems(n); }} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDetailItems([...detailItems, { item: "", amount: "", remarks: "" }])} className="text-xs text-primary font-medium hover:underline">+ Add Row</button>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-muted"><RotateCcw className="w-3 h-3" /> Reset</button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"><Save className="w-3 h-3" /> Save</button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Delete Record</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:opacity-90">Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
