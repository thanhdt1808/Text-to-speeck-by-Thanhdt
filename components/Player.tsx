import React, { useEffect, useRef, useState } from 'react';
import { PlayIcon, PauseIcon, DownloadIcon } from './Icons';
import { TTSSettings } from '../types';

interface PlayerProps {
  audioBuffer: AudioBuffer | null;
  blob: Blob | null;
  isGenerating: boolean;
  settings: TTSSettings;
}

export const Player: React.FC<PlayerProps> = ({ audioBuffer, blob, isGenerating, settings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Update effects in real-time if playing
  useEffect(() => {
    if (sourceRef.current && isPlaying) {
        updateAudioParams();
    }
  }, [settings.pitch, settings.speakingRate, settings.volume]);

  useEffect(() => {
    return () => stopAudio();
  }, [audioBuffer]);

  const updateAudioParams = () => {
      if (sourceRef.current && gainNodeRef.current) {
          // Pitch (Detune in cents)
          sourceRef.current.detune.value = settings.pitch * 100;
          // Rate (PlaybackRate)
          sourceRef.current.playbackRate.value = settings.speakingRate;
          // Volume
          gainNodeRef.current.gain.value = settings.volume;
      }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) { /* ignore */ }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = async () => {
    if (!audioBuffer) return;

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
    }

    stopAudio();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    
    const gainNode = audioContextRef.current.createGain();
    
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    sourceRef.current = source;
    gainNodeRef.current = gainNode;
    
    // Apply initial settings
    updateAudioParams();
    
    source.onended = () => {
        setIsPlaying(false);
    };

    source.start(0);
    setIsPlaying(true);
  };

  const handleDownload = () => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gemini-tts-ketqua-${Date.now()}.${settings.fileFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 border border-gray-700 mt-4 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="text-gray-200 font-semibold text-sm">Điều khiển phát lại</h3>
        <p className="text-xs text-gray-500">
            {isGenerating ? 'Đang tạo âm thanh...' : audioBuffer ? 'Sẵn sàng phát' : 'Chưa có âm thanh'}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button 
            onClick={isPlaying ? stopAudio : playAudio}
            disabled={!audioBuffer || isGenerating}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                !audioBuffer || isGenerating 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30'
            }`}
        >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </button>

        <div className="h-8 w-px bg-gray-700"></div>

        <button 
            disabled={!blob}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
            title="Tải xuống âm thanh"
        >
            <DownloadIcon className="w-4 h-4" />
            <span>Tải xuống</span>
        </button>
      </div>
    </div>
  );
};