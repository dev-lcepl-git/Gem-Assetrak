import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, INITIAL_ASSETS } from "../constants";

// Create a context string from the asset data
const ASSET_CONTEXT = JSON.stringify(INITIAL_ASSETS.map(a => ({
    id: a.id,
    name: a.name,
    model: a.model,
    status: a.status,
    notes: a.notes,
    spares: a.spareParts
})));

const fullSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nCURRENT ASSET DATA:\n${ASSET_CONTEXT}`;

let aiClient: GoogleGenAI | null = null;

export const initializeGenAI = () => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment variables.");
        return null;
    }
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiClient;
};

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
    const ai = initializeGenAI();
    if (!ai) {
        return "API_KEY is missing. Please configure the environment.";
    }

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: fullSystemInstruction,
                temperature: 0.2, // Low temperature for factual retrieval from context
            },
            history: history.map(h => ({
                role: h.role,
                parts: h.parts
            }))
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return "Sorry, I encountered an error processing your request.";
    }
};