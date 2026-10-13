import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionApi } from '../api/sessionApi';
import { bookingApi } from '../api/bookingApi';
import { ActiveSessionsTab } from '../components/dashboard/ActiveSessionsTab';
import { IncomingRequestsTab } from '../components/dashboard/IncomingRequestsTab';
import { SentRequestsTab } from '../components/dashboard/SentRequestsTab';
import { CompletedHistoryTab } from '../components/dashboard/CompletedHistoryTab';
import { Spinner } from '../components/common/Spinner';
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Send,
  History,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(true);

  const [mySessions, setMySessions] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sessionsRes, incomingRes, sentRes] = await Promise.all([
        sessionApi.getMySessions(),
        bookingApi.getIncomingRequests(),
        bookingApi.getMyRequests(),
      ]);

      setMySessions(sessionsRes.data?.sessions || []);
      setIncomingRequests(incomingRes.data?.bookings || []);
      setSentRequests(sentRes.data?.bookings || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived metrics
  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'Pending').length;
  const completedSessions = mySessions.filter((s) => s.status === 'Completed');
  const acceptedBookings = sentRequests.filter((b) => b.status === 'Accepted');

  const tabs = [
    {
      id: 'sessions',
      label: 'My Offerings',
      icon: Calendar,
      count: mySessions.length,
    },
    {
      id: 'incoming',
      label: 'Incoming Requests',
      icon: Inbox,
      count: pendingIncomingCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'sent',
      label: 'My Sent Requests',
      icon: Send,
      count: sentRequests.length,
    },
    {
      id: 'history',
      label: 'Completed History',
      icon: History,
      count: completedSessions.length + acceptedBookings.length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`
            }
            alt={user?.name}
            className="h-16 w-16 rounded-2xl border-2 border-indigo-100 object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {user?.name}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                <Sparkles className="h-3 w-3" /> Student
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              {user?.department || 'General Studies'} • {user?.email}
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <p className="text-base font-extrabold text-slate-900">{mySessions.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Offered</p>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <p className="text-base font-extrabold text-amber-600">{pendingIncomingCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pending</p>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
            <p className="text-base font-extrabold text-emerald-600">
              {completedSessions.length + acceptedBookings.length}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Completed</p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      tab.badgeColor || (isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      {isLoading ? (
        <div className="py-16 text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-xs text-slate-400">Loading dashboard records...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'sessions' && (
            <ActiveSessionsTab sessions={mySessions} onRefresh={loadDashboardData} />
          )}

          {activeTab === 'incoming' && (
            <IncomingRequestsTab requests={incomingRequests} onRefresh={loadDashboardData} />
          )}

          {activeTab === 'sent' && (
            <SentRequestsTab requests={sentRequests} onRefresh={loadDashboardData} />
          )}

          {activeTab === 'history' && (
            <CompletedHistoryTab
              completedSessions={completedSessions}
              acceptedBookings={acceptedBookings}
            />
          )}
        </div>
      )}
    </div>
  );
};
