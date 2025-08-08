/* eslint-disable @typescript-eslint/no-var-requires */
// This module defines second‑generation Firebase callable functions for the
// Fractal Reader application.  Functions are deployed to Node.js 20 using
// the `firebase-functions/v2/https` API.  Each function validates
// authentication, validates input parameters, constructs the appropriate
// Gemini system instructions and schemas, and returns the AI response.

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { GoogleGenAI, Type } = require('@google/genai');
const { initializeApp } = require('firebase-admin/app');

// Initialize the Firebase Admin SDK.  This ensures that user authentication
// context is available when functions are invoked.
initializeApp();

// Load the Gemini API key from the environment.  When deploying to
// Firebase Functions you should configure this as a secret or set it
// as an environment variable.  For local emulation you can export it in
// your shell or use a .env file.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error(
    'FATAL ERROR: GEMINI_API_KEY environment variable not set. Set the GEMINI_API_KEY environment variable or Firebase config.'
  );
}

// Instantiate the Gemini client.  Change the model as needed.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = 'gemini-2.5-flash';

// Helper function that returns system instructions and a JSON schema
// definition appropriate for the current phase of the fractal conversation.
const getFractalSystemInstruction = (phase, currentData) => {
  const baseInstruction = `Eres un "Lector de Fractales Personales", un intérprete simbólico conversacional. Tu objetivo es ayudar al usuario a mapear su sistema personal a través de una conversación cálida, natural y perspicaz. Tu única salida DEBE SER un objeto JSON válido que se ajuste al esquema proporcionado. No incluyas texto fuera del objeto JSON. En tu respuesta conversacional, sé amable y ofrece ideas o ejemplos si el usuario parece atascado. Basa tu extracción de datos en TODA la conversación.`;
  const commonResponseSchema = {
    respuesta_conversacional: {
      type: Type.STRING,
      description:
        'Tu respuesta para continuar el diálogo con el usuario de forma natural y alentadora.',
    },
  };
  const phaseCompletionSchema = {
    fase_completa: {
      type: Type.BOOLEAN,
      description:
        "Establece en 'true' solo cuando hayas recopilado información suficiente para todos los campos de esta dimensión y estés listo para pasar a la siguiente. De lo contrario, establece en 'false'.",
    },
  };

  switch (phase) {
    case 1:
      return {
        instruction: `${baseInstruction}\n\nFase actual: 1 - YO. Extrae el \"Core ontológico\" del usuario: nombre simbólico, propósito vital, valores esenciales y mantras. Pregunta sobre lo que le mueve y define. Cuando creas que has recopilado información suficiente, establece 'fase_completa' a true y en tu respuesta conversacional, introduce la Fase 2: CUALIDADES Y ESTRUCTURA. Datos actuales: ${JSON.stringify(
          currentData.dimension1
        )}`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonResponseSchema,
            datos: {
              type: Type.OBJECT,
              properties: {
                nombre_simbolico: { type: Type.STRING },
                proposito: { type: Type.STRING },
                valores: { type: Type.ARRAY, items: { type: Type.STRING } },
                mantras: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            ...phaseCompletionSchema,
          },
          required: ['respuesta_conversacional', 'datos', 'fase_completa'],
        },
      };
    case 2:
      return {
        instruction: `${baseInstruction}\n\nFase actual: 2 - CUALIDADES Y ESTRUCTURA. Identifica las cualidades y herramientas internas del usuario. Cuando creas que has recopilado suficiente información, establece 'fase_completa' a true y en tu respuesta conversacional, introduce la Fase 3: LAS AREAS QUE MAS TE IMPORTAN. Datos actuales: ${JSON.stringify(
          currentData.dimension2
        )}`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonResponseSchema,
            datos: {
              type: Type.OBJECT,
              properties: {
                cualidades: { type: Type.ARRAY, items: { type: Type.STRING } },
                herramientas: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            ...phaseCompletionSchema,
          },
          required: ['respuesta_conversacional', 'datos', 'fase_completa'],
        },
      };
    case 3:
      return {
        instruction: `${baseInstruction}\n\nFase actual: 3 - LAS AREAS QUE MAS TE IMPORTAN. Mapea las áreas de vida, sub-áreas y acciones del usuario. Cuando creas que has recopilado suficiente información, establece 'fase_completa' a true y en tu respuesta conversacional, introduce la Fase 4: COMO FUNCIONA TU MENTE. Datos actuales: ${JSON.stringify(
          currentData.dimension3
        )}`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonResponseSchema,
            datos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  sub_areas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nombre: { type: Type.STRING },
                        acciones: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
              },
            },
            ...phaseCompletionSchema,
          },
          required: ['respuesta_conversacional', 'datos', 'fase_completa'],
        },
      };
    case 4:
      return {
        instruction: `${baseInstruction}\n\nFase actual: 4 - COMO FUNCIONA TU MENTE. Descubre los módulos de funcionamiento personal (procesos internos) del usuario. Cuando creas que has recopilado suficiente información, establece 'fase_completa' a true y en tu respuesta conversacional, informa al usuario que el proceso ha finalizado. Datos actuales: ${JSON.stringify(
          currentData.dimension4
        )}`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonResponseSchema,
            datos: {
              type: Type.OBJECT,
              properties: {
                introduccion: { type: Type.STRING },
                procesos: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      nombre: { type: Type.STRING },
                      descripcion: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            ...phaseCompletionSchema,
          },
          required: ['respuesta_conversacional', 'datos', 'fase_completa'],
        },
      };
    default:
      throw new Error('Invalid phase number');
  }
};

/**
 * getAiFractalResponse
 *
 * This callable function generates a structured JSON response for the fractal
 * reader conversation.  It verifies authentication, extracts the phase,
 * conversation history, and current data from the request, builds the
 * appropriate instruction and schema, and returns the parsed JSON result from
 * Gemini.  Errors are surfaced as HttpsError instances so that clients
 * receive descriptive error codes.
 */
exports.getAiFractalResponse = onCall({ region: 'us-central1' }, async (request) => {
  // Require the caller to be authenticated
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const { phase, history, currentData } = request.data || {};
  if (!phase || !history || !currentData) {
    throw new HttpsError('invalid-argument', 'Missing required data: phase, history, or currentData.');
  }
  const { instruction, schema } = getFractalSystemInstruction(phase, currentData);
  // Convert conversation to Gemini format
  const contents = history.map((msg) => ({ role: msg.role, parts: [{ text: msg.text }] }));
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: instruction,
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error in getAiFractalResponse:', error);
    throw new HttpsError('internal', 'Failed to get AI response.');
  }
});

/**
 * getAiChallengeResponse
 *
 * This callable function generates a text-based response for a challenge
 * conversation.  It requires authentication, accepts an arbitrary system
 * instruction and conversation history, and returns the plain text response
 * from Gemini.  Errors are reported via HttpsError.
 */
exports.getAiChallengeResponse = onCall({ region: 'us-central1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const { systemInstruction, history } = request.data || {};
  if (!systemInstruction || !history) {
    throw new HttpsError('invalid-argument', 'Missing required data: systemInstruction or history.');
  }
  const contents = history.map((msg) => ({ role: msg.role, parts: [{ text: msg.text }] }));
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return { text: response.text.trim() };
  } catch (error) {
    console.error('Error in getAiChallengeResponse:', error);
    throw new HttpsError('internal', 'Failed to get AI challenge response.');
  }
});
