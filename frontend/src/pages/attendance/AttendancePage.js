// frontend/src/pages/attendance/AttendancePage.js

import { useState, useEffect, useCallback } from 'react';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  excused: 'bg-gray-100 text-gray-800',
  makeup: 'bg-blue-100 text-blue-800'
};

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);


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


    const fetchAttendance = useCallback(async () => {
      try {
        setLoading(true);
        const response = await attendanceService.getAttendanceList({
          class_id: selectedClass,
          date: selectedDate
        });
        setAttendanceData(response.results);
        setError(null);
      } catch (err) {
        setError('출석 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching attendance:', err);
      } finally {
        setLoading(false);
      }
    }, [selectedClass, selectedDate]);

    useEffect(() => {
      if (selectedClass && selectedDate) {
        fetchAttendance();
      }
    }, [selectedClass, selectedDate, fetchAttendance]);
    
    


  const handleAttendanceChange = async (studentId, status) => {
    try {
      setSaving(true);
      const data = {
        student: studentId,
        dance_class: selectedClass,
        date: selectedDate,
        status: status
      };
      
      let updatedAttendance;
      const existingAttendance = attendanceData.find(a => a.student === studentId);
      
      if (existingAttendance) {
        updatedAttendance = await attendanceService.updateAttendance(existingAttendance.id, data);
      } else {
        updatedAttendance = await attendanceService.createAttendance(data);
      }

      setAttendanceData(prev => {
        const index = prev.findIndex(a => a.student === studentId);
        if (index >= 0) {
          return [...prev.slice(0, index), updatedAttendance, ...prev.slice(index + 1)];
        }
        return [...prev, updatedAttendance];
      });

      setError(null);
    } catch (err) {
      setError('출석 상태 변경에 실패했습니다.');
      console.error('Error updating attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">출석 관리</h1>
          <p className="mt-2 text-sm text-gray-700">
            수업별 출석 현황을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-4">
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
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        수강생
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        출결 상태
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        최종 수정
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendanceData.map((attendance) => (
                      <tr key={attendance.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {attendance.student_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={attendance.status}
                            onChange={(e) => handleAttendanceChange(attendance.student, e.target.value)}
                            disabled={saving}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[attendance.status]}`}
                          >
                            <option value="present">출석</option>
                            <option value="absent">결석</option>
                            <option value="late">지각</option>
                            <option value="excused">사유결석</option>
                            <option value="makeup">보강</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(attendance.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}