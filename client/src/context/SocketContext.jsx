import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/chatSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
 
const SocketContext = createContext();
 
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!token) {
      return;
    }
 
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
 
    newSocket.on('connect', () => console.log('🔌 Socket connected'));
    newSocket.on('connect_error', (err) => console.warn('Socket error:', err.message));
    newSocket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
 
    newSocket.on('new_message', ({ conversationId, message }) => {
      dispatch(addMessage({ conversationId, message }));
    });
 
    newSocket.on('new_notification', ({ type, message: msg }) => {
      const icons = { request: '📬', exchange: '🤝', session: '📹', message: '💬', system: '🔔' };
      toast(`${icons[type] || '🔔'} ${msg || `New ${type} notification`}`, { duration: 4000 });
    });
 
    // Session started notification for partner
    newSocket.on('session_started', ({ roomId, partnerName }) => {
      toast(
        (t) => (
          <div className="flex items-center gap-3">
            <span>📹 <b>{partnerName}</b> started the session!</span>
            <button
              onClick={() => {
                navigate(`/session/${roomId}`);
                toast.dismiss(t.id);
              }}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Join Now
            </button>
          </div>
        ),
        { duration: 15000 }
      );
    });
 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [token, dispatch, navigate]);
 
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
 
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);