import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Inbox, Send, Check, X, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border border-green-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const RequestsPage = () => {
  const [tab, setTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // request id

  const loadData = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/requests/received'),
        api.get('/requests/sent'),
      ]);
      setReceived(recRes.data);
      setSent(sentRes.data);
    } catch {
      toast.error('Failed to load requests');
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      await api.put(`/requests/${requestId}/accept`);
      toast.success('✅ Request accepted! Exchange created.');
      // Update local state
      setReceived((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: 'accepted' } : r)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
    setActionLoading(null);
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await api.put(`/requests/${requestId}/reject`);
      toast('Request rejected.', { icon: '❌' });
      setReceived((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: 'rejected' } : r)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
    setActionLoading(null);
  };

  const handleCancel = async (requestId) => {
    setActionLoading(requestId);
    try {
      await api.put(`/requests/${requestId}/cancel`);
      toast('Request cancelled.', { icon: '🚫' });
      setSent((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: 'cancelled' } : r)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setActionLoading(null);
  };

  const pendingCount = received.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Skill Exchange Requests</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'received' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Inbox size={15} />
          Received
          {pendingCount > 0 && (
            <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'sent' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Send size={15} />
          Sent
        </button>
      </div>

      {loading && <Loader text="Loading requests..." />}

      {/* ── RECEIVED REQUESTS ── */}
      {!loading && tab === 'received' && (
        <div className="space-y-4">
          {received.length === 0 && (
            <div className="card text-center py-14 text-gray-400">
              <Inbox size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No received requests yet</p>
              <p className="text-sm mt-1">When someone sends a request on your bid, it will appear here.</p>
            </div>
          )}

          {received.map((req) => (
            <div key={req.id} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {req.sender?.name?.[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">{req.sender?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[req.status]}`}>
                      {req.status}
                    </span>
                    {req.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs text-yellow-600">
                        <Clock size={11} /> Awaiting response
                      </span>
                    )}
                  </div>

                  {/* Skill Exchange Info */}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                      {req.bid?.skillOffered}
                    </span>
                    <span className="text-gray-400">↔</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-medium">
                      {req.bid?.skillWanted}
                    </span>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 italic mb-2">
                      "{req.message}"
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action buttons for pending requests only */}
              {req.status === 'pending' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAccept(req.id)}
                    disabled={actionLoading === req.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-2.5 rounded-xl font-medium text-sm hover:bg-brand/90 transition-all disabled:opacity-60"
                  >
                    {actionLoading === req.id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check size={16} /> Accept — Create Exchange
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={actionLoading === req.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-60"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              )}

              {/* Accepted — Go to Exchange */}
              {req.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to="/exchanges"
                    className="flex items-center justify-center gap-2 text-sm text-brand font-medium hover:underline"
                  >
                    View exchange <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SENT REQUESTS ── */}
      {!loading && tab === 'sent' && (
        <div className="space-y-4">
          {sent.length === 0 && (
            <div className="card text-center py-14 text-gray-400">
              <Send size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No sent requests</p>
              <p className="text-sm mt-1">
                <Link to="/bids" className="text-brand hover:underline">Browse bids</Link> and send a request
              </p>
            </div>
          )}

          {sent.map((req) => (
            <div key={req.id} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {req.receiver?.name?.[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">{req.receiver?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[req.status]}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                      {req.bid?.skillOffered}
                    </span>
                    <span className="text-gray-400">↔</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-medium">
                      {req.bid?.skillWanted}
                    </span>
                  </div>

                  {req.message && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 italic mb-2">
                      "{req.message}"
                    </div>
                  )}

                  <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Cancel button for pending requests only */}
              {req.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleCancel(req.id)}
                    disabled={actionLoading === req.id}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-60"
                  >
                    {actionLoading === req.id
                      ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      : <X size={14} />
                    }
                    Cancel Request
                  </button>
                </div>
              )}

              {/* Accepted — View Exchange */}
              {req.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link to="/exchanges" className="flex items-center gap-1 text-sm text-brand font-medium hover:underline">
                    View exchange <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;