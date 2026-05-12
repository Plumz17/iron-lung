/**
 * @module  Notification
 * @desc    Daftar Notifikasi — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NotificationListProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80">
        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-slate-700">Tidak ada notifikasi</h3>
        <p className="mt-1 text-xs text-slate-500">Anda akan mendapat pemberitahuan di sini untuk aktivitas penting.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
      {notifications.map((notif) => {
        const isUnread = notif.read_at === null;
        return (
          <div
            key={notif.id}
            className={`flex items-start gap-3 p-4 transition-colors duration-100 ${
              isUnread ? 'bg-indigo-50/40' : 'bg-white hover:bg-slate-50/50'
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isUnread ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                {notif.data.title}
              </p>
              <p className={`text-sm mt-0.5 ${isUnread ? 'text-slate-700' : 'text-slate-500'}`}>
                {notif.data.message}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {new Date(notif.created_at).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
              {isUnread && (
                <button
                  onClick={() => onMarkAsRead(notif.id)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Tandai dibaca
                </button>
              )}
              {notif.data.link && (
                <Link href={notif.data.link} className="text-xs text-slate-500 hover:text-slate-700 underline transition-colors">
                  Lihat
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
