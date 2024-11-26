// frontend/src/pages/DashboardPage.js

import React from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  CalendarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: '전체 수강생', value: '24명', icon: UsersIcon, color: 'bg-pink-500' },
  { id: 2, name: '오늘의 수업', value: '8개', icon: AcademicCapIcon, color: 'bg-blue-500' },
  { id: 3, name: '이번 달 신규 등록', value: '12명', icon: CalendarIcon, color: 'bg-green-500' },
  { id: 4, name: '이번 달 매출', value: '2,450,000원', icon: FireIcon, color: 'bg-purple-500' },
];

const recentClasses = [
  { name: '방송댄스 초급', time: '09:00 - 10:30', instructor: '김강사', attendees: '15/20' },
  { name: '재즈댄스 중급', time: '11:00 - 12:30', instructor: '이강사', attendees: '12/15' },
  { name: '힙합 기초', time: '14:00 - 15:30', instructor: '박강사', attendees: '18/20' },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md ${item.color} p-3`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          ))}
        </div>

        {/* Today's Classes */}
        <h2 className="mt-8 text-lg font-medium text-gray-900">오늘의 수업</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul className="divide-y divide-gray-200">
            {recentClasses.map((classItem, index) => (
              <li key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-500">
                      {classItem.time} | 강사: {classItem.instructor}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                      {classItem.attendees}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}