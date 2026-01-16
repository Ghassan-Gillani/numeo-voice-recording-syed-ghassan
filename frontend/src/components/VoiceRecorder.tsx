import { useEffect } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useSocket } from '../hooks/useSocket';
import { useTranslationStore } from '../store/useTranslationStore';

export const VoiceRecorder = () => {
  const { isRecording, setRecording, isConnected, error, setError } = useTranslationStore();
  const { translateSentence } = useSocket();

  const handleSentenceDetected = (sentence: string) => {
    console.log('Sentence detected:', sentence);
    translateSentence(sentence, 'es');
  };

  const { startRecording, stopRecording, error: recorderError } = useVoiceRecorder(
    handleSentenceDetected
  );

  useEffect(() => {
    if (recorderError) {
      setError(recorderError);
    }
  }, [recorderError, setError]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      setRecording(false);
    } else {
      if (!isConnected) {
        setError('Not connected to server. Please wait...');
        return;
      }
      await startRecording();
      setRecording(true);
    }
  };

  return (
    <div className="voice-recorder">
      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={handleToggleRecording}
        disabled={!isConnected}
      >
        {isRecording ? (
          <>
            <span className="pulse-dot" />
            Stop Recording
          </>
        ) : (
          <>
            <span className="mic-icon">🎤</span>
            Start Recording
          </>
        )}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};
