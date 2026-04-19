import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, RefreshCw, MessageSquare,
  User, LogOut, ShieldCheck, Clock, Settings, Inbox, Flag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      try {
        const { data } = await api.get('/requests/received');
        setPendingCount(data.filter((r) => r.status === 'pending').length);
      } catch (error) {
        console.error('Failed to fetch pending requests', error);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bids',      icon: BookOpen,        label: 'Bids'      },
    { to: '/exchanges', icon: RefreshCw,       label: 'Exchanges' },
    { to: '/requests',  icon: Inbox,           label: 'Requests', badge: pendingCount },
    { to: '/chat',      icon: MessageSquare,   label: 'Chat'      },
    { to: '/history',   icon: Clock,           label: 'History'   },
    { to: '/reports',   icon: Flag,            label: 'Reports'   },
    { to: '/profile',   icon: User,            label: 'Profile'   },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .nav-root { font-family: 'DM Sans', sans-serif; }
        .nav-link-item {
          position: relative; display: flex; align-items: center; gap: 6px;
          padding: 6px 11px; border-radius: 10px;
          font-size: 0.8rem; font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-item.active {
          background: rgba(45,125,111,0.15);
          color: #2d7d6f;
        }
        .nav-link-item.inactive {
          color: #4a6b67;
          background: transparent;
        }
        .nav-link-item.inactive:hover {
          background: rgba(45,125,111,0.08);
          color: #2d7d6f;
        }
        .nav-link-item.reports-active {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }
        .nav-link-item.reports-inactive {
          color: #4a6b67;
        }
        .nav-link-item.reports-inactive:hover {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
        }
        .nav-link-item.admin-active {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
        }
        .nav-link-item.admin-inactive {
          color: #4a6b67;
        }
        .nav-link-item.admin-inactive:hover {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
        }
        .badge-dot {
          position: absolute; top: -4px; right: -4px;
          background: #ef4444; color: #fff;
          font-size: 0.6rem; font-weight: 700;
          border-radius: 50%; width: 16px; height: 16px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #f0f7f6;
        }
        .icon-btn {
          padding: 7px; border-radius: 10px; border: none;
          background: transparent; cursor: pointer;
          color: #4a6b67; transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
        }
        .icon-btn:hover { background: rgba(45,125,111,0.1); color: #2d7d6f; }
        .icon-btn.danger:hover { background: rgba(239,68,68,0.08); color: #ef4444; }
        .avatar-ring { transition: box-shadow 0.2s ease; }
        .avatar-ring:hover { box-shadow: 0 0 0 3px rgba(45,125,111,0.25); }
      `}</style>

      <nav className="nav-root sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-teal-100/60 w-full">
        <div className="w-full px-5 h-[60px] flex items-center justify-between">

          {/* LOGO */}
          <Link to="/dashboard" className="flex items-center shrink-0" style={{ textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="SkillSwap"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {user && (
            <div className="flex items-center gap-0.5">

              {/* NAV LINKS */}
              {navLinks.map(({ to, icon: Icon, label, badge }) => {
                void Icon;
                const isReports = to === '/reports';
                const active = isActive(to);
                let className = 'nav-link-item ';
                if (isReports) {
                  className += active ? 'reports-active' : 'reports-inactive';
                } else {
                  className += active ? 'active' : 'inactive';
                }

                return (
                  <Link key={to} to={to} className={className}>
                    <Icon size={14} />
                    <span className="hidden md:inline">{label}</span>
                    {badge > 0 && (
                      <span className="badge-dot">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* ADMIN */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`nav-link-item ${isActive('/admin') ? 'admin-active' : 'admin-inactive'}`}
                >
                  <ShieldCheck size={14} />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}

              {/* DIVIDER */}
              <div className="w-px h-5 bg-teal-100 mx-2 shrink-0" />

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-1">
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div
                    className="avatar-ring w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold cursor-pointer"
                    style={{ background: '#2d7d6f', color: '#fff' }}
                    title={user.name}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </div>
                </Link>

                <Link to="/settings" className="icon-btn" title="Settings">
                  <Settings size={16} />
                </Link>

                <button
                  className="icon-btn danger"
                  onClick={() => { logout(); navigate('/login'); }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;