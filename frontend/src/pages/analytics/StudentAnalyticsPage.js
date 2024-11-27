// frontend/src/pages/analytics/StudentAnalyticsPage.js
import React, { useState, useEffect } from 'react';
import { studentAnalyticsService } from '../../services/studentAnalyticsService';
import EnrollmentTrendsChart from '../../components/analytics/EnrollmentTrendsChart';
import RetentionHeatmap from '../../components/analytics/RetentionHeatmap';
import ClassPreferencesChart from '../../components/analytics/ClassPreferencesChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function StudentAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    enrollmentTrends: null,
    retentionData: null,
    classPreferences: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [enrollmentTrends, retentionData, classPreferences] = await Promise.all([
        studentAnalyticsService.getEnrollmentTrends(
          dateRange.startDate,
          dateRange.endDate
        ),
        studentAnalyticsService.getRetentionAnalysis(6),
        studentAnalyticsService.getClassPreferences()
      ]);
      
      setAnalyticsData({
        enrollmentTrends,
        retentionData,
        classPreferences
      });
      setError(null);
    } catch (err) {
      setError('분석 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchAnalytics();
}, [dateRange]);


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">수강생 분석</h1>
        
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

        <div className="mt-6 space-y-6">
          <EnrollmentTrendsChart data={analyticsData.enrollmentTrends.monthly_signups} />
          <RetentionHeatmap data={analyticsData.retentionData} />
          <ClassPreferencesChart data={analyticsData.classPreferences.class_preferences} />
        </div>
      </div>
    </div>
  );
}