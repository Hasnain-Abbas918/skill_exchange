import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  User, Lock, Bell, Trash2, LogOut, Shield, ChevronRight, Check, Eye, EyeOff,
} from 'lucide-react';

// ─── Sub-section Components ────────────────────────────────

const SectionCard = ({ title, icon: Icon, children }) => (
  (() => { void Icon; return (
  <div className="card mb-4">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center">
        <Icon size={16} className="text-brand" />
      </div>
      <h2 className="font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
  ); })()
);

// ─── Account Info Section ──────────────────────────────────

const AccountInfo = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');
    setLoading(true);
    try {
      await api.put('/settings/name', { name });
      toast.success('Name updated!');
      // Refresh user
      dispatch({ type: 'auth/fetchMe/fulfilled', payload: { ...user, name } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    }
    setLoading(false);
  };

  return (
    <SectionCard title="Account Information" icon={User}>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-4">
          <div className="w-14 h-14 rounded-xl bg-brand text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`badge text-xs mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
            <button onClick={handleSave} disabled={loading || name === user?.name} className="btn-primary px-4 shrink-0">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            className="input-field bg-gray-50 cursor-not-allowed text-gray-400"
            disabled
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
          <Shield size={16} className="text-green-600" />
          <p className="text-green-700 text-sm font-medium">
            {user?.isVerified ? 'Email verified ✓' : 'Email not verified'}
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

// ─── Password Section ─────────────────────────────────────

const PasswordSection = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (form.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await api.put('/settings/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <SectionCard title="Change Password" icon={Lock}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className="input-field pr-10"
              placeholder="Enter current password"
              required
            />
            <button type="button" onClick={() => setShowCurrent((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="input-field pr-10"
              placeholder="Min. 6 characters"
              required
            />
            <button type="button" onClick={() => setShowNew((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`input-field ${form.confirmPassword && form.newPassword !== form.confirmPassword ? 'border-red-300 focus:ring-red-200' : ''}`}
            placeholder="Confirm new password"
            required
          />
          {form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </SectionCard>
  );
};
const NotificationsSection = () => {
  const [prefs, setPrefs] = useState({
    emailRequests: true,
    emailExchanges: true,
    emailSessions: true,
    emailMessages: false,
  });

  const labels = {
    emailRequests: 'Email when I receive a new request',
    emailExchanges: 'Email when exchange status changes',
    emailSessions: 'Email for upcoming session reminders',
    emailMessages: 'Email for new chat messages',
  };

  const handleSave = async () => {
    try {
      await api.put('/settings/notifications', prefs);
      toast.success('Notification preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <SectionCard title="Notification Preferences" icon={Bell}>
      <div className="space-y-3">
        {Object.entries(prefs).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">{labels[key]}</span>
            <button
              onClick={() => setPrefs((p) => ({ ...p, [key]: !value }))}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-brand' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
        <button onClick={handleSave} className="btn-primary w-full mt-2">Save Preferences</button>
      </div>
    </SectionCard>
  );
};

// ─── Danger Zone ─────────────────────────────────────────

const DangerZone = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete('/settings/account', { data: { password } });
      dispatch(logout());
      navigate('/');
      toast.success('Account deleted. Goodbye!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
    setLoading(false);
  };

  return (
    <SectionCard title="Danger Zone" icon={Trash2}>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
          <div>
            <p className="font-medium text-gray-900 text-sm">Sign Out</p>
            <p className="text-gray-400 text-xs">Log out of your current session</p>
          </div>
          <button onClick={handleLogoutAll} className="btn-secondary text-sm flex items-center gap-1.5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50">
          <div>
            <p className="font-medium text-red-700 text-sm">Delete Account</p>
            <p className="text-red-400 text-xs">Permanently delete your account and data</p>
          </div>
          <button
            onClick={() => setShowDelete((p) => !p)}
            className="text-red-600 border border-red-300 bg-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-all"
          >
            Delete
          </button>
        </div>

        {showDelete && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
            <p className="text-red-700 text-sm font-medium">⚠️ This action is irreversible! All your data will be deleted.</p>
            {!user?.googleId && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Confirm with your password"
                className="input-field border-red-300 focus:ring-red-200"
              />
            )}
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleDelete} disabled={loading || (!user?.googleId && !password)} className="btn-danger flex-1 text-sm">
                {loading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

// ─── Main Settings Page ───────────────────────────────────

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 sticky top-24">
            {sections.map(({ id, label, icon: Icon }) => {
              void Icon;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-1 ${
                    activeSection === id
                      ? 'bg-brand-light text-brand'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {activeSection === id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'account' && <AccountInfo user={user} />}
          {activeSection === 'password' && <PasswordSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'danger' && <DangerZone user={user} />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;