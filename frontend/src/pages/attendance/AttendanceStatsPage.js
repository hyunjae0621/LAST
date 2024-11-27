// frontend/src/pages/attendance/AttendanceStatsPage.js
import React, { useState, useEffect } from 'react';
import { attendanceStatsService } from '../../services/attendanceStatsService';
import { classService } from '../../services/classService';
import AttendanceStatsCard from '../../components/attendance/AttendanceStatsCard';
import AttendanceChart from '../../components/attendance/AttendanceChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function AttendanceStatsPage() {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // 수업 목록 조회
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getClasses({ status: 'active' });
        setClasses(response.results);
        if (response.results.length > 0) {
          setSelectedClass(response.results[0].id.toString());
        }
      } catch (err) {
        setError('수업 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  // 통계 데이터 조회
  useEffect(() => {

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await attendanceStatsService.getClassStats(
        selectedClass,
        dateRange.startDate,
        dateRange.endDate
      );
      setStats(response);
      setError(null);
    } catch (err) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching attendance stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedClass) {
    fetchStats();
  }
}, [selectedClass, dateRange]);


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">출석 통계</h1>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>

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

        {stats && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AttendanceStatsCard
              title="종합 통계"
              stats={{
                attendance_rate: stats.overall_stats.average_attendance,
                total_classes: stats.overall_stats.total_classes,
                total_students: stats.overall_stats.total_students,
                ...stats.overall_stats
              }}
            />
            <AttendanceChart data={stats.daily_stats} />
          </div>
        )}
      </div>
    </div>
  );
}