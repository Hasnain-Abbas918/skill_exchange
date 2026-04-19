import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Video, Pause, Play, X,
  MessageSquare, Clock, Zap, Flag } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  active:    'bg-green-100 text-green-700 border border-green-200',
  paused:    'bg-blue-100 text-blue-700 border border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border border-red-200',
};

const ExchangeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exchange,      setExchange]      = useState(null);
  const [sessions,      setSessions]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm,     setReportForm]     = useState({ type: 'no_show', description: '' });
  const [reportLoading,  setReportLoading]  = useState(false);

  const load = async () => {
    try {
      const [exRes, sessRes] = await Promise.all([
        api.get(`/exchanges/${id}`),
        api.get(`/schedule/sessions/${id}`),
      ]);
      setExchange(exRes.data);
      setSessions(sessRes.data || []);
    } catch {
      toast.error('Exchange not found');
      navigate('/exchanges');
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [id]);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!exchange?.partner?.id) return toast.error('Partner info is missing');
    setReportLoading(true);
    try {
      await api.post('/reports', {
        reportedId:  exchange.partner.id,
        exchangeId:  id,
        type:        reportForm.type,
        description: reportForm.description,
      });
      toast.success('Report submitted successfully!');
      setShowReportForm(false);
      setReportForm({ type: 'no_show', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    }
    setReportLoading(false);
  };

  const handlePause = async () => {
    setActionLoading(true);
    try {
      await api.put(`/exchanges/${id}/pause`);
      toast.success('Exchange paused');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pause');
    }
    setActionLoading(false);
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      await api.put(`/exchanges/${id}/resume`);
      toast.success('Exchange resumed!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resume');
    }
    setActionLoading(false);
  };

  const handleCancel = async () => {
    if (!window.confirm('Do you want to cancel? Approval from both users is required.')) return;
    setActionLoading(true);
    try {
      await api.put(`/exchanges/${id}/cancel`);
      toast('Cancel request sent. Waiting for partner approval.', { icon: '⏳' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setActionLoading(false);
  };

  if (loading) return <div className="p-6"><Loader text="Loading exchange..." /></div>;
  if (!exchange) return null;

  const isActive    = exchange.status === 'active';
  const isPaused    = exchange.status === 'paused';
  const isCompleted = exchange.status === 'completed' || exchange.status === 'cancelled';
  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled');
  const pastSessions     = sessions.filter((s) => s.status !== 'scheduled');

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* ── Back ── */}
      <button
        onClick={() => navigate('/exchanges')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-brand text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Exchanges
      </button>

      {/* ── Header Card ── */}
      <div className="card mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            {/* Partner avatar - image or fallback letter */}
            <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center font-bold text-xl overflow-hidden">
              {exchange.partner?.avatar ? (
                <img
                  src={exchange.partner.avatar}
                  alt={exchange.partner.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                exchange.partner?.name?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exchange.partner?.name}</h1>
              <p className="text-sm text-gray-500">{exchange.partner?.email}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[exchange.status]}`}>
            {exchange.status}
          </span>
        </div>

        {/* Skills */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            {exchange.bid?.skillOffered}
          </span>
          <span className="text-gray-400 font-medium">↔</span>
          <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            {exchange.bid?.skillWanted}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{exchange.streak || 0}</p>
            <p className="text-xs text-gray-500">Day Streak 🔥</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{pastSessions.length}</p>
            <p className="text-xs text-gray-500">Sessions Done</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{upcomingSessions.length}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        {!isCompleted && (
          <div className="flex gap-2 flex-wrap">
            <Link
              to={`/exchanges/${id}/schedule`}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-all"
            >
              <Calendar size={15} /> Schedule Session
            </Link>

            <Link
              to="/chat"
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
            >
              <MessageSquare size={15} /> Chat
            </Link>

            {isActive && (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all disabled:opacity-60"
              >
                <Pause size={15} /> Pause
              </button>
            )}

            {isPaused && (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-all disabled:opacity-60"
              >
                <Play size={15} /> Resume
              </button>
            )}

            {/* Report button in action bar */}
            <button
              onClick={() => setShowReportForm((p) => !p)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
            >
              <Flag size={15} /> Report
            </button>

            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-60 ml-auto"
            >
              <X size={15} /> Cancel Exchange
            </button>
          </div>
        )}

        {/* Report form under action buttons */}
        {showReportForm && (
          <form onSubmit={handleReport} className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
            <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
              <Flag size={14} /> Report {exchange.partner?.name}
            </p>
            <select
              value={reportForm.type}
              onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
              className="input-field text-sm"
            >
              <option value="no_show">No Show - User did not join session</option>
              <option value="misconduct">Misconduct - Inappropriate behavior</option>
              <option value="technical">Technical Issue - Platform problem</option>
            </select>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={3}
              required
              className="input-field text-sm resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowReportForm(false); setReportForm({ type: 'no_show', description: '' }); }}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportLoading}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {reportLoading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Upcoming Sessions ── */}
      {upcomingSessions.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-brand" /> Upcoming Sessions
          </h2>
          <div className="space-y-2">
            {upcomingSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-brand-light rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(s.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Room: {s.roomId}</p>
                </div>
                <Link
                  to={`/session/${s.roomId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand/90 transition-all"
                >
                  <Video size={13} /> Join
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Past Sessions ── */}
      {pastSessions.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" /> Past Sessions
          </h2>
          <div className="space-y-2">
            {pastSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(s.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">Status: {s.status}</p>
                </div>
                {s.status === 'completed' && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                    ✓ Done
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── No Sessions Yet ── */}
      {sessions.length === 0 && (
        <div className="card text-center py-10 text-gray-400">
          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No session has been held yet.</p>
          <Link
            to={`/exchanges/${id}/schedule`}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-all"
          >
            <Calendar size={15} /> Schedule session
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExchangeDetailPage;