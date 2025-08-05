import { useState, useEffect } from 'react';
import { dashboardService, DashboardData } from '../services/dashboardService';

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      
      // Set fallback data in case of error
      setData({
        stats: {
          totalCourses: 0,
          activeStudents: 0,
          completionRate: 0,
          revenue: 0,
        },
        recentActivity: [],
        topCourses: [],
        upcomingEvents: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
  };
};