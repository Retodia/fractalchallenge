import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { mockWelcomeContent } from '../welcomeTestData';

const CHALLENGES_COLLECTION = 'challenges';

/**
 * Seeds the database with the initial welcome challenge if no challenges exist.
 * @returns {Promise<boolean>} A promise that resolves to true if seeded, false otherwise.
 */
export const seedInitialChallenge = async (): Promise<boolean> => {
    const challengesRef = collection(db, CHALLENGES_COLLECTION);
    const snapshot = await getDocs(challengesRef);

    if (snapshot.empty) {
        console.log('%c[Seed Service]', 'color: #9C27B0', 'No challenges found. Seeding initial challenge...');
        
        // Remove id from mock data as Firestore will generate one
        const { id, ...challengeData } = mockWelcomeContent;
        
        await addDoc(challengesRef, {
            ...challengeData,
            isActive: true, // Make the first one active by default
        });
        console.log('%c[Seed Service]', 'color: #9C27B0', 'Initial challenge seeded successfully.');
        return true;
    }

    console.log('%c[Seed Service]', 'color: #9C27B0', 'Challenges already exist. No seeding needed.');
    return false;
};