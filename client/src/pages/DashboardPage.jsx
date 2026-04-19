import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  BookOpen, RefreshCw, MessageSquare, User,
  Flame, TrendingUp, ArrowUpRight, Zap,
  Bell, Calendar, ChevronRight
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ exchanges: 0, streak: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [exRes, profileRes] = await Promise.all([
          api.get('/exchanges'),
          user ? api.get(`/users/${user.id}/profile`) : Promise.resolve({ data: {} }),
        ]);
        setStats({
          exchanges: exRes.data.length,
          streak:    profileRes.data.streak?.currentStreak    || 0,
          sessions:  profileRes.data.profile?.totalSessions   || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      }
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const quickLinks = [
    { to: '/bids',      icon: BookOpen,      label: 'Browse Bids',    desc: 'Find skill offers that match what you want',     color: 'bg-blue-50 text-blue-600',    border: 'hover:border-blue-200'   },
    { to: '/exchanges', icon: RefreshCw,     label: 'My Exchanges',   desc: 'Manage your active and upcoming exchanges',      color: 'bg-[#2d7d6f]/10 text-[#2d7d6f]', border: 'hover:border-teal-200' },
    { to: '/chat',      icon: MessageSquare, label: 'Messages',       desc: 'Chat with your exchange partners in real-time',  color: 'bg-purple-50 text-purple-600', border: 'hover:border-purple-200' },
    { to: '/profile',   icon: User,          label: 'My Profile',     desc: 'Update your skills and availability',            color: 'bg-amber-50 text-amber-600',  border: 'hover:border-amber-200'  },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-[#f0f7f6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(45,125,111,0.12); }
        .quick-link { transition: all 0.25s ease; }
        .quick-link:hover { transform: translateY(-3px); }
        .fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; transform: translateY(16px); }
        .fade-up-d1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity: 0; transform: translateY(16px); }
        .fade-up-d2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity: 0; transform: translateY(16px); }
        .fade-up-d3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity: 0; transform: translateY(16px); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .dot-bg { background-image: radial-gradient(circle, #2d7d6f18 1.5px, transparent 1.5px); background-size: 28px 28px; }
        .number-big { font-variant-numeric: tabular-nums; }
      `}</style>

      <div className="max-w-5xl mx-auto p-6 pt-8">

        {/* ── HEADER ── */}
        <div className="fade-up flex items-start justify-between mb-8">
          <div>
            <p className="text-[#4a6b67] text-sm font-medium mb-1">{greeting} 👋</p>
            <h1 className="font-display text-3xl font-black text-[#0f2724]">
              {user?.name?.split(' ')[0] || 'Welcome'}
            </h1>
            <p className="text-[#4a6b67] text-sm mt-1 font-medium">
              Here's your skill exchange overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/bids/create"
              className="flex items-center gap-2 bg-[#2d7d6f] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-teal-200/50 hover:bg-[#246860] transition-all"
            >
              <Zap size={15} fill="white" /> Post a Bid
            </Link>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="fade-up-d1 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Exchanges */}
          <div className="stat-card bg-[#2d7d6f] rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-[-30px] left-[-10px] w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw size={18} className="text-white" />
              </div>
              <p className="number-big text-4xl font-black text-white mb-1">
                {loading ? '—' : stats.exchanges}
              </p>
              <p className="text-teal-100 text-sm font-medium">Active Exchanges</p>
            </div>
          </div>

          {/* Streak */}
          <div className="stat-card bg-white rounded-3xl p-6 border border-teal-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-amber-50 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                <Flame size={18} className="text-amber-500" />
              </div>
              <p className="number-big text-4xl font-black text-[#0f2724] mb-1">
                {loading ? '—' : stats.streak}
                {!loading && <span className="text-2xl ml-1">🔥</span>}
              </p>
              <p className="text-[#4a6b67] text-sm font-medium">Day Streak</p>
            </div>
          </div>

          {/* Sessions */}
          <div className="stat-card bg-white rounded-3xl p-6 border border-teal-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-green-50 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={18} className="text-green-600" />
              </div>
              <p className="number-big text-4xl font-black text-[#0f2724] mb-1">
                {loading ? '—' : stats.sessions}
              </p>
              <p className="text-[#4a6b67] text-sm font-medium">Total Sessions</p>
            </div>
          </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="fade-up-d2 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0f2724] text-lg">Quick Access</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map(({ to, icon: Icon, label, desc, color, border }) => (
              (() => { void Icon; return (
              <Link
                key={to}
                to={to}
                className={`quick-link bg-white rounded-2xl p-5 border border-teal-50 ${border} shadow-sm flex items-center gap-4 group`}
              >
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0f2724] group-hover:text-[#2d7d6f] transition-colors text-sm">
                    {label}
                  </h3>
                  <p className="text-[#4a6b67] text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#2d7d6f] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
              ); })()
            ))}
          </div>
        </div>

        {/* ── BOTTOM BANNER ── */}
        <div className="fade-up-d3 bg-white rounded-3xl p-6 border border-teal-50 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2d7d6f]/10 rounded-2xl flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-[#2d7d6f]" />
            </div>
            <div>
              <p className="font-bold text-[#0f2724] text-sm">Schedule a Session</p>
              <p className="text-[#4a6b67] text-xs mt-0.5">
                Pick a time with your partner and start learning
              </p>
            </div>
          </div>
          <Link
            to="/exchanges"
            className="flex items-center gap-1.5 bg-[#2d7d6f] text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-[#246860] transition-all shadow-md shadow-teal-200/40"
          >
            View Exchanges <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;