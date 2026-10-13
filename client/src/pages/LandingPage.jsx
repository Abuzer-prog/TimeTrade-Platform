import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Compass,
  PlusCircle,
  Users,
  Sparkles,
  BookOpen,
  Code2,
  Presentation,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { sessionApi } from '../api/sessionApi';
import { SessionCard } from '../components/sessions/SessionCard';
import { RequestModal } from '../components/sessions/RequestModal';

export const LandingPage = () => {
  const [featuredSessions, setFeaturedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeasers = async () => {
      try {
        const res = await sessionApi.getMarketplaceSessions({ limit: 3, status: 'Open' });
        setFeaturedSessions(res.data?.sessions || []);
      } catch (err) {
        console.error('Failed to fetch featured sessions', err);
      }
    };
    fetchTeasers();
  }, []);

  const handleOpenRequest = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Peer-to-Peer Time Banking for University Students</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Trade Time. Share Skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
              Master Every Semester.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need help debugging code, preparing capstone presentation slides, or reviewing handwritten lecture notes?
            Exchange equal blocks of your time with fellow students without exchanging money.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              <Compass className="h-4 w-4" />
              Browse Active Sessions
            </Link>
            <Link
              to="/sessions/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all hover:-translate-y-0.5"
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              Offer Your Time & Skills
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Free Student Time Exchange</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">5+</p>
              <p className="text-xs text-slate-500 font-medium">Study Categories</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">Two-Sided</p>
              <p className="text-xs text-slate-500 font-medium">Slot Request State Machine</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">JWT Auth</p>
              <p className="text-xs text-slate-500 font-medium">Protected Role-Based Actions</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works 3-step cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How TimeTrade Works
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A seamless three-step reciprocal learning loop designed for campus peer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Offer a Time Slot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Post what you are proficient at—whether reviewing Semester 5 theory notes, React hooks debugging, or speaking feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Request & Connect</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse slots offered by classmates across departments. Send a request note stating your learning goals or exchange trade.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Accept & Learn</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hosts accept requests in their dashboard, marking the slot Booked. Meet up, exchange skills, and build your peer network.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sessions Teaser */}
      {featuredSessions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Active Open Sessions
              </h2>
              <p className="text-xs text-slate-500">Live offerings from peers currently available for trade</p>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onRequestSlot={handleOpenRequest}
              />
            ))}
          </div>
        </section>
      )}

      {/* Request Modal */}
      <RequestModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};
