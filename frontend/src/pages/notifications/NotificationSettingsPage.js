// frontend/src/pages/notifications/NotificationSettingsPage.js
import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    email_notification: true,
    subscription_expiry: true,
    class_reminder: true,
    pause_status: true,
    makeup_status: true,
    announcement: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getSettings();
      setSettings(response);
      setError(null);
    } catch (err) {
      setError('설정을 불러오는데 실패했습니다.');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await notificationService.updateSettings(settings);
      setError(null);
    } catch (err) {
      setError('설정 저장에 실패했습니다.');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">알림 설정</h1>

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_notification"
                    name="email_notification"
                    type="checkbox"
                    checked={settings.email_notification}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="email_notification" className="font-medium text-gray-700">
                    이메일 알림 수신
                  </label>
                  <p className="text-sm text-gray-500">
                    중요 알림을 이메일로도 받아보실 수 있습니다.
                  </p>
                </div>
              </div>

              {[
                { id: 'subscription_expiry', label: '수강권 만료 알림', description: '수강권 만료 7일 전에 알림을 받습니다.' },
                { id: 'class_reminder', label: '수업 알림', description: '수업 시작 전에 알림을 받습니다.' },
                { id: 'pause_status', label: '일시정지 상태 알림', description: '수강권 일시정지 상태가 변경되면 알림을 받습니다.' },
                { id: 'makeup_status', label: '보강 상태 알림', description: '보강 신청 상태가 변경되면 알림을 받습니다.' },
                { id: 'announcement', label: '공지사항 알림', description: '새로운 공지사항이 등록되면 알림을 받습니다.' }
              ].map(setting => (
                <div key={setting.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={setting.id}
                      name={setting.id}
                      type="checkbox"
                      checked={settings[setting.id]}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor={setting.id} className="font-medium text-gray-700">
                      {setting.label}
                    </label>
                    <p className="text-sm text-gray-500">
                      {setting.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {saving ? '저장 중...' : '설정 저장'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}