import { VoiceRecorder } from './components/VoiceRecorder';
import { TranslationList } from './components/TranslationList';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🎙️ Voice Translator</h1>
          <p>Record your voice and get real-time translations</p>
        </header>
        
        <main>
          <VoiceRecorder />
          <TranslationList />
        </main>
      </div>
    </div>
  );
}

export default App;
