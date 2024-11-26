// frontend/src/pages/students/StudentDetailPage.js

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  { name: '기본 정보', href: '#info' },
  { name: '수강권', href: '#subscriptions' },
  { name: '출석 기록', href: '#attendance' },
];

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('#info');
  const [student, setStudent] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profile = student?.profile || {};

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentData, subscriptionsData, attendanceData] =
        await Promise.all([
          studentService.getStudentById(id),
          studentService.getStudentSubscriptions(id),
          studentService.getStudentAttendance(id),
        ]);
      setStudent(studentData);
      setSubscriptions(subscriptionsData);
      setAttendance(attendanceData);
      setError(null);
    } catch (err) {
      setError('학생 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudentData();
  }, [id, fetchStudentData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!student) return <ErrorAlert message="학생 정보를 찾을 수 없습니다." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <UserIcon
                      className="h-10 w-10 text-gray-500"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                    {student.username}
                  </h1>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <PhoneIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      {student.phone_number}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      가입일:{' '}
                      {profile.join_date
                        ? new Date(profile.join_date).toLocaleDateString()
                        : '-'}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      최근 방문:{' '}
                      {profile.last_visit
                        ? new Date(profile.last_visit).toLocaleString()
                        : '없음'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => navigate('/students')}
              >
                목록으로
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
                onClick={() => navigate(`/students/${id}/edit`)}
              >
                정보 수정
              </button>
            </div>
          </div>
          <div className="mt-1">
            <div className="sm:hidden">
              <select
                className="block w-full rounded-md border-gray-300"
                value={currentTab}
                onChange={(e) => setCurrentTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.href} value={tab.href}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.href}
                    className={`${
                      currentTab === tab.href
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setCurrentTab(tab.href)}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mt-8">
        {currentTab === '#info' && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">이메일</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.email || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">성별</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.profile.gender === 'M' ? '남성' : '여성'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    생년월일
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.profile.birth_date || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    비상연락처
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.profile.emergency_contact || '-'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">주소</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.profile.address || '-'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    특이사항
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {student.profile.note || '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {currentTab === '#subscriptions' && (
          <div className="bg-white shadow sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <li key={subscription.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-600">
                        {subscription.dance_class}
                      </p>
                      <p className="text-sm text-gray-500">
                        {subscription.subscription_type === 'days'
                          ? '기간제'
                          : '횟수제'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-500">
                        {subscription.start_date} ~ {subscription.end_date}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            subscription.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {subscription.status === 'active' ? '이용중' : '만료'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {subscriptions.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">
                수강권 정보가 없습니다.
              </p>
            )}
          </div>
        )}

        {currentTab === '#attendance' && (
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수업
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    메모
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.dance_class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {record.status === 'present'
                          ? '출석'
                          : record.status === 'absent'
                          ? '결석'
                          : '지각'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.memo || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendance.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">
                출석 기록이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
