// frontend/src/pages/classes/ClassCreatePage.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import ClassForm from '../../components/classes/ClassForm';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function ClassCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await classService.createClass(formData);
      navigate('/classes');
    } catch (err) {
      setError('수업 등록에 실패했습니다.');
      console.error('Error creating class:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수업 등록</h1>
          <p className="mt-1 text-sm text-gray-500">
            새로운 수업을 등록합니다.
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <ClassForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}