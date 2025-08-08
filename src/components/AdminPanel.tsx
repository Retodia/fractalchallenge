import React, { useState, useEffect, useCallback } from 'react';
import type { WelcomeContent } from '../types';
import { getChallenges, deleteChallenge, setActiveChallenge } from '../challengeAdminService';
import { seedInitialChallenge } from '../services/seedService';
import { SparklesIcon, CheckCircleIcon, PencilIcon, TrashIcon, PlusCircleIcon } from './icons/Icons';
import ChallengeForm from './ChallengeForm';

interface AdminPanelProps {
    onLogout: () => void;
}

type AdminView = 'list' | 'form';

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('list');
    const [challenges, setChallenges] = useState<WelcomeContent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [selectedChallenge, setSelectedChallenge] = useState<WelcomeContent | null>(null);

    const loadChallenges = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const allChallenges = await getChallenges();
            setChallenges(allChallenges);
        } catch (err) {
            setError('Error al cargar los retos. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if(view === 'list') {
            loadChallenges();
        }
    }, [loadChallenges, view]);
    
    const handleSeed = async () => {
        setIsLoading(true);
        await seedInitialChallenge();
        await loadChallenges();
        setIsLoading(false);
    };

    const handleEdit = (challenge: WelcomeContent) => {
        setSelectedChallenge(challenge);
        setView('form');
    };

    const handleCreateNew = () => {
        setSelectedChallenge(null);
        setView('form');
    };

    const handleDelete = async (challenge: WelcomeContent) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este reto? Esto eliminará también sus archivos de imagen y audio.')) {
            await deleteChallenge(challenge);
            loadChallenges();
        }
    };

    const handleSetActive = async (id: string) => {
        await setActiveChallenge(id);
        loadChallenges();
    };
    
    const handleFormClose = () => {
        setView('list');
        setSelectedChallenge(null);
    }
    
    if (view === 'form') {
        return <ChallengeForm challenge={selectedChallenge} onClose={handleFormClose} />;
    }

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            <header className="p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                </div>
                <div>
                     <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all text-sm"
                    >
                        <PlusCircleIcon className="w-5 h-5"/>
                        Crear Reto
                    </button>
                    <button onClick={onLogout} className="ml-4 text-sm text-gray-300 hover:text-white">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {isLoading && <div className="text-center p-8 text-gray-400">Cargando retos...</div>}
                    {error && <div className="text-center p-8 text-red-400">{error}</div>}
                    {!isLoading && !error && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                            <ul role="list" className="divide-y divide-gray-700">
                                {challenges.length === 0 && (
                                    <li className="p-6 text-center text-gray-400">
                                        <p className="mb-4">No hay retos creados. ¡Añade uno para empezar!</p>
                                        <button 
                                            onClick={handleSeed}
                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all text-sm"
                                        >
                                            Añadir Reto de Ejemplo
                                        </button>
                                    </li>
                                )}
                                {challenges.map((challenge) => (
                                    <li key={challenge.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${challenge.isActive ? 'bg-indigo-900/20' : ''}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{challenge.dailyChallenge.title}</p>
                                            <p className="text-xs text-gray-400 truncate">{challenge.dailyChallenge.text}</p>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
                                            <button
                                                onClick={() => handleSetActive(challenge.id)}
                                                disabled={challenge.isActive}
                                                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-green-400 disabled:cursor-not-allowed transition-colors"
                                                title={challenge.isActive ? 'Reto Activo' : 'Marcar como activo'}
                                            >
                                                <CheckCircleIcon className={`w-6 h-6 ${challenge.isActive ? 'text-green-400 fill-current' : ''}`} />
                                            </button>
                                            <button
                                                 onClick={() => handleEdit(challenge)}
                                                 className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                                 title="Editar Reto"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(challenge)}
                                                className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                                                title="Eliminar Reto"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;