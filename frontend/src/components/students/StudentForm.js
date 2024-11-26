// frontend/src/components/students/StudentForm.js

import { useState } from 'react';

export default function StudentForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    profile: {
      gender: 'M',
      birth_date: '',
      emergency_contact: '',
      address: '',
      note: ''
    },
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              기본 정보
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              학생의 기본적인 정보를 입력해주세요.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                이름 *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                연락처 *
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {!initialData && (
              <div className="sm:col-span-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호 *
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required={!initialData}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              추가 정보
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              학생의 상세 정보를 입력해주세요.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="profile.gender" className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="mt-1">
                <select
                  name="profile.gender"
                  id="profile.gender"
                  value={formData.profile.gender}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile.birth_date" className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="profile.birth_date"
                  id="profile.birth_date"
                  value={formData.profile.birth_date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="profile.emergency_contact" className="block text-sm font-medium text-gray-700">
                비상연락처
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="profile.emergency_contact"
                  id="profile.emergency_contact"
                  value={formData.profile.emergency_contact}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="profile.address" className="block text-sm font-medium text-gray-700">
                주소
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="profile.address"
                  id="profile.address"
                  value={formData.profile.address}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="profile.note" className="block text-sm font-medium text-gray-700">
                특이사항
              </label>
              <div className="mt-1">
                <textarea
                  name="profile.note"
                  id="profile.note"
                  rows={3}
                  value={formData.profile.note}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
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