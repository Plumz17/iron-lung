/**
 * @module  UI
 * @desc    LoadingUI Skeleton — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

import React from 'react';

export default function LoadingUI() {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 bg-slate-950 flex-col">
        <div className="h-16 border-b border-slate-800/60 flex items-center gap-3 px-5">
          <div className="h-8 w-8 bg-slate-800 rounded-lg animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="p-3 space-y-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-full bg-slate-800/60 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 glass border-b border-slate-200/60 flex items-center justify-end px-6 gap-3">
          <div className="h-5 w-5 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-7 w-7 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 p-6">
          <div className="h-6 w-44 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white border border-slate-200/80 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
