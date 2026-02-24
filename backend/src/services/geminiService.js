import {GoogleGenerativeAI} from '@google/generative-ai';

let model;

export const initializeGemini = (apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);

    model = genAI.getGenerativeModel({
        model : "gemini-1.5-flash"
    })
}

export const generateResponse = async (prompt) => {
    if (!model) {
        throw new Error("Gemini is not initialized");
    }

    const result = await model.generateContext(prompt);
    const response = await result.response;

    return response.text();
}