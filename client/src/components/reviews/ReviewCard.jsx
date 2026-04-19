import { Star, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={
          s <= rating
            ? 'text-amber-400 fill-amber-400'
            : 'text-gray-200 fill-gray-200'
        }
      />
    ))}
  </div>
);

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useSelector((s) => s.auth);
  const isOwner = user?.id === review.reviewer?.id;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
        {review.reviewer?.avatar ? (
          <img
            src={review.reviewer.avatar}
            alt={review.reviewer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          review.reviewer?.name?.[0]?.toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-gray-900">
              {review.reviewer?.name}
            </span>
            <StarDisplay rating={review.rating} />
          </div>

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {review.comment && (
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          {new Date(review.createdAt).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;