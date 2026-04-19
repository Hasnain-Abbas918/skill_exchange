import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import api from '../../api/axios';

const levelColors = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
};

const BidCard = ({ bid, onRequest }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const createdAtText = useMemo(() => {
    const diff = Math.floor((now - new Date(bid.createdAt)) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }, [bid.createdAt, now]);

  useEffect(() => {
    if (bid.creator?.id) {
      api.get(`/reviews/user/${bid.creator.id}`)
        .then((res) => setRating(res.data.averageRating))
        .catch(() => setRating(0));
    }
  }, [bid.creator?.id]);

  const renderStars = (avg) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ fontSize: '0.75rem', color: star <= Math.round(avg) ? '#f59e0b' : '#d1d5db' }}>
        ★
      </span>
    ));
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '1.5rem',
        border: '1px solid #e0f0ee',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 2px 12px rgba(45,125,111,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(45,125,111,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(45,125,111,0.06)';
      }}
    >
      {/* ── Avatar + Name + Level + Rating ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px',
          flexShrink: 0, overflow: 'hidden', background: '#2d7d6f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #e0f0ee',
        }}>
          {bid.creator?.avatar ? (
            <img
              src={bid.creator.avatar}
              alt={bid.creator?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
              {bid.creator?.name?.[0]?.toUpperCase() || '?'}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, color: '#0f2724', fontSize: '0.9rem', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {bid.creator?.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', display: 'inline-block' }}
              className={levelColors[bid.level]}
            >
              {bid.level}
            </span>
            {rating !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {renderStars(rating)}
                <span style={{ fontSize: '0.7rem', color: '#4a6b67', fontWeight: 600, marginLeft: '2px' }}>
                  {rating > 0 ? `${rating}/5` : 'No ratings'}
                </span>
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#9ab8b5', flexShrink: 0 }}>
          {createdAtText}
        </p>
      </div>

      {/* ── Skills Exchange ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ background: '#e0f0ee', color: '#2d7d6f', fontSize: '0.78rem', fontWeight: 600, padding: '4px 10px', borderRadius: '8px' }}>
          📤 {bid.skillOffered}
        </span>
        <ArrowLeftRight size={13} color="#4a6b67" />
        <span style={{ background: '#f3e8ff', color: '#7c3aed', fontSize: '0.78rem', fontWeight: 600, padding: '4px 10px', borderRadius: '8px' }}>
          📥 {bid.skillWanted}
        </span>
      </div>

      {/* ── Description ── */}
      <p style={{
        color: '#4a6b67', fontSize: '0.85rem', lineHeight: 1.6,
        flex: 1, marginBottom: '12px',
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {bid.description}
      </p>

      {/* ── Tags ── */}
      {bid.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {bid.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{ fontSize: '0.7rem', background: '#f0f7f6', color: '#4a6b67', padding: '3px 8px', borderRadius: '100px' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Buttons ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => onRequest(bid)}
          style={{
            background: '#2d7d6f', color: '#fff', border: 'none',
            borderRadius: '12px', padding: '10px', fontWeight: 700,
            fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1a5c51'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2d7d6f'}
        >
          Send Request
        </button>
        <button
          onClick={() => navigate(`/bids/${bid.id}`)}
          style={{
            background: '#f0f7f6', color: '#2d7d6f', border: '1px solid #e0f0ee',
            borderRadius: '12px', padding: '10px', fontWeight: 600,
            fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e0f0ee'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f0f7f6'}
        >
          More Details
        </button>
      </div>
    </div>
  );
};

export default BidCard;