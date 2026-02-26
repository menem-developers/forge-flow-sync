import { useState, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  showExport?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  onRowClick,
  pageSize: defaultPageSize = 10,
  showExport = true,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const paged = useMemo(
    () => data.slice((page - 1) * perPage, page * perPage),
    [data, page, perPage]
  );

  const allKeys = paged.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = allKeys.some((k) => selected.has(k)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selected);
      allKeys.forEach((k) => next.delete(k));
      setSelected(next);
    } else {
      const next = new Set(selected);
      allKeys.forEach((k) => next.add(k));
      setSelected(next);
    }
  };

  const toggleOne = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  return (
    <div className="space-y-3">
      {/* Export bar */}
      {showExport && selected.size > 0 && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{selected.size} selected</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Selected
          </button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => {
                const key = rowKey(row);
                return (
                  <TableRow
                    key={key}
                    className={onRowClick ? "cursor-pointer" : ""}
                    onClick={() => onRowClick?.(row)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(key)}
                        onCheckedChange={() => toggleOne(key)}
                      />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Rows per page</span>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-2">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, data.length)} of {data.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page === 1} className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1.5 rounded hover:bg-muted disabled:opacity-40">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
