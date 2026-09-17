import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchAnalyticsStart, fetchAnalyticsSuccess, fetchAnalyticsFailure } from "../state/adminAnalyticsSlice";
import { analyticsService } from "../services/analytics.service";
import { AnalyticsChart } from "../components/AnalyticsChart";
import { AdminLoader } from "../components/AdminLoader";

export const AdminAnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector((state) => state.adminAnalytics);

  useEffect(() => {
    const loadAnalytics = async () => {
      dispatch(fetchAnalyticsStart());
      try {
        const stats = await analyticsService.getAnalytics();
        dispatch(fetchAnalyticsSuccess(stats));
      } catch (err: any) {
        dispatch(fetchAnalyticsFailure(err.message));
      }
    };
    if (!data) {
      loadAnalytics();
    }
  }, [dispatch, data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-2">Detailed metrics and growth charts.</p>
      </div>

      {isLoading || !data ? (
        <AdminLoader />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsChart 
            title="User Growth (6 Months)" 
            data={data.userGrowth} 
            xKey="name" 
            yKey="users" 
            color="#8b5cf6" 
          />
          <AnalyticsChart 
            title="Weekly Post Activity" 
            data={data.postActivity} 
            xKey="name" 
            yKey="posts" 
            type="bar" 
            color="#ec4899" 
          />
        </div>
      )}
    </motion.div>
  );
};
