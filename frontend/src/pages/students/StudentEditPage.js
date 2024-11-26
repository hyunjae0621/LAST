// frontend/src/pages/students/StudentEditPage.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/students/StudentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(id);
        setStudent(data);
        setError(null);
      } catch (err) {
        setError('학생 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await studentService.updateStudent(id, formData);
      navigate(`/students/${id}`);
    } catch (err) {
      setError('학생 정보 수정에 실패했습니다.');
      console.error('Error updating student:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!student) return <ErrorAlert message="학생 정보를 찾을 수 없습니다." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">학생 정보 수정</h1>
          <p className="mt-1 text-sm text-gray-500">
            {student.username}님의 정보를 수정합니다.
          </p>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <StudentForm 
            initialData={student} 
            onSubmit={handleSubmit} 
            isLoading={saving}
          />
        </div>
      </div>
    </div>
  );
}