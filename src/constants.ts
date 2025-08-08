import type { ChatMessage, FractalData } from './types';

export const initialFractalData: FractalData = {
  dimension1: {
    nombre_simbolico: "",
    proposito: "",
    valores: [],
    mantras: [],
  },
  dimension2: {
    cualidades: [],
    herramientas: [],
  },
  dimension3: [],
  dimension4: {
    introduccion: "",
    procesos: [],
  },
};

export const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    text: '✨ ¡Hola! Bienvenido a RetoDía. Aquí, transformarte no significa cambiarte, sino acompañarte a reconectar contigo.'
  },
  {
    id: 'welcome-2',
    role: 'model',
    text: 'A través de esta conversación, nos ayudarás a comprender tu mundo interior y, con ello, construir retos diarios que hablen tu propio idioma. ¿Arrancamos?'
  }
];