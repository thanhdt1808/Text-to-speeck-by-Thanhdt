export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface TTSSettings {
  selectedVoice: VoiceName;
  fileFormat: 'mp3' | 'wav';
  
  // Audio Properties
  pitch: number;        // -12 to 12 semitones
  speakingRate: number; // 0.5 to 2.0
  volume: number;       // 0 to 2.0

  // TTS Config
  subtitleAccuracy: 'fast' | 'balanced' | 'accurate';
  autoGenerateSrt: boolean;
  emotionIntensity: number; // 0-100
  voiceSimilarity: number; // 0-100
  randomness: number; // 0-100
  pauseDuration: number; // seconds
}

export interface AudioGenerationResult {
  audioBuffer: AudioBuffer | null;
  blob: Blob | null;
  url: string | null;
  transcript?: string;
}

export interface ProcessingStatus {
  isGenerating: boolean;
  progress: number; // 0-100
  currentTask: string;
}