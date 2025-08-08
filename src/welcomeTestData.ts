import type { WelcomeContent } from './types';

export const mockWelcomeContent: WelcomeContent = {
  id: 'mock-challenge-1',
  header: {
    title: "RetoDía",
    subtitle: "Cada día cuenta. Ponle intención."
  },
  imageUrl: "https://images.unsplash.com/photo-1506126613408-4e0e0f7c50da?q=80&w=1287&auto=format&fit=crop",
  dailyChallenge: {
    title: "Tu Reto de Hoy: Pausa Consciente",
    text: "Encuentra un momento de 5 minutos en tu día, sin interrupciones. Cierra los ojos, respira profundamente tres veces y simplemente observa tus pensamientos sin juzgarlos. El objetivo no es tener la mente en blanco, sino ser consciente del aquí y el ahora."
  },
  podcast: {
    title: "Audio Guía: Meditación de 5 minutos",
    url: "https://cdn.pixabay.com/download/audio/2022/11/21/audio_a27c7336c1.mp3" // Placeholder audio from Pixabay
  },
  aiHelper: {
    initialMessage: "¡Hola! Estoy aquí para ayudarte a superar tu reto del día. ¿Cómo te sientes al pensar en esta 'Pausa Consciente'? ¿Qué obstáculos crees que podrías encontrar?",
    systemInstruction: "Eres un coach de mindfulness y bienestar. Tu propósito es guiar y apoyar al usuario a completar su 'Reto del Día' de forma amable y constructiva. El reto es: 'Encuentra un momento de 5 minutos en tu día, sin interrupciones. Cierra los ojos, respira profundamente tres veces y simplemente observa tus pensamientos sin juzgarlos. El objetivo no es tener la mente en blanco, sino ser consciente del aquí y el ahora.' Ofrece consejos prácticos, valida sus sentimientos y anímale a intentarlo."
  }
};