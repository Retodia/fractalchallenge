// Este archivo centraliza la configuración de la aplicación.
// ¡IMPORTANTE! Si subes este código a un repositorio público como GitHub,
// asegúrate de añadir "config.ts" a tu archivo .gitignore para no exponer tus claves.

export const firebaseConfig = {
  apiKey: "AIzaSyBr50ci23HHCeKWN_ZT7a1GE22H1jNPi8E",
  authDomain: "fractalchallenge.firebaseapp.com",
  projectId: "fractalchallenge",
  storageBucket: "fractalchallenge.appspot.com",
  messagingSenderId: "859934118800",
  appId: "1:859934118800:web:a913886be6367b0bba1915",
  measurementId: "G-0YY8H8HJ24"
};

// --- Cloud Functions Names ---
// Estos nombres deben coincidir exactamente con los exportados en functions/index.js
export const fractalFunctionName = 'getAiFractalResponse';
export const challengeFunctionName = 'getAiChallengeResponse';