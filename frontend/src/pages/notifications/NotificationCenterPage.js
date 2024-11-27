// frontend/src/pages/notifications/NotificationCenterPage.js
import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.results);
      setError(null);
    } catch (err) {
      setError('알림을 불러오는데 실패했습니다.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">알림 센터</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <li className="px-4 py-5">
                <p className="text-center text-gray-500">새로운 알림이 없습니다.</p>
              </li>
            ) : (
              notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`px-4 py-5 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.read ? '읽음' : '읽지 않음'}
                        </span>
                        <span className="ml-2 text-gray-500">
                          {notification.type_display}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 text-sm text-primary-600 hover:text-primary-800"
                      >
                        읽음 표시
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}