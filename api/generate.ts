import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY ontbreekt in Vercel" });

  try {
    const { prompt } = req.body as { prompt?: string };
    if (!prompt) return res.status(400).json({ error: "prompt ontbreekt" });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    return res.status(200).json({ text: result.response.text() });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Onbekende fout" });
  }
}
