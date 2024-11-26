// frontend/src/components/subscriptions/SubscriptionForm.js

import { useState, useEffect } from 'react';
import { classService } from '../../services/classService';

export default function SubscriptionForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    student: '',
    dance_class: '',
    subscription_type: 'days',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    total_classes: '',
    remaining_classes: '',
    price_paid: '',
    payment_method: 'card',
    ...initialData
  });

  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getClasses({ status: 'active' });
        setClasses(response.results);
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'total_classes' && formData.subscription_type === 'counts') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        remaining_classes: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingClasses) {
    return <div>수업 목록을 불러오는 중...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                수강생 *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="student"
                  id="student"
                  required
                  value={formData.student}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="dance_class" className="block text-sm font-medium text-gray-700">
                수업 *
              </label>
              <div className="mt-1">
                <select
                  id="dance_class"
                  name="dance_class"
                  required
                  value={formData.dance_class}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">수업 선택</option>
                  {classes.map(classItem => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="subscription_type" className="block text-sm font-medium text-gray-700">
                수강권 종류 *
              </label>
              <div className="mt-1">
                <select
                  id="subscription_type"
                  name="subscription_type"
                  required
                  value={formData.subscription_type}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="days">기간제</option>
                  <option value="counts">횟수제</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                시작일 *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                종료일 *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {formData.subscription_type === 'counts' && (
              <div className="sm:col-span-3">
                <label htmlFor="total_classes" className="block text-sm font-medium text-gray-700">
                  전체 수업 횟수 *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="total_classes"
                    id="total_classes"
                    required
                    min="1"
                    value={formData.total_classes}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-3">
              <label htmlFor="price_paid" className="block text-sm font-medium text-gray-700">
                결제 금액 *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price_paid"
                  id="price_paid"
                  required
                  min="0"
                  value={formData.price_paid}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                결제 방법 *
              </label>
              <div className="mt-1">
                <select
                  id="payment_method"
                  name="payment_method"
                  required
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="card">카드</option>
                  <option value="cash">현금</option>
                  <option value="transfer">계좌이체</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? '처리중...' : (initialData ? '수정' : '등록')}
          </button>
        </div>
      </div>
    </form>
  );
}