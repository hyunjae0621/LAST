// frontend/src/pages/attendance/MakeupClassPage.js

import { useState, useEffect, useCallback} from 'react';
import { attendanceService } from '../../services/attendanceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

export default function MakeupClassPage() {
  const [makeupClasses, setMakeupClasses] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchMakeupClasses = useCallback(async () => {
    try {
      setLoading(true);
      const params = status ? { status } : {};
      const response = await attendanceService.getMakeupList(params);
      setMakeupClasses(response.results);
      setError(null);
    } catch (err) {
      setError('보강 신청 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching makeup classes:', err);
    } finally {
      setLoading(false);
    }
  },[status]);

  useEffect(() => {
    fetchMakeupClasses();
  }, [fetchMakeupClasses]);


  const handleStatusUpdate = async (id, action) => {
    try {
      await attendanceService.updateMakeupStatus(id, action);
      fetchMakeupClasses();
    } catch (err) {
      setError('보강 상태 변경에 실패했습니다.');
      console.error('Error updating makeup status:', err);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">보강 관리</h1>
          <p className="mt-2 text-sm text-gray-700">
            보강 신청 현황을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">전체 상태</option>
          <option value="pending">대기</option>
          <option value="approved">승인</option>
          <option value="rejected">거절</option>
          <option value="completed">완료</option>
          <option value="cancelled">취소</option>
        </select>
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
                        원래 수업
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        보강 수업
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        상태
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {makeupClasses.map((makeup) => (
                      <tr key={makeup.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {makeup.student_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{makeup.original_class_name}</div>
                          <div className="text-xs text-gray-400">{makeup.original_date}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{makeup.makeup_class_name}</div>
                          <div className="text-xs text-gray-400">{makeup.makeup_date}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[makeup.status]}`}>
                            {makeup.status_display}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                          {makeup.status === 'pending' && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(makeup.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(makeup.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                거절
                              </button>
                            </div>
                          )}
                          {makeup.status === 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(makeup.id, 'complete')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              완료
                            </button>
                          )}
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