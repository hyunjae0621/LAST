// frontend/src/pages/DashboardPage.js

import { useEffect, useState } from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  CalendarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import StatsCard from '../components/dashboard/StatsCard';
import ClassList from '../components/dashboard/ClassList';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, classesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getTodayClasses()
        ]);

        const formattedStats = [
          { 
            id: 1, 
            name: '전체 수강생', 
            value: `${statsData.total_students}명`, 
            icon: UsersIcon, 
            color: 'bg-pink-500' 
          },
          { 
            id: 2, 
            name: '오늘의 수업', 
            value: `${statsData.todays_classes}개`, 
            icon: AcademicCapIcon, 
            color: 'bg-blue-500' 
          },
          { 
            id: 3, 
            name: '이번 달 신규 등록', 
            value: `${statsData.new_students}명`, 
            icon: CalendarIcon, 
            color: 'bg-green-500' 
          },
          { 
            id: 4, 
            name: '이번 달 매출', 
            value: `${statsData.monthly_revenue.toLocaleString()}원`, 
            icon: FireIcon, 
            color: 'bg-purple-500' 
          }
        ];

        setStats(formattedStats);
        setClasses(classesData);
        setError(null);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatsCard key={item.id} {...item} />
          ))}
        </div>

        <h2 className="mt-8 text-lg font-medium text-gray-900">오늘의 수업</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ClassList classes={classes} />
        </div>
      </div>
    </div>
  );
}