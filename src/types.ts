import type { User } from 'firebase/auth';

export type AppView = 'loading' | 'auth' | 'chat' | 'complete' | 'welcome' | 'account' | 'admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// DIMENSION 1
export interface Dimension1 {
  nombre_simbolico?: string;
  proposito?: string;
  valores?: string[];
  mantras?: string[];
}

// DIMENSION 2
export interface Dimension2 {
  cualidades?: string[];
  herramientas?: string[];
}

// DIMENSION 3
export interface SubArea {
  nombre: string;
  acciones: string[];
}
export interface Area {
  nombre:string;
  sub_areas: SubArea[];
}

// The AI model will return an object with area names as keys. We process it into an array.
export type Dimension3 = Area[];


// DIMENSION 4
export interface Proceso {
  nombre: string;
  descripcion: string;
}
export interface Dimension4 {
  introduccion?: string;
  procesos?: Proceso[];
}

// Full Data Structure
export interface FractalData {
  dimension1: Dimension1;
  dimension2: Dimension2;
  dimension3: Dimension3;
  dimension4: Dimension4;
}

// For AI service response
export interface AiResponseData {
  respuesta_conversacional: string;
  datos: Partial<Dimension1> | Partial<Dimension2> | any | Partial<Dimension4>;
  fase_completa?: boolean;
}

// For Welcome Screen Content / Daily Challenge
export interface WelcomeContent {
  id: string;
  isActive?: boolean;
  header: {
    title: string;
    subtitle: string;
  };
  imageUrl: string;
  dailyChallenge: {
    title: string;
    text: string;
  };
  podcast: {
    title: string;
    url: string;
  };
  aiHelper: {
    initialMessage: string;
    systemInstruction: string;
  };
}

// Add Firebase User type for auth state
export type FirebaseUser = User;