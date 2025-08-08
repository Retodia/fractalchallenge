import React, { useState, useCallback, useEffect } from 'react';
import type { ChatMessage, FractalData, FirebaseUser, AppView } from './types';
import { getAiResponse } from './services/geminiService';
import { getFractalData, saveFractalDataToFirestore, getUserData, createUserDocument } from './services/firestoreService';
import ChatWindow from './components/ChatWindow';
import FractalDisplay from './components/FractalDisplay';
import AuthScreen from './components/AuthScreen';
import { initialFractalData, initialMessages } from './constants';
import { SparklesIcon } from './components/icons/Icons';
import WelcomeScreen from './components/WelcomeScreen';
import AccountScreen from './components/AccountScreen';
import AdminPanel from './components/AdminPanel';
import { auth } from './firebase';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('loading');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [fractalData, setFractalData] = useState<FractalData>(initialFractalData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [conversationStarted, setConversationStarted] = useState<boolean>(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userData = await getUserData(firebaseUser.uid);
        if (!userData) {
          // New user, create their document
          await createUserDocument(firebaseUser);
        }

        if (userData?.role === 'admin') {
          setIsAdmin(true);
          setView('admin');
          return;
        }

        const storedData = await getFractalData(firebaseUser.uid);
        if (storedData) {
          if (storedData.isComplete) {
            setFractalData(storedData.fractal);
            setIsComplete(true);
            setView('welcome');
          } else {
            // Resume session from Firestore
            setFractalData(storedData.fractal || initialFractalData);
            setCurrentPhase(storedData.phase || 1);
            // Chat history can be re-fetched or managed differently in prod
            setConversationStarted(true);
            setView('chat');
          }
        } else {
          // New user, start chat
           setView('chat');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setView('auth');
        // Reset state on logout
        setFractalData(initialFractalData);
        setChatMessages(initialMessages);
        setCurrentPhase(1);
        setIsComplete(false);
        setConversationStarted(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNextPhase = useCallback(() => {
    if (currentPhase < 4) {
      setCurrentPhase(prevPhase => prevPhase + 1);
    } else {
       setIsComplete(true);
    }
  }, [currentPhase]);
  
  // Save to Firestore when complete
  useEffect(() => {
      if (isComplete && user && view !== 'welcome') {
          setIsLoading(true);
          saveFractalDataToFirestore(user.uid, fractalData, currentPhase, true)
            .then(() => {
                console.log("Save successful, marking as complete.");
                setView('complete');
            })
            .catch(err => console.error("Failed to save fractal data:", err))
            .finally(() => setIsLoading(false));
      }
  }, [isComplete, user, fractalData, view, currentPhase]);


  // Persist progress to Firestore on data change
   useEffect(() => {
    if (user && view === 'chat' && !isComplete && conversationStarted) {
        saveFractalDataToFirestore(user.uid, fractalData, currentPhase, false);
    }
  }, [fractalData, currentPhase, user, view, isComplete, conversationStarted]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const newUserMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: messageText };
    setChatMessages(prev => [...prev, newUserMessage]);
    
    if (!conversationStarted) {
        setConversationStarted(true);
        setIsLoading(true);
        setTimeout(() => {
             const phase1IntroMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                text: 'Perfecto. Comencemos contigo: tu "YO". ¿Quién eres en tu centro? ¿Qué te mueve? Puedes empezar describiendo qué te apasiona o con una frase que te represente.'
            };
            setChatMessages(prev => [...prev, phase1IntroMessage]);
            setIsLoading(false);
        }, 1000);
        return;
    }

    setIsLoading(true);

    try {
      const currentHistory = [...chatMessages, newUserMessage];
      const historyToSend = currentHistory.slice(-12);
      const aiResponse = await getAiResponse(user.uid, currentPhase, historyToSend, fractalData);
      
      if (aiResponse) {
        setChatMessages(prev => [ ...prev, { id: crypto.randomUUID(), role: 'model', text: aiResponse.respuesta_conversacional }]);
        
        setFractalData(prevData => {
            const newData = { ...prevData };
            switch(currentPhase) {
                case 1: newData.dimension1 = { ...prevData.dimension1, ...aiResponse.datos }; break;
                case 2: newData.dimension2 = { ...prevData.dimension2, ...aiResponse.datos }; break;
                case 3: newData.dimension3 = aiResponse.datos; break;
                case 4: newData.dimension4 = { ...prevData.dimension4, ...aiResponse.datos }; break;
            }
            return newData;
        });

        if (aiResponse.fase_completa) {
          handleNextPhase();
        }
      }

    } catch (error) {
      console.error("Error communicating with AI:", error);
      setChatMessages(prev => [ ...prev, { id: crypto.randomUUID(), role: 'model', text: 'Lo siento, he encontrado un error al procesar tu solicitud. Por favor, inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatMessages, currentPhase, fractalData, handleNextPhase, conversationStarted, user]);
  
  const handleLogout = () => {
      auth.signOut();
  }
  
  const handleNavigate = useCallback((targetView: AppView) => {
      if (targetView === 'admin' && isAdmin) {
        setView('admin');
      } else if (targetView !== 'admin') {
        setView(targetView);
      }
  }, [isAdmin]);

  // --- RENDER LOGIC ---

  if (view === 'loading') {
      return (
          <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
              <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse" />
          </div>
      );
  }

  if (view === 'auth') {
    return <AuthScreen />;
  }
  
  if (view === 'admin' && isAdmin) {
      return <AdminPanel onLogout={handleLogout} />;
  }

  if (view === 'chat' && user) {
    return (
      <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-[45%] lg:w-[40%] flex-shrink-0 h-1/2 md:h-full flex flex-col">
              <ChatWindow messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isLoading} phase={currentPhase} userId={user.uid} />
          </div>
          <div className="flex-1 h-1/2 md:h-full overflow-y-auto border-t-2 md:border-t-0 md:border-l-2 border-gray-700">
              <header className="p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 hidden md:block">
                  <h1 className="text-xl font-bold text-white text-center">Tu Fractal en Tiempo Real</h1>
              </header>
              <FractalDisplay data={fractalData} currentPhase={currentPhase} />
          </div>
      </div>
    );
  }
  
  if (view === 'complete') {
    return (
       <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            <div className="h-full overflow-y-auto">
                <header className="p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white text-center flex-1">Tu Fractal Personal Completo</h1>
                </header>
                <FractalDisplay data={fractalData} currentPhase={5} />
                <div className="p-6 text-center">
                    <button 
                        onClick={() => setView('welcome')}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
  }

  if (view === 'welcome' && user) {
      return <WelcomeScreen user={user} onNavigate={handleNavigate} />;
  }

  if (view === 'account' && user) {
      return <AccountScreen user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }


  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse" />
    </div>
  );
};

export default App;