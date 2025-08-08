import {
    collection,
    getDocs,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    writeBatch,
    query,
    where,
    documentId
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { WelcomeContent } from './types';

const CHALLENGES_COLLECTION = 'challenges';

/**
 * Uploads a file to Cloud Storage and returns its download URL.
 * @param file The file to upload.
 * @param onProgress Callback to report upload progress.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = (file: File, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileRef = ref(storage, `challenges/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

/**
 * Gets all challenges from Firestore.
 */
export const getChallenges = async (): Promise<WelcomeContent[]> => {
    const querySnapshot = await getDocs(collection(db, CHALLENGES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WelcomeContent));
};


/**
 * Saves a challenge to Firestore. If it has an ID, it updates; otherwise, it creates a new one.
 * @param challenge The challenge content to save.
 */
export const saveChallenge = async (challenge: Omit<WelcomeContent, 'id'> & { id?: string }): Promise<void> => {
    if (challenge.id) {
        const docRef = doc(db, CHALLENGES_COLLECTION, challenge.id);
        await setDoc(docRef, challenge, { merge: true });
    } else {
        await addDoc(collection(db, CHALLENGES_COLLECTION), { ...challenge, isActive: false });
    }
};

/**
 * Deletes a challenge and its associated files from Storage.
 * @param challenge The challenge object to delete.
 */
export const deleteChallenge = async (challenge: WelcomeContent): Promise<void> => {
    // Delete files from storage first
    try {
        if (challenge.imageUrl) {
            const imageRef = ref(storage, challenge.imageUrl);
            await deleteObject(imageRef);
        }
        if (challenge.podcast.url) {
            const audioRef = ref(storage, challenge.podcast.url);
            await deleteObject(audioRef);
        }
    } catch(error: any) {
        // Log error but continue to delete the doc.
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting files from Storage, proceeding to delete doc:", error);
        }
    }
    
    // Then delete the document from firestore
    const docRef = doc(db, CHALLENGES_COLLECTION, challenge.id);
    await deleteDoc(docRef);
};


/**
 * Sets a specific challenge as active, ensuring all others are inactive.
 * @param challengeId The ID of the challenge to activate.
 */
export const setActiveChallenge = async (challengeId: string): Promise<void> => {
    const challengesRef = collection(db, CHALLENGES_COLLECTION);
    const batch = writeBatch(db);

    // Get all documents
    const querySnapshot = await getDocs(challengesRef);
    querySnapshot.forEach((document) => {
        const docRef = doc(db, CHALLENGES_COLLECTION, document.id);
        const shouldBeActive = document.id === challengeId;
        // Update only if the isActive status needs to change
        if (document.data().isActive !== shouldBeActive) {
            batch.update(docRef, { isActive: shouldBeActive });
        }
    });

    await batch.commit();
};