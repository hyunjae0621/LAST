// frontend/src/pages/subscriptions/SubscriptionEditPage.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../../services/subscriptionService';
import SubscriptionForm from '../../components/subscriptions/SubscriptionForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function SubscriptionEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await subscriptionService.getSubscriptionById(id);
        setSubscription(data);
        setError(null);
      } catch (err) {
        setError('수강권 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await subscriptionService.updateSubscription(id, formData);
      navigate(`/subscriptions/${id}`);
    } catch (err) {
      setError('수강권 정보 수정에 실패했습니다.');
      console.error('Error updating subscription:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!subscription) return <ErrorAlert message="수강권 정보를 찾을 수 없습니다." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수강권 수정</h1>
          <p className="mt-1 text-sm text-gray-500">
            {subscription.student_name}의 수강권 정보를 수정합니다.
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <SubscriptionForm 
            initialData={subscription}
            onSubmit={handleSubmit}
            isLoading={saving}
          />
        </div>
      </div>
    </div>
  );
}