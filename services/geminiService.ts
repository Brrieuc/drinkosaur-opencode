import { GoogleGenAI, Type } from "@google/genai";

export const parseDrinkWithGemini = async (description: string): Promise<{ name: string; volumeMl: number; abv: number; icon: string } | null> => {
  // Read API key from environment exposed to the browser via Vite
  // Best practice: use a VITE_ prefixed env var. Fallbacks are intentionally avoided
  // to prevent accidentally sending secrets to the client.
  const apiKey = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) || undefined;

  // Prevent crash if API key is missing
  if (!apiKey) {
    console.warn("VITE_API_KEY is missing. AI features will not work in the browser.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract drink details from this description: "${description}". Return JSON. Estimate standard values if not specified. Icon should be a single emoji.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            volumeMl: { type: Type.NUMBER, description: "Volume in milliliters" },
            abv: { type: Type.NUMBER, description: "Alcohol percentage (e.g. 5.5)" },
            icon: { type: Type.STRING, description: "A single emoji representing the drink" }
          },
          required: ['name', 'volumeMl', 'abv', 'icon']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini parsing failed", error);
    return null;
  }
};
