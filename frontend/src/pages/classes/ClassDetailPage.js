// frontend/src/pages/classes/ClassDetailPage.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { CalendarIcon, ClockIcon, UserIcon, AcademicCapIcon, FireIcon } from '@heroicons/react/24/outline';

const WEEKDAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classDetails, studentsList] = await Promise.all([
          classService.getClassById(id),
          classService.getClassStudents(id)
        ]);
        setClassData(classDetails);
        setStudents(studentsList);
        setError(null);
      } catch (err) {
        setError('수업 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching class details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!classData) return <ErrorAlert message="수업 정보를 찾을 수 없습니다." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                      {classData.name}
                    </h1>
                    <span
                      className={`ml-4 inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                        classData.status === 'active' ? 'bg-green-100 text-green-800' :
                        classData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {classData.status_display}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      강사: {classData.instructor.username}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      {classData.difficulty_display}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FireIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      월 {classData.price_per_month.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                목록으로
              </button>
              <button
                type="button"
                onClick={() => navigate(`/classes/${id}/edit`)}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 수업 정보 */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">수업 정보</h2>
            <div className="mt-4">
              <div className="space-y-4">
                {classData.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">수업 설명</h3>
                    <p className="mt-1 text-sm text-gray-900">{classData.description}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">정원</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {classData.current_students_count}/{classData.capacity}명
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수업 일정 */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">수업 일정</h2>
            <div className="mt-4 space-y-4">
              {classData.schedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-900">{WEEKDAYS[schedule.weekday]}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-900">
                      {schedule.start_time} ~ {schedule.end_time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{schedule.room}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 수강생 목록 */}
        <div className="lg:col-span-2 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">수강생 목록</h2>
            <div className="mt-4">
              {students.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <li key={student.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                            <span className="text-lg font-medium leading-none text-white">
                              {student.username.charAt(0)}
                            </span>
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.username}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(student.start_date).toLocaleDateString()} ~ {new Date(student.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-900"
                      >
                        상세보기
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">현재 수강중인 학생이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}