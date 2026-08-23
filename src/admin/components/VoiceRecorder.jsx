"use client";
import React, { useEffect, useRef, useState } from 'react';

// Records a short voice clip via the browser's mic (MediaRecorder), or
// accepts an uploaded audio file as a fallback — either way the result is
// handed back to the parent as a base64 data URI, matching how
// profilePicture/companyLogo are already stored on the Testimonial model.
const MAX_DURATION_SECONDS = 180; // 3 minutes — plenty for a voice testimonial
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VoiceRecorder = ({ value, onChange }) => {
  const [status, setStatus] = useState('idle'); // idle | recording | error
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => stopStream, []);

  const startRecording = async () => {
    setError('');
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Voice recording is not supported in this browser.');
      setStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stopStream();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => onChange(reader.result);
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setStatus('recording');
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (next >= MAX_DURATION_SECONDS) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      setError('Microphone access was denied or is unavailable.');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStatus('idle');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('Audio file is too large. Please keep it under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    setSeconds(0);
    setError('');
  };

  return (
    <div className="voice-recorder">
      {!value && status !== 'recording' && (
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={startRecording}
          >
            <i className="fas fa-microphone me-1"></i>
            Start Recording
          </button>
          <span className="text-muted">or</span>
          <label className="btn btn-outline-secondary btn-sm mb-0">
            <i className="fas fa-upload me-1"></i>
            Upload Audio File
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>
        </div>
      )}

      {status === 'recording' && (
        <div className="d-flex align-items-center gap-2">
          <span className="voice-recorder__dot" aria-hidden="true"></span>
          <span className="fw-semibold">Recording… {formatTime(seconds)}</span>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={stopRecording}
          >
            <i className="fas fa-stop me-1"></i>
            Stop
          </button>
        </div>
      )}

      {value && status !== 'recording' && (
        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
          <audio src={value} controls style={{ height: '36px' }} />
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleRemove}
          >
            <i className="fas fa-trash-alt me-1"></i>
            Remove
          </button>
        </div>
      )}

      {error && <div className="text-danger mt-2 small">{error}</div>}

      <style jsx>{`
        .voice-recorder__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #dc3545;
          display: inline-block;
          animation: voice-recorder-pulse 1s ease-in-out infinite;
        }
        @keyframes voice-recorder-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;
