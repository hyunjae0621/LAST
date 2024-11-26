// frontend/src/pages/subscriptions/SubscriptionListPage.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../../services/subscriptionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

export default function SubscriptionListPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: status || undefined
      };
      const response = await subscriptionService.getSubscriptions(params);
      setSubscriptions(response.results);
      setError(null);
    } catch (err) {
      setError('수강권 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, status]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">수강권 관리</h1>
          <p className="mt-2 text-sm text-gray-700">
            수강생들의 수강권 현황을 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate('/subscriptions/new')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            수강권 등록
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="수강생 이름, 수업명으로 검색..."
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">모든 상태</option>
          <option value="active">이용중</option>
          <option value="paused">일시정지</option>
          <option value="expired">만료</option>
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
                        수업
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        종류/기간
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        잔여
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
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {subscription.student_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {subscription.class_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{subscription.subscription_type_display}</div>
                          <div className="text-xs text-gray-400">
                            {subscription.start_date} ~ {subscription.end_date}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {subscription.subscription_type === 'days' ? (
                            `${subscription.days_remaining}일`
                          ) : (
                            `${subscription.remaining_classes}회`
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[subscription.status]}`}>
                            {subscription.status_display}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => navigate(`/subscriptions/${subscription.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            상세보기
                          </button>
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