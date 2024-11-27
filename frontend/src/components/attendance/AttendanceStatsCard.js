// frontend/src/components/attendance/AttendanceStatsCard.js
import React from 'react';

export default function AttendanceStatsCard({ title, stats }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'excused': return 'bg-gray-100 text-gray-800';
      case 'makeup': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">출석률</span>
            <span className="text-lg font-medium text-primary-600">
              {stats.attendance_rate?.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${stats.attendance_rate || 0}%` }}
            />
          </div>
        </div>

        {[
          { key: 'present_count', label: '출석', status: 'present' },
          { key: 'late_count', label: '지각', status: 'late' },
          { key: 'absent_count', label: '결석', status: 'absent' },
          { key: 'excused_count', label: '사유결석', status: 'excused' },
          { key: 'makeup_count', label: '보강', status: 'makeup' },
        ].map(({ key, label, status }) => (
          <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {stats[key] || 0}회
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}