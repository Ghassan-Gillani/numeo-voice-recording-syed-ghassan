# Voice Translator - Real-time Voice Recording and Translation

A full-stack application that records user voice input and translates each spoken sentence in real-time using WebSocket communication.

## Features

-  **Voice Recording**: Uses Web Audio API and Speech Recognition API to capture and detect spoken sentences
-  **Real-time Translation**: WebSocket-based communication for instant translation updates
-  **Modern UI**: Clean, responsive interface with real-time status indicators
-  **Translation History**: View all translations with timestamps
-  **State Management**: Zustand for efficient state management
-  **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Zustand** for state management
- **Socket.io Client** for real-time communication
- **Web Speech API** for voice recognition
- **Web Audio API** for audio recording

### Backend
- **Node.js** with **Express**
- **Socket.io** for WebSocket server
- Mock translation API (easily replaceable with OpenAI or similar)

## Project Structure

```
numeo/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── store/      # Zustand state management
│   │   └── ...
│   └── package.json
├── backend/            # Node.js backend
│   ├── server.js      # Express + Socket.io server
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- A modern browser with support for:
  - Web Speech API (Chrome, Edge, Safari)
  - Web Audio API
  - WebSocket

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```
   
   Or install manually:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

## Running the Application

### Option 1: Run both servers together (Recommended)
```bash
npm run dev
```

This will start both the backend (port 3001) and frontend (port 3000) concurrently.

### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Usage

1. **Start the application** (see above)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Wait for connection** - The status indicator should show "Connected" (green dot)
4. **Click "Start Recording"** - Grant microphone permissions when prompted
5. **Speak clearly** - The app will detect complete sentences automatically
6. **View translations** - Translations appear in real-time below the recorder
7. **Stop recording** - Click "Stop Recording" when done

## How It Works

1. **Voice Capture**: The app uses the browser's `getUserMedia` API to access the microphone
2. **Sentence Detection**: The Web Speech Recognition API detects when you finish speaking a sentence
3. **Real-time Communication**: Each detected sentence is sent to the backend via Socket.io
4. **Translation**: The backend processes the sentence (currently using mock translations)
5. **Display**: Translated text is sent back and displayed in the UI immediately

## Assumptions and Trade-offs

### Assumptions
- **Browser Support**: Assumes users are on modern browsers (Chrome, Edge, Safari) that support Web Speech API
- **Network**: Assumes stable network connection for WebSocket communication
- **Microphone Access**: Users will grant microphone permissions when prompted
- **Language**: Currently configured for English input (easily configurable)

### Trade-offs Made

1. **Mock Translation API**: 
   - Used mock translations instead of real API integration for simplicity
   - Easy to replace: Update the `translateText` function in `backend/server.js`
   - To use OpenAI: Add API key and replace with actual API call

2. **Speech Recognition API**:
   - Uses browser's built-in Web Speech API (Chrome/Edge)
   - Alternative would be cloud-based services (more accurate but requires API keys)
   - Browser API is free but less accurate than cloud services

3. **State Management**:
   - Used Zustand for simplicity and performance
   - Could use Context API or Redux, but Zustand is lighter and sufficient

4. **Error Handling**:
   - Basic error handling implemented
   - Production app would need more robust error recovery and retry logic

5. **Backend Simplicity**:
   - Minimal backend as per requirements
   - Production would need authentication, rate limiting, proper logging, etc.

## Integrating Real Translation API

To use a real translation API (e.g., OpenAI), update `backend/server.js`:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateText(text, targetLanguage = 'es') {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a translator. Translate the following text to ${targetLanguage}. Only return the translation, nothing else.`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.3,
  });
  
  return response.choices[0].message.content;
}
```

## Browser Compatibility

-  **Chrome/Edge**: Full support (Web Speech API)
-  **Safari**: Full support (Web Speech API)
-  **Firefox**: Limited support (may need polyfill or alternative)
-  **Older browsers**: Not supported

## Troubleshooting

### "Speech recognition is not supported"
- Use Chrome, Edge, or Safari
- Ensure you're using HTTPS (or localhost)

### "Failed to connect to server"
- Ensure backend is running on port 3001
- Check firewall settings
- Verify no other application is using port 3001

### "Microphone access denied"
- Grant microphone permissions in browser settings
- Check system microphone permissions

### Translations not appearing
- Check browser console for errors
- Verify Socket.io connection (status indicator)
- Check backend console for errors

## Development Notes

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:3001`
- Socket.io handles CORS automatically
- Hot module replacement enabled for fast development

## Future Improvements

- [ ] Add support for multiple target languages
- [ ] Implement audio playback of translations
- [ ] Add user authentication
- [ ] Persist translation history
- [ ] Add export functionality (CSV, JSON)
- [ ] Improve sentence detection accuracy
- [ ] Add visual waveform during recording
- [ ] Support for multiple languages input

## License

This project is created for a coding challenge.
