import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

const useWebRTC = (roomId) => {
  const { socket } = useSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  // Timer states
  const [bothConnected, setBothConnected] = useState(false);
  const [connectedSeconds, setConnectedSeconds] = useState(0);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const timerRef = useRef(null);
  const connectedSecondsRef = useRef(0); // ref for accurate value in callbacks

  // Start timer when both users are connected
  const startTimer = useCallback(() => {
    if (timerRef.current) return; // already running
    timerRef.current = setInterval(() => {
      connectedSecondsRef.current += 1;
      setConnectedSeconds(connectedSecondsRef.current);
    }, 1000);
  }, []);

  // Pause timer when any user disconnects
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket?.emit('ice_candidate', { roomId, candidate });
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
    };

    return pc;
  }, [socket, roomId]);

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = createPeer();
      peerConnectionRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      socket?.emit('join_room', { roomId });
    } catch (err) {
      console.error('Media error:', err);
      alert('Camera/mic access required. Please allow and retry.');
    }
  }, [createPeer, socket, roomId]);

  const toggleMute = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks();
    tracks?.forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  }, []);

  const toggleVideo = useCallback(() => {
    const tracks = localStreamRef.current?.getVideoTracks();
    tracks?.forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOff((p) => !p);
  }, []);

  const shareScreen = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(screenTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setIsScreenSharing(true);
      socket?.emit('screen_share', { roomId, isSharing: true });

      screenTrack.onended = async () => {
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (sender && camTrack) await sender.replaceTrack(camTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        setIsScreenSharing(false);
        socket?.emit('screen_share', { roomId, isSharing: false });
      };
    } catch (err) {
      console.error('Screen share error:', err);
    }
  }, [socket, roomId]);

  const endCall = useCallback(() => {
    pauseTimer();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    socket?.emit('leave_room', { roomId });
    setIsConnected(false);
    setConnectionState('disconnected');
  }, [socket, roomId, pauseTimer]);

  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = async () => {
      if (!peerConnectionRef.current) return;
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    };

    const handleOffer = async ({ offer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    };

    const handleAnswer = async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleICE = async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('ICE candidate handling failed', error);
      }
    };

    const handleUserLeft = () => {
      setIsConnected(false);
      setConnectionState('disconnected');
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      // Pause timer when partner leaves
      pauseTimer();
      setBothConnected(false);
      setPartnerDisconnected(true);
    };

    // Server confirms both users connected, start timer
    const handleTimerStarted = ({ connectedSeconds: serverSeconds }) => {
      connectedSecondsRef.current = serverSeconds;
      setConnectedSeconds(serverSeconds);
      setBothConnected(true);
      setPartnerDisconnected(false);
      startTimer();
    };

    // Partner disconnected, pause timer
    const handlePartnerDisconnected = ({ connectedSeconds: serverSeconds }) => {
      connectedSecondsRef.current = serverSeconds;
      setConnectedSeconds(serverSeconds);
      pauseTimer();
      setBothConnected(false);
      setPartnerDisconnected(true);
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleICE);
    socket.on('user_left', handleUserLeft);
    socket.on('timer_started', handleTimerStarted);
    socket.on('partner_disconnected', handlePartnerDisconnected);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleICE);
      socket.off('user_left', handleUserLeft);
      socket.off('timer_started', handleTimerStarted);
      socket.off('partner_disconnected', handlePartnerDisconnected);
    };
  }, [socket, roomId, startTimer, pauseTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => pauseTimer();
  }, [pauseTimer]);

  return {
    localVideoRef, remoteVideoRef,
    isConnected, isMuted, isVideoOff, isScreenSharing, connectionState,
    // Timer values
    bothConnected, connectedSeconds, partnerDisconnected,
    startCall, toggleMute, toggleVideo, shareScreen, endCall,
  };
};

export default useWebRTC;