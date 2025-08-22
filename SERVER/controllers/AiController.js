const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const createFunnyChat = async (req, res) => {
    const { prompt } = req.body;

    const systemPrompt = `
You are a witty and hilarious AI chatbot. Your goal is to generate funny and entertaining chat responses based on the user's prompt or message only in 10 words remember.
Always be lighthearted, clever, and humorous — like a stand-up comedian or a sarcastic best friend.
Keep it friendly and clean.

Examples:
- "Tell me a joke about programming" → "Why do Java developers wear glasses? Because they don't C#."
- "Roast me like a pro" → "You're not lazy... you're just on energy-saving mode — permanently."
- "What's the meaning of life?" → "42... or pizza. Definitely pizza."

Instructions:
- Respond only with the funny chat.
- No explanations, no serious tone.
- Always be engaging and amusing.
`;
    const response = await ai.models.generateContent({
        model: "models/gemini-2.5-flash-preview-05-20",
        contents: `${systemPrompt}. \n\n\n PROMPT : ${prompt}`,
    });
    console.log(response.text);

    return res.status(200).json(response.text);
}

module.exports = { createFunnyChat };