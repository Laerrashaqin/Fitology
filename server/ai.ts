import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to check if error is a rate limit, quota, or network busy error
export function isRateLimitOrQuotaError(err: any): boolean {
  const message = String(err?.message || "").toLowerCase();
  const status = err?.status;
  return (
    status === 429 ||
    status === 503 ||
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("limit") ||
    message.includes("resourceexhausted") ||
    message.includes("exhausted") ||
    message.includes("rate limit")
  );
}

// Get list of all configured API keys
export function getApiKeys(): string[] {
  const keys = [
    process.env.CUSTOM_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    process.env.CUSTOM_GEMINI_API_KEY_2,
    process.env.CUSTOM_GEMINI_API_KEY_3,
  ].filter((k): k is string => !!k && k.trim() !== "");

  return keys;
}

// Keep a fallback key pool. We'll instantiate GoogleGenAI instances on-demand
const clientsPool: { [key: string]: GoogleGenAI } = {};

function getClientForApiKey(key: string): GoogleGenAI {
  if (!clientsPool[key]) {
    clientsPool[key] = new GoogleGenAI({ apiKey: key });
  }
  return clientsPool[key];
}

// Default client for backwards-compatibility
export function getAi(): GoogleGenAI {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("API key is required. Please add CUSTOM_GEMINI_API_KEY in the Settings menu -> API Keys/Secrets.");
  }
  return getClientForApiKey(keys[0]);
}

/**
 * Generates content using available API keys in rotation/fallback.
 * If one key gets rate limited or throws a quota error, it automatically falls back to the next key.
 */
export async function generateContentWithRotation(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("No Gemini API Keys configured. Please check your environment variables.");
  }

  let lastError: any = null;

  // Attempt each key in sequence
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      console.log(`[AI Pool] Attempting request using API Key ${i + 1} of ${keys.length}`);
      const client = getClientForApiKey(key);
      const response = await client.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config,
      });
      console.log(`[AI Pool] Request succeeded using API Key ${i + 1}`);
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI Pool] API Key ${i + 1} failed: ${err.message || err}`);
      
      // If we have more keys and this is a rate limit / quota issue, continue loop to next key.
      if (i < keys.length - 1 && isRateLimitOrQuotaError(err)) {
        console.warn(`[AI Pool] Rate limit or quota hit. Rotating to next API Key...`);
        continue;
      }
      // If it's a fatal validation or syntax error, throw immediately to avoid infinite tries on bad inputs
      if (!isRateLimitOrQuotaError(err)) {
        throw err;
      }
    }
  }

  // If we reach here, all keys failed
  throw lastError || new Error("All API keys in pool failed.");
}
