import React, { useState } from 'react';
import type { WelcomeContent } from '../types';
import { saveChallenge, uploadFile } from '../challengeAdminService';

interface ChallengeFormProps {
    challenge: WelcomeContent | null;
    onClose: () => void;
}

type UploadState = {
    progress: number;
    url: string | null;
    error: string | null;
    isUploading: boolean;
};

const initialUploadState: UploadState = { progress: 0, url: null, error: null, isUploading: false };

const emptyFormState: Omit<WelcomeContent, 'id' | 'isActive'> = {
    header: { title: 'RetoDía', subtitle: 'Cada día cuenta. Ponle intención.' },
    imageUrl: '',
    dailyChallenge: { title: '', text: '' },
    podcast: { title: '', url: '' },
    aiHelper: { initialMessage: '', systemInstruction: '' },
};

const ChallengeForm: React.FC<ChallengeFormProps> = ({ challenge, onClose }) => {
    const [formState, setFormState] = useState(challenge ? { ...challenge } : emptyFormState);
    const [isSaving, setIsSaving] = useState(false);
    const [imageUpload, setImageUpload] = useState<UploadState>({ ...initialUploadState, url: challenge?.imageUrl || null });
    const [audioUpload, setAudioUpload] = useState<UploadState>({ ...initialUploadState, url: challenge?.podcast.url || null });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');

        setFormState(prevState => ({
            ...prevState,
            [section]: {
                // @ts-ignore
                ...prevState[section],
                [key]: value,
            },
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const setUploadState = type === 'image' ? setImageUpload : setAudioUpload;
        setUploadState({ progress: 0, url: null, error: null, isUploading: true });

        try {
            const downloadURL = await uploadFile(file, (progress) => {
                setUploadState(prev => ({ ...prev, progress }));
            });
            setUploadState({ progress: 100, url: downloadURL, error: null, isUploading: false });
            
            if (type === 'image') {
                setFormState(prev => ({ ...prev, imageUrl: downloadURL }));
            } else {
                setFormState(prev => ({ ...prev, podcast: { ...prev.podcast, url: downloadURL } }));
            }

        } catch (error) {
            setUploadState({ progress: 0, url: null, error: 'Error al subir el archivo.', isUploading: false });
        }
    };
    
    const FileInput: React.FC<{ label: string; type: 'image' | 'audio'; uploadState: UploadState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; accept: string }> = 
    ({ label, type, uploadState, onChange, accept }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300">{label}</label>
            {uploadState.isUploading && (
                <div className="w-full bg-gray-700 rounded-full h-2.5 my-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${uploadState.progress}%` }}></div>
                </div>
            )}
            {uploadState.url && !uploadState.isUploading && (
                <div className="text-xs text-green-400 truncate my-2">Archivo cargado: {uploadState.url.split('?')[0].split('%2F').pop()}</div>
            )}
             {uploadState.error && <div className="text-xs text-red-400 my-2">{uploadState.error}</div>}
            <input type="file" accept={accept} onChange={(e) => onChange(e)} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await saveChallenge(formState);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            <header className="p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20">
                <h1 className="text-xl font-bold text-white text-center">{challenge ? 'Editar Reto' : 'Crear Nuevo Reto'}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                    <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-indigo-300 border-b border-indigo-500/30 pb-2 mb-4">Contenido Principal</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="dailyChallenge.title" className="block text-sm font-medium text-gray-300">Título del Reto</label>
                                <input type="text" name="dailyChallenge.title" value={formState.dailyChallenge.title} onChange={handleChange} required className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                            </div>
                            <div>
                                <label htmlFor="dailyChallenge.text" className="block text-sm font-medium text-gray-300">Descripción del Reto</label>
                                <textarea name="dailyChallenge.text" value={formState.dailyChallenge.text} onChange={handleChange} required rows={4} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
                            </div>
                           <FileInput label="Imagen del Reto" type="image" uploadState={imageUpload} onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                        </div>
                    </section>

                    <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                         <h2 className="text-lg font-semibold text-indigo-300 border-b border-indigo-500/30 pb-2 mb-4">Podcast</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="podcast.title" className="block text-sm font-medium text-gray-300">Título del Podcast</label>
                                <input type="text" name="podcast.title" value={formState.podcast.title} onChange={handleChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                            </div>
                           <FileInput label="Audio del Podcast" type="audio" uploadState={audioUpload} onChange={(e) => handleFileChange(e, 'audio')} accept="audio/mpeg, audio/mp3" />
                        </div>
                    </section>

                    <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                         <h2 className="text-lg font-semibold text-indigo-300 border-b border-indigo-500/30 pb-2 mb-4">Asistente de IA</h2>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="aiHelper.initialMessage" className="block text-sm font-medium text-gray-300">Mensaje Inicial de la IA</label>
                                <textarea name="aiHelper.initialMessage" value={formState.aiHelper.initialMessage} onChange={handleChange} required rows={3} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
                            </div>
                            <div>
                                <label htmlFor="aiHelper.systemInstruction" className="block text-sm font-medium text-gray-300">Instrucción de Sistema para la IA (Prompt)</label>
                                <textarea name="aiHelper.systemInstruction" value={formState.aiHelper.systemInstruction} onChange={handleChange} required rows={6} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
                            </div>
                        </div>
                    </section>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-6 py-2 border border-gray-600 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving || imageUpload.isUploading || audioUpload.isUploading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar Reto'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ChallengeForm;