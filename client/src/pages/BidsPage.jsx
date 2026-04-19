import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBids, createBid } from '../store/slices/bidSlice';
import { Search, Plus, X, ArrowLeftRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import BidCard from '../components/bids/BidCard';

const BidsPage = () => {
  const dispatch = useDispatch();
  const { bids, total, loading } = useSelector((state) => state.bids);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ skillOffered: '', skillWanted: '', description: '', level: 'Beginner', tags: '' });
  const [requestTarget, setRequestTarget] = useState(null);
  const [requestMsg, setRequestMsg] = useState('');
  const [estimateDays, setEstimateDays] = useState('');
  const [dailyHours, setDailyHours] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBids({ search, level: levelFilter }));
  }, [search, levelFilter, dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(createBid({
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }));
    setSubmitting(false);
    if (createBid.fulfilled.match(result)) {
      toast.success('Bid posted successfully!');
      setShowCreate(false);
      setForm({ skillOffered: '', skillWanted: '', description: '', level: 'Beginner', tags: '' });
    } else {
      toast.error(result.payload || 'Failed to create bid');
    }
  };

  const handleSendRequest = async () => {
    if (!requestTarget) return;
    if (!estimateDays || estimateDays < 1) {
      toast.error('Please enter how many days you need to learn');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/requests', {
        bidId: requestTarget.id,
        receiverId: requestTarget.creator?.id,
        message: requestMsg,
        estimateDays: parseInt(estimateDays),
        dailyHours: parseInt(dailyHours),
      });
      toast.success('Request sent!');
      setRequestTarget(null);
      setRequestMsg('');
      setEstimateDays('');
      setDailyHours('1');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: '1.5px solid #e0f0ee', background: '#f8fcfb',
    color: '#0f2724', fontSize: '0.875rem', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", transition: 'border 0.2s',
    boxSizing: 'border-box',
  };

  const modalStyle = {
    background: '#fff', borderRadius: '2rem', padding: '32px',
    width: '100%', maxWidth: '460px',
    boxShadow: '0 24px 64px rgba(45,125,111,0.15)',
    border: '1px solid #e0f0ee', fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .bids-input:focus { border-color: #2d7d6f !important; box-shadow: 0 0 0 3px rgba(45,125,111,0.1); }
      `}</style>

      <div style={{ minHeight: '100vh', padding: '32px 24px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 800, color: '#0f2724', marginBottom: '4px' }}>
                Skill Bids
              </h1>
              <p style={{ color: '#4a6b67', fontSize: '0.875rem' }}>{total} bids available</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#2d7d6f', color: '#fff', border: 'none',
                borderRadius: '14px', padding: '12px 20px',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(45,125,111,0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1a5c51'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2d7d6f'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Plus size={18} /> Post a Bid
            </button>
          </div>

          {/* ── Search & Filter ── */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4a6b67' }} size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill..."
                className="bids-input"
                style={{ ...inputStyle, paddingLeft: '38px' }}
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bids-input"
              style={{ ...inputStyle, width: '160px' }}
            >
              <option value="">All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* ── Bids Grid ── */}
          {loading ? (
            <Loader text="Loading bids..." />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {bids.map((bid) => (
                  <BidCard key={bid.id} bid={bid} onRequest={setRequestTarget} />
                ))}
              </div>
              {bids.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <p style={{ color: '#4a6b67', fontSize: '1.1rem', fontWeight: 600 }}>No bids found</p>
                  <p style={{ color: '#4a6b67', fontSize: '0.875rem', marginTop: '8px' }}>
                    Try a different search or post your own bid!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Create Bid Modal ── */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,39,36,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 800, color: '#0f2724' }}>
                Post a Bid
              </h2>
              <button onClick={() => setShowCreate(false)} style={{ background: '#f0f7f6', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#4a6b67' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="bids-input" style={inputStyle} type="text" placeholder="Skill you offer (e.g. JavaScript)" value={form.skillOffered} onChange={(e) => setForm({ ...form, skillOffered: e.target.value })} required />
              <input className="bids-input" style={inputStyle} type="text" placeholder="Skill you want (e.g. Guitar)" value={form.skillWanted} onChange={(e) => setForm({ ...form, skillWanted: e.target.value })} required />
              <textarea className="bids-input" style={{ ...inputStyle, resize: 'none' }} placeholder="Describe the exchange..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select className="bids-input" style={inputStyle} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <input className="bids-input" style={inputStyle} type="text" placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e0f0ee', background: '#f0f7f6', color: '#2d7d6f', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#2d7d6f', color: '#fff', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                  {submitting ? 'Posting...' : 'Post Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Send Request Modal ── */}
      {requestTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,39,36,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ ...modalStyle, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 800, color: '#0f2724' }}>
                Send Exchange Request
              </h2>
              <button onClick={() => setRequestTarget(null)} style={{ background: '#f0f7f6', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#4a6b67' }}>
                <X size={18} />
              </button>
            </div>

            {/* Target info */}
            <div style={{ background: '#f0f7f6', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', background: '#2d7d6f', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {requestTarget.creator?.avatar ? (
                    <img src={requestTarget.creator.avatar} alt={requestTarget.creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{requestTarget.creator?.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4a6b67' }}>
                  Exchange with <strong style={{ color: '#0f2724' }}>{requestTarget.creator?.name}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#e0f0ee', color: '#2d7d6f', fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px' }}>{requestTarget.skillOffered}</span>
                <ArrowLeftRight size={12} color="#4a6b67" />
                <span style={{ background: '#f3e8ff', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px' }}>{requestTarget.skillWanted}</span>
              </div>
            </div>

            {/* ── Estimate Section ── */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '12px' }}>
                📊 Session Planning
              </p>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0f2724', marginBottom: '6px' }}>
                  How many days do you need to learn <strong>{requestTarget.skillWanted}</strong>?
                </label>
                <input
                  className="bids-input"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="e.g. 14"
                  value={estimateDays}
                  onChange={(e) => setEstimateDays(e.target.value)}
                  style={{ ...inputStyle, background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0f2724', marginBottom: '6px' }}>
                  How many hours per day can you commit to sessions?
                </label>
                <select
                  className="bids-input"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  style={{ ...inputStyle, background: '#fff' }}
                >
                  <option value="1">1 hour / day</option>
                  <option value="2">2 hours / day</option>
                  <option value="3">3 hours / day</option>
                </select>
              </div>

              {estimateDays && (
                <div style={{ marginTop: '12px', background: '#d1fae5', borderRadius: '10px', padding: '10px', fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>
                  📅 Estimated: ~{parseInt(estimateDays)} days × {dailyHours} hr/day
                  <br />
                  <span style={{ fontWeight: 400, fontSize: '0.75rem' }}>
                    Final sessions will be calculated after receiver also gives their estimate
                  </span>
                </div>
              )}
            </div>

            {/* Message */}
            <textarea
              className="bids-input"
              style={{ ...inputStyle, resize: 'none', marginBottom: '16px' }}
              placeholder="Add a message (optional)..."
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              rows={3}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setRequestTarget(null); setEstimateDays(''); setDailyHours('1'); }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e0f0ee', background: '#f0f7f6', color: '#2d7d6f', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={submitting}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#2d7d6f', color: '#fff', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif" }}
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BidsPage;