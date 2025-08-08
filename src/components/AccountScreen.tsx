import React from 'react';
import { UserIcon } from './icons/Icons';
import type { FirebaseUser, AppView } from '../types';

interface AccountScreenProps {
    user: FirebaseUser | null;
    onLogout: () => void;
    onNavigate: (view: AppView) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ user, onLogout, onNavigate }) => {
    
    const isAdmin = user?.email === 'admin@retodia.com';
    
    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Mi Cuenta</h1>
                    <p className="text-gray-400">Gestiona tu sesión y tus datos.</p>
                </div>

                <div className="space-y-4 text-center">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Has iniciado sesión como:</p>
                        <p className="font-semibold text-white truncate">{user?.email || 'Usuario Anónimo'}</p>
                    </div>

                    <button
                        onClick={() => onNavigate(isAdmin ? 'admin' : 'welcome')}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                    >
                        {isAdmin ? 'Volver al Panel' : 'Volver a Inicio'}
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex justify-center py-3 px-4 border border-red-500/50 rounded-lg shadow-sm text-sm font-medium text-red-300 bg-red-600/20 hover:bg-red-600/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-8 text-center">
                    Tu información está guardada de forma segura en la nube.
                </p>
            </div>
        </div>
    );
};

export default AccountScreen;