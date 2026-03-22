import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Eye, Pencil, Trash2, ArrowRight, AlertTriangle } from "lucide-react";
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

interface Lead {
  id: string;
  sno: number;
  jobId: string;
  tagId: string;
  customerName: string;
  customerContact: string;
  customerEmail: string;
  customerPhone: string;
  rfqNumber: string;
  gemNumber: string;
  erpCustomerPO: string;
  type: "Government" | "Project";
  status: "Approved" | "Rejected" | "Pending" | "Submitted" | "Closed";
  date: string;
  remarks: string;
}

const leads: Lead[] = [
  { id: "TND-001", sno: 1, jobId: "JOB-2024-001", tagId: "HE-101", customerName: "Reliance Industries", customerContact: "Mukesh Ambani", customerEmail: "procurement@reliance.com", customerPhone: "+91 9876543210", rfqNumber: "RFQ-2024-056", gemNumber: "", erpCustomerPO: "PO-2024-0456", type: "Project", status: "Approved", date: "2026-01-10", remarks: "Converted to project" },
  { id: "TND-002", sno: 2, jobId: "JOB-2024-002", tagId: "HE-102", customerName: "Tata Steel", customerContact: "Ravi Kumar", customerEmail: "purchase@tatasteel.com", customerPhone: "+91 9876543211", rfqNumber: "RFQ-2024-078", gemNumber: "", erpCustomerPO: "PO-2024-0789", type: "Project", status: "Approved", date: "2025-12-20", remarks: "Converted to project" },
  { id: "TND-003", sno: 3, jobId: "JOB-2024-008", tagId: "HE-105", customerName: "ONGC", customerContact: "Sunil Verma", customerEmail: "tenders@ongc.com", customerPhone: "+91 9876543218", rfqNumber: "RFQ-2025-012", gemNumber: "GEM/2025/B/1234567", erpCustomerPO: "", type: "Government", status: "Submitted", date: "2026-03-15", remarks: "Awaiting evaluation" },
  { id: "TND-004", sno: 4, jobId: "JOB-2024-009", tagId: "TE-204", customerName: "SAIL", customerContact: "Arun Mehta", customerEmail: "procurement@sail.in", customerPhone: "+91 9876543219", rfqNumber: "RFQ-2025-023", gemNumber: "GEM/2025/B/9876543", erpCustomerPO: "", type: "Government", status: "Pending", date: "2026-03-10", remarks: "Under technical review" },
  { id: "TND-005", sno: 5, jobId: "JOB-2024-010", tagId: "HE-106", customerName: "Vedanta", customerContact: "Ajay Sharma", customerEmail: "purchase@vedanta.com", customerPhone: "+91 9876543220", rfqNumber: "RFQ-2025-034", gemNumber: "", erpCustomerPO: "", type: "Project", status: "Rejected", date: "2026-02-28", remarks: "Price not competitive" },
  { id: "TND-006", sno: 6, jobId: "JOB-2024-011", tagId: "TE-205", customerName: "BHEL", customerContact: "Ramesh Nair", customerEmail: "projects@bhel.in", customerPhone: "+91 9876543221", rfqNumber: "RFQ-2025-045", gemNumber: "", erpCustomerPO: "", type: "Project", status: "Pending", date: "2026-03-18", remarks: "Commercial negotiation" },
  { id: "TND-007", sno: 7, jobId: "JOB-2024-003", tagId: "TE-201", customerName: "BPCL", customerContact: "Suresh Patel", customerEmail: "projects@bpcl.com", customerPhone: "+91 9876543212", rfqNumber: "RFQ-2024-099", gemNumber: "", erpCustomerPO: "PO-2024-1023", type: "Project", status: "Approved", date: "2025-11-15", remarks: "Converted" },
  { id: "TND-008", sno: 8, jobId: "JOB-2024-012", tagId: "HE-107", customerName: "Cairn Oil", customerContact: "Pradeep Jain", customerEmail: "tech@cairnoil.com", customerPhone: "+91 9876543222", rfqNumber: "RFQ-2025-056", gemNumber: "", erpCustomerPO: "", type: "Project", status: "Closed", date: "2026-01-05", remarks: "Customer cancelled" },
];

const statusColors: Record<string, string> = {
  Approved: "bg-primary/10 text-primary",
  Rejected: "bg-destructive/10 text-destructive",
  Pending: "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
  Closed: "bg-muted text-muted-foreground",
};

export default function TendersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLead, setEditLead] = useState<Partial<Lead> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [convertConfirm, setConvertConfirm] = useState<Lead | null>(null);

  const filtered = leads.filter((l) => {
    const matchesSearch = l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.tagId.toLowerCase().includes(search.toLowerCase()) ||
      l.jobId.toLowerCase().includes(search.toLowerCase()) ||
      l.rfqNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesType = typeFilter === "All" || l.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openAdd = () => {
    setEditLead({ type: "Project", status: "Pending", date: new Date().toISOString().split("T")[0] });
    setDialogOpen(true);
  };

  const columns = [
    { key: "sno", header: "S.No", render: (l: Lead) => <span className="text-xs text-muted-foreground">{l.sno}</span> },
    { key: "jobId", header: "Job ID", render: (l: Lead) => <span className="font-medium text-primary text-xs">{l.jobId}</span> },
    { key: "tagId", header: "Tag ID", render: (l: Lead) => <span className="font-mono text-xs">{l.tagId}</span> },
    { key: "customer", header: "Customer", render: (l: Lead) => <span className="text-sm">{l.customerName}</span> },
    { key: "rfq", header: "RFQ Number", render: (l: Lead) => <span className="text-xs text-muted-foreground">{l.rfqNumber}</span> },
    { key: "gem", header: "GeM Number", render: (l: Lead) => <span className="text-xs text-muted-foreground">{l.gemNumber || "—"}</span> },
    { key: "erp", header: "ERP PO", render: (l: Lead) => <span className="text-xs text-muted-foreground">{l.erpCustomerPO || "—"}</span> },
    { key: "type", header: "Type", render: (l: Lead) => (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${l.type === "Government" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>{l.type}</span>
    )},
    { key: "status", header: "Status", render: (l: Lead) => (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[l.status]}`}>{l.status}</span>
    )},
    { key: "date", header: "Date", render: (l: Lead) => <span className="text-xs text-muted-foreground">{l.date}</span> },
    { key: "actions", header: "", headerClassName: "w-10", className: "w-10", render: (l: Lead) => (
      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setActionMenu(actionMenu === l.id ? null : l.id)} className="p-1.5 rounded hover:bg-muted transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        {actionMenu === l.id && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-50 py-1 animate-fade-in">
              <button onClick={() => { setEditLead({ ...l }); setDialogOpen(true); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="w-3.5 h-3.5" /> Edit Lead</button>
              {(l.status === "Approved") && (
                <button onClick={() => { setConvertConfirm(l); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-muted"><ArrowRight className="w-3.5 h-3.5" /> Convert to Project</button>
              )}
              <div className="border-t my-1" />
              <button onClick={() => { setDeleteConfirm(l.id); setActionMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"><Trash2 className="w-3.5 h-3.5" /> Delete Lead</button>
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
          <h1 className="text-xl font-bold text-foreground">Tender Management</h1>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            {["Approved", "Pending", "Submitted", "Rejected", "Closed"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Government">Government</SelectItem>
            <SelectItem value="Project">Project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filtered} columns={columns} rowKey={(l) => l.id} pageSize={10} showExport={false} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editLead?.id ? "Edit Lead" : "Add New Lead"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Job ID</Label><Input placeholder="JOB-2024-XXX" /></div>
              <div className="space-y-2"><Label>Tag ID</Label><Input placeholder="HE-XXX" /></div>
              <div className="space-y-2"><Label>Customer Name</Label><Input placeholder="Company name" /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input placeholder="Contact name" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
              <div className="space-y-2"><Label>RFQ Number</Label><Input placeholder="RFQ-XXXX-XXX" /></div>
              <div className="space-y-2"><Label>GeM Number</Label><Input placeholder="GEM/XXXX/X/XXXXXXX" /></div>
              <div className="space-y-2"><Label>ERP Customer PO</Label><Input placeholder="PO-XXXX-XXXX" /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent><SelectItem value="Government">Government</SelectItem><SelectItem value="Project">Project</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>{["Approved", "Pending", "Submitted", "Rejected", "Closed"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label>Remarks</Label><Textarea placeholder="Additional notes..." rows={2} /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">{editLead?.id ? "Update Lead" : "Add Lead"}</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert Confirmation */}
      <Dialog open={!!convertConfirm} onOpenChange={() => setConvertConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><ArrowRight className="w-5 h-5 text-primary" /> Convert Lead to Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">This will create a new Project and Finance entry linked to:</p>
            {convertConfirm && (
              <div className="rounded-md border p-3 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Job ID:</span> <span className="font-medium">{convertConfirm.jobId}</span></p>
                <p><span className="text-muted-foreground">Tag ID:</span> <span className="font-medium">{convertConfirm.tagId}</span></p>
                <p><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{convertConfirm.customerName}</span></p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setConvertConfirm(null)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => { setConvertConfirm(null); navigate("/projects"); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90">Convert</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Delete Lead</DialogTitle></DialogHeader>
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
