import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a Portfolio Assistant. You have "Co-Browsing" capabilities.
Your Goal: Help users explore this site by answering questions or performing actions.

Response Format (JSON ONLY):
1. For talking: { "type": "response", "message": "..." }
2. For actions: { "type": "action", "tool": "scroll" | "highlight" | "navigate" | "fill_form", "args": {...}, "message": "..." }

Tools:
- scroll: { direction: "up" | "down" | "top" | "bottom" }
- highlight: { keyword: "text to find" }
- navigate: { path: "/..." }
- fill_form: { field: "label", value: "text" }
`;

export async function POST(req: Request) {
  try {
    const { message, pageContext, history } = await req.json();

    // *** FIX: CHANGED MODEL TO GEMINI-1.5-FLASH ***
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: history || [],
    });

    const fullPrompt = `
      ${SYSTEM_PROMPT}
      
      --- VISIBLE PAGE CONTENT ---
      ${pageContext}
      ----------------------------
      
      User: ${message}
    `;

    const result = await chat.sendMessage(fullPrompt);
    const responseText = result.response.text();

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const parsed = JSON.parse(cleanJson);
        return NextResponse.json(parsed);
    } catch (e) {
        return NextResponse.json({ type: "response", message: responseText });
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}