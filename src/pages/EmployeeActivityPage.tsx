import { useState } from "react";
import { Search, Plus, Pencil, Trash2, RotateCcw, Save } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityRecord {
  id: string;
  sno: number;
  date: string;
  employeeName: string;
  jobId: string;
  tagId: string;
  type: "Work Plan" | "Over Time";
  shopFloor: string;
  workDescription: string;
  shiftType?: "Day" | "Night";
  updatedBy: string;
}

interface AbsentRecord {
  id: string;
  sno: number;
  date: string;
  employeeName: string;
  reason: string;
  updatedBy: string;
}

const employees = [
  "Raju Sharma", "Sunil Yadav", "Mohan Das", "Vikash Kumar", "Arjun Singh",
  "Deepak Verma", "Ramesh Gupta", "Sanjay Joshi", "Amit Tiwari", "Prakash Nair",
];

const workRecords: ActivityRecord[] = [
  { id: "WR-001", sno: 1, date: "2026-03-22", employeeName: "Raju Sharma", jobId: "JOB-2024-002", tagId: "HE-102", type: "Work Plan", shopFloor: "Assembly Shop Floor", workDescription: "Shell assembly welding - 60% complete", updatedBy: "Deepak Singh" },
  { id: "WR-002", sno: 2, date: "2026-03-22", employeeName: "Sunil Yadav", jobId: "JOB-2024-002", tagId: "HE-102", type: "Work Plan", shopFloor: "Machine Shop", workDescription: "Tube sheet machining - finishing pass", updatedBy: "Deepak Singh" },
  { id: "WR-003", sno: 3, date: "2026-03-22", employeeName: "Mohan Das", jobId: "JOB-2024-001", tagId: "HE-101", type: "Work Plan", shopFloor: "Store and Purchase", workDescription: "Material inspection - SA 516 plates", updatedBy: "Amit Patel" },
  { id: "WR-004", sno: 4, date: "2026-03-21", employeeName: "Vikash Kumar", jobId: "JOB-2024-002", tagId: "HE-102", type: "Work Plan", shopFloor: "Assembly Shop Floor", workDescription: "Baffle plate fitting", updatedBy: "Deepak Singh" },
  { id: "WR-005", sno: 5, date: "2026-03-21", employeeName: "Arjun Singh", jobId: "JOB-2024-003", tagId: "TE-201", type: "Work Plan", shopFloor: "Machine Shop", workDescription: "Flange boring operation", updatedBy: "Vikram Rao" },
];

const overtimeRecords: ActivityRecord[] = [
  { id: "OT-001", sno: 1, date: "2026-03-22", employeeName: "Raju Sharma", jobId: "JOB-2024-002", tagId: "HE-102", type: "Over Time", shopFloor: "Assembly Shop Floor", workDescription: "Urgent welding completion", shiftType: "Night", updatedBy: "Deepak Singh" },
  { id: "OT-002", sno: 2, date: "2026-03-21", employeeName: "Vikash Kumar", jobId: "JOB-2024-002", tagId: "HE-102", type: "Over Time", shopFloor: "Assembly Shop Floor", workDescription: "Shell alignment rework", shiftType: "Day", updatedBy: "Deepak Singh" },
  { id: "OT-003", sno: 3, date: "2026-03-20", employeeName: "Sunil Yadav", jobId: "JOB-2024-001", tagId: "HE-101", type: "Over Time", shopFloor: "Machine Shop", workDescription: "Finish machining for inspection", shiftType: "Night", updatedBy: "Vikram Rao" },
];

const absentRecords: AbsentRecord[] = [
  { id: "ABS-001", sno: 1, date: "2026-03-22", employeeName: "Deepak Verma", reason: "Sick leave", updatedBy: "HR Admin" },
  { id: "ABS-002", sno: 2, date: "2026-03-22", employeeName: "Ramesh Gupta", reason: "Personal emergency", updatedBy: "HR Admin" },
  { id: "ABS-003", sno: 3, date: "2026-03-21", employeeName: "Sanjay Joshi", reason: "", updatedBy: "HR Admin" },
];

export default function EmployeeActivityPage() {
  const [activeTab, setActiveTab] = useState("work-plan");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"work" | "overtime" | "absent">("work");
  const [shopFloorSection, setShopFloorSection] = useState("Assembly Shop Floor");

  const openAdd = (type: "work" | "overtime" | "absent") => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const workColumns = [
    { key: "sno", header: "S.No", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.sno}</span> },
    { key: "date", header: "Date", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.date}</span> },
    { key: "employee", header: "Employee Name", render: (r: ActivityRecord) => <span className="text-sm font-medium">{r.employeeName}</span> },
    { key: "jobId", header: "Job ID", render: (r: ActivityRecord) => <span className="text-xs text-primary font-medium">{r.jobId}</span> },
    { key: "tagId", header: "Tag ID", render: (r: ActivityRecord) => <span className="text-xs font-mono">{r.tagId}</span> },
    { key: "type", header: "Type", render: (r: ActivityRecord) => (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.type === "Over Time" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>{r.type}</span>
    )},
    { key: "work", header: "Work Description", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.workDescription}</span> },
    { key: "updatedBy", header: "Updated By", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.updatedBy}</span> },
    { key: "actions", header: "Actions", headerClassName: "w-20", render: (r: ActivityRecord) => (
      <div className="flex items-center gap-1">
        <button className="p-1 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
      </div>
    )},
  ];

  const overtimeColumns = [
    { key: "sno", header: "S.No", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.sno}</span> },
    { key: "employee", header: "Employee Name", render: (r: ActivityRecord) => <span className="text-sm font-medium">{r.employeeName}</span> },
    { key: "jobId", header: "Job ID", render: (r: ActivityRecord) => <span className="text-xs text-primary font-medium">{r.jobId}</span> },
    { key: "tagId", header: "Tag ID", render: (r: ActivityRecord) => <span className="text-xs font-mono">{r.tagId}</span> },
    { key: "work", header: "Work Description", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.workDescription}</span> },
    { key: "type", header: "Type", render: (r: ActivityRecord) => <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-700">{r.type}</span> },
    { key: "shift", header: "Shift Type", render: (r: ActivityRecord) => (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.shiftType === "Night" ? "bg-slate-800 text-white" : "bg-muted text-foreground"}`}>{r.shiftType}</span>
    )},
    { key: "updatedBy", header: "Updated By", render: (r: ActivityRecord) => <span className="text-xs text-muted-foreground">{r.updatedBy}</span> },
    { key: "actions", header: "Actions", headerClassName: "w-20", render: (r: ActivityRecord) => (
      <div className="flex items-center gap-1">
        <button className="p-1 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
      </div>
    )},
  ];

  const absentColumns = [
    { key: "sno", header: "S.No", render: (r: AbsentRecord) => <span className="text-xs text-muted-foreground">{r.sno}</span> },
    { key: "date", header: "Date", render: (r: AbsentRecord) => <span className="text-xs text-muted-foreground">{r.date}</span> },
    { key: "employee", header: "Employee Name", render: (r: AbsentRecord) => <span className="text-sm font-medium">{r.employeeName}</span> },
    { key: "reason", header: "Reason", render: (r: AbsentRecord) => <span className="text-xs text-muted-foreground">{r.reason || "—"}</span> },
    { key: "updatedBy", header: "Updated By", render: (r: AbsentRecord) => <span className="text-xs text-muted-foreground">{r.updatedBy}</span> },
    { key: "actions", header: "Actions", headerClassName: "w-20", render: (r: AbsentRecord) => (
      <div className="flex items-center gap-1">
        <button className="p-1 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
        <button className="p-1 rounded hover:bg-muted"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
      </div>
    )},
  ];

  const filteredWork = workRecords.filter(r => {
    if (search && !r.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFilter !== "all" && r.date !== dateFilter) return false;
    return true;
  });

  const filteredOT = overtimeRecords.filter(r => {
    if (search && !r.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (shiftFilter !== "all" && r.shiftType !== shiftFilter) return false;
    return true;
  });

  const filteredAbsent = absentRecords.filter(r => {
    if (search && !r.employeeName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Employee Activity</h1>
          <p className="text-sm text-muted-foreground">Daily work plans, overtime, and attendance tracking</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="work-plan">Work Plan</TabsTrigger>
            <TabsTrigger value="overtime">Over Time</TabsTrigger>
            <TabsTrigger value="absent">Absent List</TabsTrigger>
          </TabsList>
          <button onClick={() => openAdd(activeTab === "overtime" ? "overtime" : activeTab === "absent" ? "absent" : "work")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by employee name..."
              className="w-full h-9 pl-9 pr-4 rounded-md border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          {activeTab === "work-plan" && (
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue placeholder="Filter by Date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="2026-03-22">22 Mar 2026</SelectItem>
                <SelectItem value="2026-03-21">21 Mar 2026</SelectItem>
              </SelectContent>
            </Select>
          )}
          {activeTab === "overtime" && (
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Shift" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="work-plan" className="mt-4">
          <DataTable data={filteredWork} columns={workColumns} rowKey={(r) => r.id} pageSize={10} showExport={false} />
        </TabsContent>

        <TabsContent value="overtime" className="mt-4">
          <DataTable data={filteredOT} columns={overtimeColumns} rowKey={(r) => r.id} pageSize={10} showExport={false} />
        </TabsContent>

        <TabsContent value="absent" className="mt-4">
          <DataTable data={filteredAbsent} columns={absentColumns} rowKey={(r) => r.id} pageSize={10} showExport={false} />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "work" ? "Add Daily Activity" : dialogType === "overtime" ? "Add Overtime Entry" : "Add Absent Record"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {dialogType !== "absent" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select defaultValue={dialogType === "overtime" ? "Over Time" : "Work Plan"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Work Plan">Work Plan</SelectItem>
                        <SelectItem value="Over Time">Over Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Date</Label><Input type="date" defaultValue="2026-03-22" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Shop Floor Section</Label>
                  <Select value={shopFloorSection} onValueChange={setShopFloorSection}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assembly Shop Floor">Assembly Shop Floor</SelectItem>
                      <SelectItem value="Machine Shop">Machine Shop</SelectItem>
                      <SelectItem value="Store and Purchase">Store and Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">{shopFloorSection} - Employee Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employee</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                        <SelectContent>{employees.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Job No</Label><Input placeholder="JOB-2024-XXX" /></div>
                    <div className="space-y-2"><Label>Tag No</Label><Input placeholder="HE-XXX" /></div>
                    {dialogType === "overtime" && (
                      <div className="space-y-2">
                        <Label>Shift Type</Label>
                        <Select><SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                          <SelectContent><SelectItem value="Day">Day</SelectItem><SelectItem value="Night">Night</SelectItem></SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2"><Label>Work Description</Label><Textarea placeholder="Describe the work..." rows={2} /></div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" defaultValue="2026-03-22" /></div>
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2"><Label>Reason (Optional)</Label><Input placeholder="Reason for absence" /></div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={() => setDialogOpen(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
            <button onClick={() => setDialogOpen(false)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90"><Save className="w-3.5 h-3.5" /> Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
