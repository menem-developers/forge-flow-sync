import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "completed" | "pending" | "delayed" | "not-started" | "in-progress";
  children: ReactNode;
}

const statusClassMap: Record<StatusBadgeProps["status"], string> = {
  completed: "status-completed",
  pending: "status-pending",
  delayed: "status-delayed",
  "not-started": "status-not-started",
  "in-progress": "status-in-progress",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <span className={statusClassMap[status]}>{children}</span>;
}

interface PriorityBadgeProps {
  priority: "critical" | "high" | "medium" | "low";
}

const priorityConfig: Record<PriorityBadgeProps["priority"], { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive" },
  high: { label: "High", className: "bg-orange-100 text-orange-700" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  low: { label: "Low", className: "bg-primary/10 text-primary" },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
