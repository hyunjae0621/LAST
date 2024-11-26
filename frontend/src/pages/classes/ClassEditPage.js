// frontend/src/pages/classes/ClassEditPage.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import ClassForm from '../../components/classes/ClassForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function ClassEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await classService.getClassById(id);
        setClassData(data);
        setError(null);
      } catch (err) {
        setError('수업 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching class:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await classService.updateClass(id, formData);
      navigate(`/classes/${id}`);
    } catch (err) {
      setError('수업 정보 수정에 실패했습니다.');
      console.error('Error updating class:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!classData) return <ErrorAlert message="수업 정보를 찾을 수 없습니다." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수업 정보 수정</h1>
          <p className="mt-1 text-sm text-gray-500">
            {classData.name} 수업의 정보를 수정합니다.
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <ClassForm
            initialData={classData}
            onSubmit={handleSubmit}
            isLoading={saving}
          />
        </div>
      </div>
    </div>
  );
}