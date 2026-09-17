import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchReportsStart, fetchReportsSuccess, fetchReportsFailure, updateReportStatus } from "../state/adminReportsSlice";
import { reportsService } from "../services/reports.service";
import { ReportsTable } from "../components/ReportsTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AdminLoader } from "../components/AdminLoader";
import { AdminReport } from "../types";

export const AdminReportsPage = () => {
  const dispatch = useAppDispatch();
  const { reports, isLoading, total } = useAppSelector((state) => state.adminReports);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const loadReports = async () => {
      dispatch(fetchReportsStart());
      try {
        const data = await reportsService.getReports(page, limit);
        dispatch(fetchReportsSuccess(data));
      } catch (err: any) {
        dispatch(fetchReportsFailure(err.message));
      }
    };
    loadReports();
  }, [dispatch, page]);

  const handleUpdateStatus = async (id: string, status: AdminReport['status']) => {
    await reportsService.updateStatus(id, status);
    dispatch(updateReportStatus({ id, status }));
  };

  const filteredReports = reports.filter(r => 
    r.reason.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Moderation</h1>
          <p className="text-muted-foreground mt-2">Manage user reports and flagged content.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reports..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <ReportsTable 
            reports={filteredReports} 
            onUpdateStatus={handleUpdateStatus} 
          />
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(total / limit)} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </motion.div>
  );
};
