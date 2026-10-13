import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

export const MODEL = "gemini-flash-lite-latest";

export function getGeminiClient() {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return ai;
}