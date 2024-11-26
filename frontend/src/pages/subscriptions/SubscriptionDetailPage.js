// frontend/src/pages/subscriptions/SubscriptionDetailPage.js

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../../services/subscriptionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

export default function SubscriptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptionById(id);
      setSubscription(data);
      setError(null);
    } catch (err) {
      setError('수강권 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handlePause = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await subscriptionService.pauseSubscription(id, {
        start_date: today,
        end_date: today, // 임시로 당일로 설정
        reason: '일시정지 신청'
      });
      fetchSubscription();
    } catch (err) {
      setError('일시정지 처리에 실패했습니다.');
      console.error('Error pausing subscription:', err);
    }
  };

  const handleResume = async () => {
    try {
      await subscriptionService.resumeSubscription(id);
      fetchSubscription();
    } catch (err) {
      setError('재개 처리에 실패했습니다.');
      console.error('Error resuming subscription:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!subscription) return <ErrorAlert message="수강권 정보를 찾을 수 없습니다." />;

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
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                      {subscription.student_name}의 수강권
                    </h1>
                    <span className={`ml-4 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[subscription.status]}`}>
                      {subscription.status_display}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      {subscription.class_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => navigate('/subscriptions')}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                목록으로
              </button>
              {subscription.status === 'active' && (
                <button
                  type="button"
                  onClick={handlePause}
                  className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  일시정지
                </button>
              )}
              {subscription.status === 'paused' && (
                <button
                  type="button"
                  onClick={handleResume}
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  수강 재개
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(`/subscriptions/${id}/edit`)}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 기본 정보 */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">수강권 정보</h2>
            <div className="mt-4">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">수강권 종류</dt>
                  <dd className="mt-1 text-sm text-gray-900">{subscription.subscription_type_display}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">기간</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {subscription.start_date} ~ {subscription.end_date}
                  </dd>
                </div>
                {subscription.subscription_type === 'counts' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">전체 수업 횟수</dt>
                      <dd className="mt-1 text-sm text-gray-900">{subscription.total_classes}회</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">남은 수업 횟수</dt>
                      <dd className="mt-1 text-sm text-gray-900">{subscription.remaining_classes}회</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">결제 금액</dt>
                  <dd className="mt-1 text-sm text-gray-900">{subscription.price_paid.toLocaleString()}원</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">결제 방법</dt>
                  <dd className="mt-1 text-sm text-gray-900">{subscription.payment_method}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* 일시정지 기록 */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">일시정지 기록</h2>
            <div className="mt-4">
              {subscription.pauses?.length > 0 ? (
                <div className="flow-root">
                  <div className="-mx-4 -my-2">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                              시작일
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              종료일
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              사유
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {subscription.pauses.map((pause, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                {pause.start_date}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {pause.end_date}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {pause.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">일시정지 기록이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}