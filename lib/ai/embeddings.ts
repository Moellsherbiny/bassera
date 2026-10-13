
import "server-only";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

export async function createEmbedding(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      taskType,
      outputDimensionality: 768,
    },
  });

  const values = result.embeddings?.[0]?.values;

  if (!values || values.length !== 768) {
    throw new Error("Invalid embedding returned by Gemini");
  }

  return values;
}
