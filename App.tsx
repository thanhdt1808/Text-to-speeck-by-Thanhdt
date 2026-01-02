import React, { useState } from 'react';
import { TTSSettings, VoiceName, AudioGenerationResult } from './types';
import { TextInput } from './components/TextInput';
import { SettingsPanel } from './components/SettingsPanel';
import { Player } from './components/Player';
import { geminiService } from './services/geminiService';
import { decodeAudioData, bufferToWave } from './services/audioUtils';
import { PlayIcon, StopIcon } from './components/Icons';

const DEFAULT_SETTINGS: TTSSettings = {
  selectedVoice: VoiceName.Puck,
  fileFormat: 'wav',
  
  pitch: 0,
  speakingRate: 1.0,
  volume: 1.0,

  subtitleAccuracy: 'balanced',
  autoGenerateSrt: true,
  emotionIntensity: 50,
  voiceSimilarity: 80,
  randomness: 20,
  pauseDuration: 0.5
};

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioResult, setAudioResult] = useState<AudioGenerationResult>({
    audioBuffer: null,
    blob: null,
    url: null
  });
  const [statusMessage, setStatusMessage] = useState<string>('Sẵn sàng');

  const handleResetSettings = () => {
      setSettings(DEFAULT_SETTINGS);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
        setStatusMessage('Lỗi: Vui lòng nhập văn bản.');
        return;
    }
    
    setIsGenerating(true);
    setStatusMessage('Đang tạo âm thanh...');
    setAudioResult({ audioBuffer: null, blob: null, url: null });

    try {
        const base64Audio = await geminiService.generateSpeech(text, settings);
        
        setStatusMessage('Đang xử lý âm thanh...');
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await decodeAudioData(base64Audio, audioContext);
        
        const wavBlob = bufferToWave(audioBuffer, audioBuffer.length);
        const url = URL.createObjectURL(wavBlob);
        
        setAudioResult({
            audioBuffer,
            blob: wavBlob,
            url
        });
        setStatusMessage('Hoàn tất tạo giọng.');
    } catch (error) {
        console.error(error);
        setStatusMessage('Lỗi tạo giọng nói. Kiểm tra khóa API.');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleStop = () => {
      setIsGenerating(false);
      setStatusMessage('Đã dừng.');
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-14 border-b border-gray-700 bg-gray-800 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
             <h1 className="text-lg font-bold tracking-tight text-white">Gemini TTS <span className="text-blue-400 font-normal">Pro</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
             <span>Trạng thái: <span className="text-gray-200">{statusMessage}</span></span>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
           {/* Input Area */}
           <div className="flex-1 flex flex-col min-h-0">
               <TextInput text={text} setText={setText} />
           </div>

           {/* Player Control */}
           <div className="shrink-0">
               <Player 
                    audioBuffer={audioResult.audioBuffer} 
                    blob={audioResult.blob} 
                    isGenerating={isGenerating}
                    settings={settings}
                />
           </div>

           {/* Main Action Bar */}
           <div className="shrink-0 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center px-6 shadow-xl">
               <div className="flex items-center gap-3 w-full max-w-md">
                   {isGenerating ? (
                        <button 
                            onClick={handleStop}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-medium shadow-lg shadow-red-900/30 transition"
                        >
                            <StopIcon className="w-4 h-4" />
                            Dừng tạo
                        </button>
                   ) : (
                        <button 
                            onClick={handleGenerate}
                            className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-lg shadow-blue-900/30 transition transform hover:scale-[1.02]"
                        >
                            <PlayIcon className="w-4 h-4" />
                            Tạo giọng đọc
                        </button>
                   )}
               </div>
           </div>
        </main>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 shrink-0 h-full border-l border-gray-700 bg-gray-800">
        <SettingsPanel 
            settings={settings} 
            setSettings={setSettings} 
            onReset={handleResetSettings}
        />
      </div>

    </div>
  );
};

export default App;