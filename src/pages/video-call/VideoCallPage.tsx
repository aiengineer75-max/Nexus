import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from 'lucide-react';

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Camera/Mic access lena
  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      setCallStarted(true);
      setCallEnded(false);
    } catch (err) {
      alert('Camera/Microphone access denied or not available.');
      console.error(err);
    }
  };

  // Call timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStarted && !callEnded) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStarted, callEnded]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
    }
    setIsMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    }
    setIsCameraOn((prev) => !prev);
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCallStarted(false);
    setCallEnded(true);
    setCallDuration(0);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Call</h1>
      <p className="text-gray-600 mb-6">Connect face-to-face with your collaborators</p>

      <Card className="p-6">
        {!callStarted ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <Video size={32} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {callEnded ? 'Call Ended' : 'Ready to start your meeting?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {callEnded
                ? 'You can start a new call anytime.'
                : 'Your camera and microphone will be used for this call.'}
            </p>
            <Button onClick={startCall} leftIcon={<Video size={18} />}>
              Start Call
            </Button>
          </div>
        ) : (
          <div>
            {/* Call duration */}
            <div className="flex justify-center mb-4">
              <span className="text-sm font-medium bg-gray-900 text-white px-3 py-1 rounded-full">
                {formatDuration(callDuration)}
              </span>
            </div>

            {/* Video grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Local video (tumhara camera) */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {user?.name || 'You'}
                </span>
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <VideoOff size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Remote participant (mock placeholder) */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-600 mx-auto mb-2 flex items-center justify-center text-white text-xl font-semibold">
                    ?
                  </div>
                  <p className="text-gray-300 text-sm">Waiting for participant to join...</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-error-500 text-white hover:bg-error-700'
                }`}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-colors ${
                  isCameraOn ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-error-500 text-white hover:bg-error-700'
                }`}
              >
                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                title="Screen share (mock)"
                onClick={() => alert('Screen share is a mock feature for this demo.')}
              >
                <Monitor size={20} />
              </button>

              <button
                onClick={endCall}
                className="p-3 rounded-full bg-error-500 text-white hover:bg-error-700 transition-colors"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};