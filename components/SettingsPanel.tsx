import React from 'react';
import { TTSSettings, VoiceName } from '../types';
import { SettingsIcon, RefreshIcon } from './Icons';

interface SettingsPanelProps {
  settings: TTSSettings;
  setSettings: React.Dispatch<React.SetStateAction<TTSSettings>>;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, onReset }) => {
  
  const handleChange = <K extends keyof TTSSettings>(key: K, value: TTSSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full bg-gray-800 p-4 overflow-y-auto border-l border-gray-700 custom-scrollbar flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-500" />
            Cài đặt
        </h2>
        <button 
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Khôi phục mặc định"
        >
            <RefreshIcon className="w-3 h-3" />
            Đặt lại
        </button>
      </div>

      {/* Voice Selection */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mô hình giọng đọc</h3>
        
        <div className="space-y-2">
            <label className="text-xs text-gray-400">Giọng đọc</label>
            <select 
                value={settings.selectedVoice}
                onChange={(e) => handleChange('selectedVoice', e.target.value as VoiceName)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm text-white focus:border-blue-500 outline-none"
            >
                {Object.values(VoiceName).map(voice => (
                    <option key={voice} value={voice}>{voice}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="h-px bg-gray-700 my-4" />

      {/* Advanced Audio Settings */}
      <div className="mb-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Điều chỉnh giọng nói</h3>
        
        {/* Pitch */}
        <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-xs text-gray-400">Cao độ (Semitones)</label>
                <span className="text-xs text-blue-400">{settings.pitch > 0 ? '+' : ''}{settings.pitch}</span>
            </div>
            <input 
                type="range" 
                min="-12" max="12" step="1"
                value={settings.pitch}
                onChange={(e) => handleChange('pitch', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600">
                <span>Thấp</span>
                <span>Cao</span>
            </div>
        </div>

        {/* Speed */}
        <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-xs text-gray-400">Tốc độ đọc</label>
                <span className="text-xs text-blue-400">{settings.speakingRate}x</span>
            </div>
            <input 
                type="range" 
                min="0.5" max="2.0" step="0.1"
                value={settings.speakingRate}
                onChange={(e) => handleChange('speakingRate', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600">
                <span>Chậm</span>
                <span>Nhanh</span>
            </div>
        </div>

        {/* Volume */}
        <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-xs text-gray-400">Âm lượng</label>
                <span className="text-xs text-blue-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input 
                type="range" 
                min="0" max="2" step="0.1"
                value={settings.volume}
                onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
      </div>

      <div className="h-px bg-gray-700 my-4" />

      {/* TTS Generation Params */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Cấu hình tạo giọng</h3>
        
        {/* Sliders */}
        {[
            { label: 'Cường độ cảm xúc', key: 'emotionIntensity' as const },
            { label: 'Độ bám sát giọng', key: 'voiceSimilarity' as const },
            { label: 'Độ ngẫu nhiên', key: 'randomness' as const }
        ].map(slider => (
            <div key={slider.key} className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-xs text-gray-400">{slider.label}</label>
                    <span className="text-xs text-blue-400">{settings[slider.key]}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" max="100" 
                    value={settings[slider.key]}
                    onChange={(e) => handleChange(slider.key, parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
        ))}

        <div className="space-y-1">
            <div className="flex justify-between">
                <label className="text-xs text-gray-400">Thời gian dừng nghỉ (giây)</label>
                <span className="text-xs text-blue-400">{settings.pauseDuration}s</span>
            </div>
            <input 
                type="range" 
                min="0" max="5" step="0.1"
                value={settings.pauseDuration}
                onChange={(e) => handleChange('pauseDuration', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
        
        <div className="flex items-center justify-between pt-2">
             <label className="text-xs text-gray-400">Định dạng tệp</label>
             <select 
                value={settings.fileFormat}
                onChange={(e) => handleChange('fileFormat', e.target.value as 'mp3' | 'wav')}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 outline-none"
             >
                 <option value="mp3">MP3</option>
                 <option value="wav">WAV</option>
             </select>
        </div>
      </div>

    </div>
  );
};