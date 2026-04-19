import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchMessages, setActiveConversation, addMessage } from '../store/slices/chatSlice';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import { Send, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversations, messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => { dispatch(fetchConversations()); }, [dispatch]);

  useEffect(() => {
    if (!activeConversation) return;
    dispatch(fetchMessages(activeConversation));
    socket?.emit('join_conversation', { conversationId: activeConversation });
    api.put(`/chat/${activeConversation}/read`);
  }, [activeConversation, socket, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  useEffect(() => {
    if (!socket) return;
    socket.on('user_typing', ({ name }) =>
      setTypingUsers((p) => (p.includes(name) ? p : [...p, name]))
    );
    socket.on('user_stop_typing', () =>
      setTypingUsers((p) => p.filter((_, i) => i !== 0))
    );
    return () => {
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversation || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);
    try {
      const { data } = await api.post(`/chat/${activeConversation}/messages`, { content: msg });
      dispatch(addMessage({ conversationId: activeConversation, message: data }));
      socket?.emit('typing_stop', { conversationId: activeConversation });
    } catch {
      setInput(msg);
    }
    setSending(false);
  };

  const handleTyping = (val) => {
    setInput(val);
    socket?.emit('typing_start', { conversationId: activeConversation });
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(
      () => socket?.emit('typing_stop', { conversationId: activeConversation }),
      1500
    );
  };

  const activeMessages = messages[activeConversation] || [];
  const activeConvData = conversations.find((c) => c.id === activeConversation);
  const partner = activeConvData?.participants?.find((p) => p.id !== user?.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .chat-input:focus { outline: none; border-color: #2d7d6f !important; box-shadow: 0 0 0 3px rgba(45,125,111,0.1); }
        .conv-item:hover { background: #f0f7f6; }
        .msg-scroll::-webkit-scrollbar { width: 4px; }
        .msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background: #e0f0ee; border-radius: 100px; }
      `}</style>

      <div style={{
        background: '#f0f7f6', minHeight: '100vh',
        padding: '24px', fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          height: 'calc(100vh - 96px)',
          display: 'flex', gap: '20px',
        }}>

          {/* Sidebar */}
          <div style={{
            width: '280px', background: '#fff',
            borderRadius: '1.5rem', border: '1px solid #e0f0ee',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(45,125,111,0.06)', flexShrink: 0,
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0f0ee' }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem', fontWeight: 800, color: '#0f2724',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <MessageSquare size={18} color="#2d7d6f" /> Messages
              </h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 && (
                <p style={{ textAlign: 'center', color: '#4a6b67', fontSize: '0.85rem', padding: '24px 16px' }}>
                  No conversations yet.<br />Start an exchange to chat!
                </p>
              )}

              {conversations.map((conv) => {
                const other = conv.participants?.find((p) => p.id !== user?.id);
                const isActive = activeConversation === conv.id;
                return (
                  <div
                    key={conv.id}
                    className="conv-item"
                    onClick={() => dispatch(setActiveConversation(conv.id))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s',
                      borderBottom: '1px solid #f0f7f6',
                      background: isActive ? '#f0f7f6' : 'transparent',
                      borderRight: isActive ? '3px solid #2d7d6f' : '3px solid transparent',
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: '#2d7d6f', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                    }}>
                      {other?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontWeight: 600, fontSize: '0.875rem',
                        color: isActive ? '#2d7d6f' : '#0f2724',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{other?.name || 'Unknown'}</p>
                      <p style={{
                        fontSize: '0.75rem', color: '#4a6b67',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{conv.lastMessage?.content || 'No messages yet'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          {activeConversation ? (
            <div style={{
              flex: 1, background: '#fff',
              borderRadius: '1.5rem', border: '1px solid #e0f0ee',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(45,125,111,0.06)',
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #e0f0ee',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: '#2d7d6f', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem',
                  }}>
                    {partner?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f2724', fontSize: '0.9rem' }}>{partner?.name}</p>
                    {typingUsers.length > 0 && (
                      <p style={{ fontSize: '0.75rem', color: '#2d7d6f', fontStyle: 'italic' }}>typing...</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const { data } = await api.post('/sessions/create', { conversationId: activeConversation });
                      navigate(`/session/${data.roomId}`);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#2d7d6f', color: '#fff', border: 'none',
                    borderRadius: '12px', padding: '8px 16px',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a5c51'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d7d6f'}
                >
                  🎥 Call
                </button>
              </div>

              {/* Messages */}
              <div className="msg-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeMessages.map((msg) => {
                  const isMe = msg.sender?.id === user?.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      {!isMe && (
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px',
                          background: '#e0f0ee', color: '#2d7d6f',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, marginRight: '8px', flexShrink: 0, marginTop: '4px',
                        }}>
                          {msg.sender?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div style={{
                        maxWidth: '360px', padding: '10px 14px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMe ? '#2d7d6f' : '#f0f7f6',
                        color: isMe ? '#fff' : '#0f2724',
                        fontSize: '0.875rem',
                      }}>
                        <p>{msg.content}</p>
                        <p style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.7 }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #e0f0ee', display: 'flex', gap: '10px' }}>
                <input
                  className="chat-input"
                  value={input}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: '12px',
                    border: '1.5px solid #e0f0ee', background: '#f8fcfb',
                    color: '#0f2724', fontSize: '0.875rem',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  style={{
                    background: '#2d7d6f', color: '#fff', border: 'none',
                    borderRadius: '12px', padding: '10px 16px',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    opacity: !input.trim() || sending ? 0.5 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a5c51'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d7d6f'}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1, background: '#fff',
              borderRadius: '1.5rem', border: '1px solid #e0f0ee',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '32px',
              boxShadow: '0 2px 12px rgba(45,125,111,0.06)',
            }}>
              <div style={{
                width: '64px', height: '64px', background: '#f0f7f6',
                borderRadius: '20px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '16px',
              }}>
                <MessageSquare size={28} color="#2d7d6f" />
              </div>
              <p style={{ fontWeight: 700, color: '#0f2724', fontSize: '1rem' }}>Select a conversation</p>
              <p style={{ color: '#4a6b67', fontSize: '0.875rem', marginTop: '6px' }}>
                Choose from the left to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;