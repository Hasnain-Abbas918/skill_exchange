import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, Send, Inbox, Video, Activity, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../components/common/Loader';

const tabs = ['Summary', 'Requests', 'Sessions', 'Activity'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
  missed: 'bg-red-100 text-red-700',
};

const HistoryPage = () => {
  const [tab, setTab] = useState('Summary');
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [sessions, setSessions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (t) => {
    setLoading(true);
    try {
      if (t === 'Summary' && !summary) {
        const r = await api.get('/history/summary');
        setSummary(r.data);
      } else if (t === 'Requests' && !requests.sent.length && !requests.received.length) {
        const r = await api.get('/history/requests');
        setRequests(r.data);
      } else if (t === 'Sessions' && !sessions.length) {
        const r = await api.get('/history/sessions');
        setSessions(r.data);
      } else if (t === 'Activity' && !activity.length) {
        const r = await api.get('/history/activity');
        setActivity(r.data);
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(tab); }, [tab]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock size={24} className="text-brand" /> History & Tracking
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <Loader />}

      {/* Summary */}
      {tab === 'Summary' && summary && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Requests Sent', value: summary.requestsSent, icon: Send, color: 'text-blue-500 bg-blue-50' },
            { label: 'Requests Received', value: summary.requestsReceived, icon: Inbox, color: 'text-purple-500 bg-purple-50' },
            { label: 'Accepted', value: summary.requestsAccepted, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
            { label: 'Active Exchanges', value: summary.activeExchanges, icon: Activity, color: 'text-brand bg-brand-light' },
            { label: 'Sessions Done', value: summary.completedSessions, icon: Video, color: 'text-teal-500 bg-teal-50' },
            { label: 'Missed Sessions', value: summary.missedSessions, icon: XCircle, color: 'text-red-500 bg-red-50' },
          ].map(({ label, value, icon: Icon, color }) => {
            void Icon;
            return (
              <div key={label} className="card flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requests */}
      {tab === 'Requests' && !loading && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Send size={16} /> Sent Requests ({requests.sent.length})</h3>
            <div className="space-y-2">
              {requests.sent.length === 0 && <p className="text-gray-400 text-sm">No sent requests yet.</p>}
              {requests.sent.map((r) => (
                <div key={r.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">To: {r.other?.name}</p>
                    <p className="text-xs text-gray-500">{r.bid?.skillOffered} ↔ {r.bid?.skillWanted}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Inbox size={16} /> Received Requests ({requests.received.length})</h3>
            <div className="space-y-2">
              {requests.received.length === 0 && <p className="text-gray-400 text-sm">No received requests yet.</p>}
              {requests.received.map((r) => (
                <div key={r.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">From: {r.other?.name}</p>
                    <p className="text-xs text-gray-500">{r.bid?.skillOffered} ↔ {r.bid?.skillWanted}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {tab === 'Sessions' && !loading && (
        <div className="space-y-3">
          {sessions.length === 0 && <p className="text-gray-400 text-sm">No session history yet.</p>}
          {sessions.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{s.teacher?.name} (Teacher)</p>
                <p className="text-xs text-gray-500">Scheduled: {new Date(s.scheduledAt).toLocaleString()}</p>
                {s.endedAt && <p className="text-xs text-gray-400">Ended: {new Date(s.endedAt).toLocaleString()}</p>}
              </div>
              <span className={`badge text-xs ${statusColors[s.status]}`}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Activity */}
      {tab === 'Activity' && !loading && (
        <div className="space-y-2">
          {activity.length === 0 && <p className="text-gray-400 text-sm">No activity recorded yet.</p>}
          {activity.map((a) => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{a.action}</p>
                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;