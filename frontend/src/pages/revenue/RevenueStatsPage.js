// frontend/src/pages/revenue/RevenueStatsPage.js
import React, { useState, useEffect } from 'react';
import { revenueStatsService } from '../../services/revenueStatsService';
import RevenueChart from '../../components/revenue/RevenueChart';
import RevenueSummaryCard from '../../components/revenue/RevenueSummaryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function RevenueStatsPage() {
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [summaryData, monthlyData] = await Promise.all([
        revenueStatsService.getRevenueSummary(
          dateRange.startDate,
          dateRange.endDate
        ),
        revenueStatsService.getMonthlyRevenue()
      ]);
      
      setSummary(summaryData);
      setMonthlyData(monthlyData);
      setError(null);
    } catch (err) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching revenue stats:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, [dateRange]);


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">매출 통계</h1>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        {summary && monthlyData && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RevenueSummaryCard
              title="매출 요약"
              stats={summary}
            />
            <RevenueChart data={monthlyData} />
          </div>
        )}
      </div>
    </div>
  );
}