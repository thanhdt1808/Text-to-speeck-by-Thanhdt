import { GoogleGenAI, Modality } from "@google/genai";
import { TTSSettings, VoiceName } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Ideally, check for API key existence here
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateSpeech(text: string, settings: TTSSettings): Promise<string> {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please check your environment variables.");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [
          {
            parts: [
              {
                text: text,
              },
            ],
          },
        ],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: settings.selectedVoice,
              },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!audioData) {
        throw new Error("No audio data returned from the model.");
      }

      return audioData;
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();