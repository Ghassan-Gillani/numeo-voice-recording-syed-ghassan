import { useRef, useState, useCallback } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
}

export const useVoiceRecorder = (
  onSentenceDetected: (text: string) => void
): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRecordingRef = useRef(false);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error('Speech recognition is not supported in your browser');
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          if (transcript) {
            onSentenceDetected(transcript);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error('Failed to restart recognition:', err);
          }
        }
      };

      mediaRecorder.start();
      recognition.start();
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('Error starting recording:', err);
    }
  }, [onSentenceDetected]);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    audioChunksRef.current = [];
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
};
