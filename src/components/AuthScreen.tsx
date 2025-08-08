import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { SparklesIcon, GoogleIcon, AppleIcon } from './icons/Icons';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }
     if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
    } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
        else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta.');
        else if (err.code === 'auth/email-already-in-use') setError('Este correo ya está registrado. Intenta iniciar sesión.');
        else setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setLoading(true);
      setError('');
      try {
          await signInWithPopup(auth, googleProvider);
      } catch (err) {
          setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
      } finally {
          setLoading(false);
      }
  };

  // Apple login requires more setup, so we disable it for now.
  const handleAppleLogin = () => {
      setError('El inicio de sesión con Apple no está disponible en este momento.');
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 mb-4 bg-indigo-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido a RetoDía</h1>
          <p className="text-gray-400">{isLogin ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500" placeholder="tu@correo.com" />
          </div>
          <div>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500" placeholder="Contraseña" />
          </div>
          {error && <p className="text-red-400 text-sm mt-1 text-center">{error}</p>}
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:bg-indigo-800">
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </div>
        </form>

        <div className="text-center my-4">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-400 hover:text-indigo-300">
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-600" /></div>
          <div className="relative flex justify-center text-sm"><span className="bg-gray-800 px-2 text-gray-400">O</span></div>
        </div>
        
        <div className="space-y-4">
            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-white text-gray-800 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:opacity-50">
                <GoogleIcon className="w-5 h-5 mr-3" />
                Continuar con Google
            </button>
             <button type="button" onClick={handleAppleLogin} disabled={true} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-300 text-gray-500 text-sm font-medium cursor-not-allowed">
                <AppleIcon className="w-5 h-5 mr-3" />
                Continuar con Apple
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;