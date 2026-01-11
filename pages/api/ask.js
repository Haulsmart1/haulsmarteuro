// /pages/api/ask.js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });

        const aiResponse = response.choices[0]?.message?.content;
        res.status(200).json({ result: aiResponse });
    } catch (error) {
        console.error("OpenAI error:", error);
        res.status(500).json({ error: "Something went wrong with OpenAI" });
    }
}
