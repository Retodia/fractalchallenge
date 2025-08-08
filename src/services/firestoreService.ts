import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { FirebaseUser, FractalData, ChatMessage } from '../types';

/**
 * Creates a new document for a user in the 'users' collection upon registration.
 */
export const createUserDocument = async (user: FirebaseUser) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        // Check for admin email on creation to assign role
        role: user.email === 'admin@retodia.com' ? 'admin' : 'user', 
    };
    await setDoc(userDocRef, userData, { merge: true });
};

/**
 * Retrieves a user's data from Firestore.
 */
export const getUserData = async (uid: string) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
};


/**
 * Saves or updates the user's fractal data and progress in Firestore.
 */
export const saveFractalDataToFirestore = async (
    userId: string, 
    data: FractalData,
    phase: number,
    isComplete: boolean
): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
    console.log(`%c[Firestore Service]`, 'color: #FFA500', `Saving data for user: ${userId}`);
    await setDoc(userDocRef, {
        fractal: data,
        phase: phase,
        isComplete: isComplete,
        lastUpdatedAt: serverTimestamp(),
    }, { merge: true });
};

/**
 * Retrieves the user's fractal data and progress from Firestore.
 */
export const getFractalData = async (userId: string): Promise<{ fractal: FractalData; phase: number; isComplete: boolean } | null> => {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists() && docSnap.data().fractal) {
        const data = docSnap.data();
        return {
            fractal: data.fractal,
            phase: data.phase,
            isComplete: data.isComplete
        };
    } else {
        return null;
    }
};


/**
 * Logs a single chat message to the 'chat_logs' collection in Firestore.
 */
export const logChatMessage = async (userId: string, message: ChatMessage) => {
    try {
        await addDoc(collection(db, 'chat_logs'), {
            userId,
            message,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error logging chat message to Firestore:", error);
    }
};