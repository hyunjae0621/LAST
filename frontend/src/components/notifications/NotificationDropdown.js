// frontend/src/components/notifications/NotificationDropdown.jsx
import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { webSocketService } from '../../services/websocket';
import NotificationBadge from './NotificationBadge';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
    };

    webSocketService.addHandler(handleNotification);
    webSocketService.connect();

    return () => {
      webSocketService.removeHandler(handleNotification);
    };
  }, []);

  const handleRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="h-6 w-6 text-gray-500" />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">알림</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                새로운 알림이 없습니다
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleRead(notification.id)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <a
                href="/notifications"
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                모든 알림 보기
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}