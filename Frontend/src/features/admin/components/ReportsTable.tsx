import { AdminReport } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface ReportsTableProps {
  reports: AdminReport[];
  onUpdateStatus: (id: string, status: AdminReport['status']) => void;
}

export const ReportsTable = ({ reports, onUpdateStatus }: ReportsTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Reason</th>
              <th className="px-6 py-4 font-medium">Target</th>
              <th className="px-6 py-4 font-medium">Reporter</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{report.reason}</div>
                  <div className="text-xs text-muted-foreground">{new Date(report.createdDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <span className="font-semibold text-foreground mr-2">{report.targetType}</span>
                  <span className="text-xs">ID: {report.targetId}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  @{report.reporter.username}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    report.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                    report.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {report.status !== 'RESOLVED' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(report.id, 'RESOLVED')} className="text-emerald-500">
                          <Check className="h-4 w-4 mr-2" /> Mark Resolved
                        </DropdownMenuItem>
                      )}
                      {report.status !== 'REJECTED' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(report.id, 'REJECTED')} className="text-destructive">
                          <X className="h-4 w-4 mr-2" /> Reject Report
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
