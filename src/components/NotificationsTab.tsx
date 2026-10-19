/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  Zap, 
  Percent,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsTabProps {
  userName?: string;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationsTab({
  userName,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationsTabProps) {
  const [activeTab, setActiveTab] = useState<'tumu' | 'okunmamis'>('tumu');

  const filteredNotifications = notifications.filter(not => {
    if (activeTab === 'okunmamis') return !not.isRead;
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return (
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'promo':
        return (
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        );
      case 'success':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full min-h-screen bg-light-custom text-dark-custom pb-24 animate-fade-in px-4 pt-4">
      
      {/* Header bar */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Bildirimler</h1>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1 block">Anlık Akış ve Kampanyalar</span>
        </div>
        
        {unreadCount > 0 && (
          <button 
            id="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            className="text-xs font-bold text-emerald-custom hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Tümünü Okundu Say
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 mb-4">
        <button
          onClick={() => setActiveTab('tumu')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tumu'
              ? 'border-emerald-custom text-emerald-custom font-extrabold'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Tümü ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('okunmamis')}
          className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'okunmamis'
              ? 'border-emerald-custom text-emerald-custom font-extrabold'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Okunmamış ({unreadCount})
        </button>
      </div>

      {/* Notification items list */}
      {filteredNotifications.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-800 text-sm">Hiç bildirim yok</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Seçtiğiniz görünüm filtresine uygun yeni bir bildirim akışı bulunamadı.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((not) => (
            <div 
              key={not.id}
              onClick={() => onMarkAsRead(not.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 relative ${
                not.isRead 
                  ? 'bg-white border-gray-100/50 opacity-80' 
                  : 'bg-[#EAF8F1] border-emerald-100/50 shadow-sm shadow-emerald-700/[0.02]'
              }`}
            >
              {/* Unread indicator circle */}
              {!not.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-custom" />
              )}

              {getNotificationIcon(not.type)}

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start pr-3">
                  <h4 className={`text-xs ${not.isRead ? 'font-bold text-gray-800' : 'font-extrabold text-gray-950'}`}>
                    {not.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[92%]">
                  {not.message}
                </p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[9px] text-gray-400 font-medium font-mono">
                    {not.timestamp}
                  </span>
                  
                  {!not.isRead && (
                    <span className="text-[9px] text-emerald-custom font-bold">
                      Okundu olarak işaretle
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional campaign widget */}
      <div className="mt-6 p-4 rounded-2xl bg-white border border-gray-200/50 flex items-center justify-between shadow-sm">
        <div className="space-y-1 flex-1 pr-3">
          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] uppercase tracking-wider">İlan</span>
          <h4 className="text-xs font-bold text-gray-900 mt-1">{userName || 'Sude'} hanım, Sınırları Aşın!</h4>
          <p className="text-[11px] text-gray-400 leading-snug">Uygulamadan rota oluştururken "Dengeli" modu kullanarak batarya pil ömrünüzü %15 uzatın.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#032F2E] flex items-center justify-center shrink-0 text-white">
          <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
        </div>
      </div>

    </div>
  );
}
