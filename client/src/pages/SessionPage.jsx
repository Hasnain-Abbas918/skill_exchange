import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useWebRTC from '../hooks/useWebRTC';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Mic, MicOff, Video, VideoOff, Monitor,
  PhoneOff, Wifi, WifiOff, Clock, AlertTriangle,
} from 'lucide-react';

const MIN_SECONDS = 30 * 60;

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
};

const SessionPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { socket } = useSocket();

  const [session, setSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionReady, setSessionReady] = useState(false); // session load completion flag

  const {
    localVideoRef, remoteVideoRef,
    isConnected, isMuted, isVideoOff,
    isScreenSharing, connectionState,
    bothConnected, connectedSeconds, partnerDisconnected,
    startCall, toggleMute, toggleVideo, shareScreen, endCall,
  } = useWebRTC(roomId);

  // Step 1: Load session before camera setup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await api.get(`/sessions/room/${roomId}`);
        setSession(data);
        setSessionId(data.id);
        await api.put(`/sessions/${data.id}/start`);
        setSessionReady(true); // camera can start now
      } catch {
        toast.error('Session not found');
        navigate('/exchanges');
      }
    };
    loadSession();

    return () => { endCall(); };
  }, [roomId]); // eslint-disable-line

  // Step 2: Start camera once session and socket are ready
  useEffect(() => {
    if (!sessionReady || !socket) return;

    const beginCall = async () => {
      await startCall(); // video element is ready

      // Notify partner that session has started
      socket.emit('session_started', {
        roomId,
        sessionId,
        partnerName: user?.name,
      });
    };

    beginCall();
  }, [sessionReady, socket]); // eslint-disable-line

  // ─── Session End ──────────────────────────────────────────────────
  const handleEnd = async () => {
    if (connectedSeconds < MIN_SECONDS) {
      const remaining = MIN_SECONDS - connectedSeconds;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const confirm = window.confirm(
        `⚠️ You have only been connected for ${formatTime(connectedSeconds)}.\n\n` +
        `You still need ${mins} min ${secs} sec for streak credit.\n\n` +
        `Do you still want to end the session? (Streak will not increase)`
      );
      if (!confirm) return;
    }

    endCall();

    if (sessionId) {
      const result = await api
        .put(`/sessions/${sessionId}/end`, { connectedDuration: connectedSeconds })
        .catch(() => {});

      if (result?.data?.streakUpdated) {
        toast.success('🔥 Session complete! Streak increased!');
      } else {
        toast('Session ended. Streak did not increase — 30 minutes were not completed.', { icon: '⚠️' });
      }
    }

    navigate('/exchanges');
  };

  const connectionColors = {
    connected: 'text-green-400',
    connecting: 'text-yellow-400',
    disconnected: 'text-red-400',
    failed: 'text-red-400',
    closed: 'text-gray-400',
  };

  const progress = Math.min((connectedSeconds / MIN_SECONDS) * 100, 100);
  const isComplete = connectedSeconds >= MIN_SECONDS;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
          <span className="text-white font-medium text-sm">SkillSwap Session</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${
              isComplete ? 'text-green-400' : bothConnected ? 'text-white' : 'text-gray-500'
            }`}>
              <Clock size={14} />
              {formatTime(connectedSeconds)}
            </div>
            <div className="w-32 h-1 bg-gray-700 rounded-full mt-1">
              <div
                className={`h-1 rounded-full transition-all ${isComplete ? 'bg-green-400' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-0.5">
              {isComplete ? '✅ 30 min complete!' : `${Math.floor(MIN_SECONDS / 60)} min required`}
            </span>
          </div>

          {/* Connection state */}
          <div className={`flex items-center gap-1.5 text-xs ${connectionColors[connectionState] || 'text-gray-400'}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="capitalize">{connectionState}</span>
          </div>
        </div>
      </div>

      {/* Banners */}
      {partnerDisconnected && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 px-6 py-2 flex items-center gap-2 text-yellow-300 text-sm">
          <AlertTriangle size={16} />
          Partner disconnected — timer is paused. Wait for them to rejoin.
        </div>
      )}
      {bothConnected && !partnerDisconnected && (
        <div className="bg-green-900/30 border-b border-green-800 px-6 py-2 flex items-center gap-2 text-green-400 text-sm">
          <Wifi size={14} />
          Both users are connected — timer is running ✅
        </div>
      )}

      {/* Camera loading message until session is ready */}
      {!sessionReady && (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading session...
          </div>
        </div>
      )}

      {/* Video Grid */}
      {sessionReady && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-400 text-sm">Waiting for partner to join...</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
              {session?.partner?.name || 'Partner'}
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff size={32} className="text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
              You{isVideoOff ? ' (Camera Off)' : ''}{isMuted ? ' (Muted)' : ''}
            </div>
            {isScreenSharing && (
              <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg">
                Sharing Screen
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="py-5 flex justify-center items-center gap-3 border-t border-gray-800">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <button
          onClick={toggleVideo}
          title={isVideoOff ? 'Camera On' : 'Camera Off'}
          className={`p-4 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        <button
          onClick={shareScreen}
          title="Share Screen"
          className={`p-4 rounded-2xl transition-all ${isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          <Monitor size={22} />
        </button>

        <div className="w-px h-10 bg-gray-700" />

        <button
          onClick={handleEnd}
          className="px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 font-medium"
        >
          <PhoneOff size={20} /> End Session
        </button>
      </div>
    </div>
  );
};

export default SessionPage;
