// frontend/src/components/classes/ClassForm.js

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ClassForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    description: '',
    difficulty: 'beginner',
    capacity: 20,
    price_per_month: 100000,
    status: 'pending',
    schedules: [
      {
        weekday: 0,
        start_time: '09:00',
        end_time: '10:30',
        room: '메인 연습실'
      }
    ],
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        {
          weekday: 0,
          start_time: '09:00',
          end_time: '10:30',
          room: '메인 연습실'
        }
      ]
    }));
  };

  const removeSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              기본 정보
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              수업의 기본적인 정보를 입력해주세요.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                수업명 *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                강사 *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="instructor"
                  id="instructor"
                  required
                  value={formData.instructor}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                수업 설명
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                난이도 *
              </label>
              <div className="mt-1">
                <select
                  id="difficulty"
                  name="difficulty"
                  required
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                정원 *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="capacity"
                  id="capacity"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price_per_month" className="block text-sm font-medium text-gray-700">
                월 수강료 *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="price_per_month"
                  id="price_per_month"
                  required
                  min="0"
                  step="10000"
                  value={formData.price_per_month}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              수업 일정
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              수업 시간과 강의실을 입력해주세요.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {formData.schedules.map((schedule, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-36">
                  <label htmlFor={`weekday-${index}`} className="block text-sm font-medium text-gray-700">
                    요일 *
                  </label>
                  <select
                    id={`weekday-${index}`}
                    value={schedule.weekday}
                    onChange={(e) => handleScheduleChange(index, 'weekday', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value={0}>월요일</option>
                    <option value={1}>화요일</option>
                    <option value={2}>수요일</option>
                    <option value={3}>목요일</option>
                    <option value={4}>금요일</option>
                    <option value={5}>토요일</option>
                    <option value={6}>일요일</option>
                  </select>
                </div>

                <div className="w-32">
                  <label htmlFor={`start_time-${index}`} className="block text-sm font-medium text-gray-700">
                    시작 시간 *
                  </label>
                  <input
                    type="time"
                    id={`start_time-${index}`}
                    value={schedule.start_time}
                    onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div className="w-32">
                  <label htmlFor={`end_time-${index}`} className="block text-sm font-medium text-gray-700">
                    종료 시간 *
                  </label>
                  <input
                    type="time"
                    id={`end_time-${index}`}
                    value={schedule.end_time}
                    onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor={`room-${index}`} className="block text-sm font-medium text-gray-700">
                    강의실 *
                  </label>
                  <input
                    type="text"
                    id={`room-${index}`}
                    value={schedule.room}
                    onChange={(e) => handleScheduleChange(index, 'room', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                {formData.schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="mt-6 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              일정 추가
            </button>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              수업 상태
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              현재 수업의 운영 상태를 선택해주세요.
            </p>
          </div>

          <div className="mt-6">
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="pending">준비중</option>
              <option value="active">운영중</option>
              <option value="closed">종료</option>
            </select>
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