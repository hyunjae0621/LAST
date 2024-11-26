// frontend/src/pages/students/StudentCreatePage.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/students/StudentForm';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await studentService.createStudent(formData);
      navigate('/students');
    } catch (err) {
      setError('학생 등록에 실패했습니다.');
      console.error('Error creating student:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">학생 등록</h1>
          <p className="mt-1 text-sm text-gray-500">
            새로운 학생을 등록합니다.
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <StudentForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}