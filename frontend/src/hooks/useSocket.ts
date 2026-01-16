import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTranslationStore } from '../store/useTranslationStore';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { setConnected, setError, addTranslation } = useTranslationStore();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server. Make sure the backend is running.');
      setConnected(false);
    });

    socket.on('translation', (data: { original: string; translated: string; timestamp: string }) => {
      addTranslation(data);
    });

    socket.on('translation-error', (data: { error: string }) => {
      setError(data.error);
    });

    return () => {
      socket.disconnect();
    };
  }, [setConnected, setError, addTranslation]);

  const translateSentence = (sentence: string, targetLanguage: string = 'es') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('translate', { sentence, targetLanguage });
    } else {
      setError('Not connected to server');
    }
  };

  return { translateSentence };
};
