import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, RefreshCw, BookOpen, Flag } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'Exchanges', value: stats.totalExchanges, icon: RefreshCw, color: 'text-green-500 bg-green-50' },
    { label: 'Total Bids', value: stats.totalBids, icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: Flag, color: 'text-red-500 bg-red-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and moderation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => {
          void Icon;
          return (
            <div key={label} className="card flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="card hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-brand transition-colors">Manage Users</h3>
              <p className="text-gray-400 text-sm">View, search, ban or unban users</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/reports" className="card hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flag size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-brand transition-colors">Review Reports</h3>
              <p className="text-gray-400 text-sm">Handle misconduct and violations</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;