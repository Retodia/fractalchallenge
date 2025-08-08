import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './icons/Icons';

interface AudioPlayerProps {
    src: string;
    title: string;
}

const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        }
        
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        }
    }, []);

    useEffect(() => {
        if (progressBarRef.current) {
            const progress = (currentTime / duration) * 100 || 0;
            progressBarRef.current.style.setProperty('--progress', `${progress}%`);
        }
    }, [currentTime, duration]);


    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center space-x-4">
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            <button
                onClick={togglePlayPause}
                className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex-1 flex flex-col justify-center">
                <p className="font-semibold text-white truncate">{title}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 overflow-hidden">
                       <div 
                         ref={progressBarRef}
                         className="bg-indigo-400 h-full rounded-full" 
                         style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                       />
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;