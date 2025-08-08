import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { fractalFunctionName, challengeFunctionName } from '../config';
import type { ChatMessage, FractalData, AiResponseData } from '../types';

const getAiFractalResponseCallable = httpsCallable(functions, fractalFunctionName);
const getAiChallengeResponseCallable = httpsCallable(functions, challengeFunctionName);

export const getAiResponse = async (userId: string, phase: number, history: ChatMessage[], currentData: FractalData): Promise<AiResponseData | null> => {
    try {
        const payload = { phase, history, currentData }; // userId is handled by context.auth on backend
        const result = await getAiFractalResponseCallable(payload);
        return result.data as AiResponseData;
    } catch (error) {
        console.error("Error calling Fractal AI Cloud Function:", error);
        return {
            respuesta_conversacional: "Tuve un problema al procesar eso. ¿Podrías intentar reformular tu idea?",
            datos: {},
            fase_completa: false
        };
    }
};

export const getChallengeAiResponse = async (userId: string, systemInstruction: string, history: ChatMessage[]): Promise<string> => {
    try {
        const payload = { systemInstruction, history }; // userId is handled by context.auth
        const result = await getAiChallengeResponseCallable(payload);
        const data = result.data as { text: string };
        return data.text;
    } catch (error) {
        console.error("Error calling Challenge AI Cloud Function:", error);
        return "Lo siento, tuve un problema para conectarme. Por favor, intenta de nuevo.";
    }
};