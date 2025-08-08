import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import type { WelcomeContent } from '../types';

/**
 * Fetches the currently active welcome screen content from Firestore.
 * @returns A promise that resolves with the active welcome content.
 */
export const getWelcomeContent = async (): Promise<WelcomeContent> => {
    console.log(`%c[Content Service]`, 'color: #4CAF50', 'Fetching active challenge from Firestore...');
    
    const challengesRef = collection(db, 'challenges');
    const q = query(challengesRef, where("isActive", "==", true), limit(1));
    
    try {
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error("No active challenge found in Firestore.");
        }
        
        const activeChallengeDoc = querySnapshot.docs[0];
        const activeChallenge = { id: activeChallengeDoc.id, ...activeChallengeDoc.data() } as WelcomeContent;
        
        console.log(`%c[Content Service]`, 'color: #4CAF50', `Active challenge "${activeChallenge.dailyChallenge.title}" fetched successfully.`);
        return activeChallenge;

    } catch (error) {
        console.error(`%c[Content Service]`, 'color: #FF0000', 'Error fetching active challenge:', error);
        throw error;
    }
};