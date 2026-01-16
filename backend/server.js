import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

async function translateText(text, targetLanguage = 'es') {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockTranslations = {
    'en': {
      'Hello, how are you?': 'Hola, ¿cómo estás?',
      'What is your name?': '¿Cuál es tu nombre?',
      'Thank you very much': 'Muchas gracias',
      'Good morning': 'Buenos días',
      'I love programming': 'Me encanta programar'
    }
  };
  
  return mockTranslations[targetLanguage]?.[text] || `[Translated: ${text}]`;
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('translate', async (data) => {
    try {
      const { sentence, targetLanguage } = data;
      console.log('Translating:', sentence);
      
      const translated = await translateText(sentence, targetLanguage);
      
      socket.emit('translation', {
        original: sentence,
        translated: translated,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Translation error:', error);
      socket.emit('translation-error', {
        error: 'Failed to translate sentence'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
