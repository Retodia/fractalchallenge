import React, { useState, useEffect } from 'react';
import type { WelcomeContent, FirebaseUser, AppView } from '../types';
import { getWelcomeContent } from '../services/welcomeContentService';
import { SparklesIcon, UserIcon } from './icons/Icons';
import AudioPlayer from './AudioPlayer';
import DailyChallengeChat from './DailyChallengeChat';

interface WelcomeScreenProps {
    user: FirebaseUser;
    onNavigate: (view: AppView) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onNavigate }) => {
    const [content, setContent] = useState<WelcomeContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const welcomeData = await getWelcomeContent();
                setContent(welcomeData);
            } catch (error) {
                console.error("Failed to fetch welcome content:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
                <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse" />
            </div>
        );
    }
    
    if (!content) {
         return (
            <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">No hay un reto activo en este momento</h1>
                <p className="text-gray-400 mb-8">Por favor, contacta al administrador.</p>
                <button
                    onClick={() => onNavigate('account')}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                    Ir a Mi Cuenta
                </button>
            </div>
        );
    }

    const { header, imageUrl, dailyChallenge, podcast, aiHelper } = content;

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col relative">
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => onNavigate('account')}
                    className="p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-700/90 backdrop-blur-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
                    aria-label="Mi Cuenta"
                >
                    <UserIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
                    
                    <header className="text-center mt-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">{header.title}</h1>
                        <p className="text-lg text-indigo-300 mt-2">{header.subtitle}</p>
                    </header>

                    <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg shadow-black/30">
                        <img src={imageUrl} alt="Inspirational" className="w-full h-full object-cover" />
                    </div>

                    <section className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-3">{dailyChallenge.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{dailyChallenge.text}</p>
                    </section>

                    <section>
                         <AudioPlayer src={podcast.url} title={podcast.title} />
                    </section>
                    
                    <section>
                        <DailyChallengeChat 
                            userId={user.uid}
                            initialMessage={aiHelper.initialMessage}
                            systemInstruction={aiHelper.systemInstruction}
                        />
                    </section>

                    <footer className="text-center py-4 text-xs text-gray-500">
                        <p>Has completado tu fractal. ¡Sigue adelante!</p>
                    </footer>

                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;