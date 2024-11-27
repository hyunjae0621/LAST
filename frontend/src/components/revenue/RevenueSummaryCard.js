// frontend/src/components/revenue/RevenueSummaryCard.js
import React from 'react';

export default function RevenueSummaryCard({ title, stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">총 매출</p>
          <p className="text-2xl font-semibold text-primary-600">
            {formatCurrency(stats.total_revenue)}
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">총 수강권 수</p>
          <p className="text-2xl font-semibold text-primary-600">
            {stats.total_subscriptions}개
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">평균 수강료</p>
          <p className="text-2xl font-semibold text-primary-600">
            {formatCurrency(stats.avg_price)}
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">활성 수강권</p>
          <p className="text-2xl font-semibold text-primary-600">
            {stats.active_subscriptions}개
          </p>
        </div>
      </div>

      {stats.subscription_types && stats.subscription_types.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">유형별 매출</h4>
          <div className="space-y-2">
            {stats.subscription_types.map((type) => (
              <div key={type.subscription_type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-500">
                  {type.subscription_type === 'days' ? '기간제' : '횟수제'}
                </span>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(type.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {type.count}개
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}