import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Extract customApiKey from the request body
    const { message, pageContext, history, customApiKey } = await req.json();

    // 2. Decide which key to use (User's key > Your .env key)
    const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKeyToUse) {
      return NextResponse.json({ 
        error: "Missing API Key. Please click the key icon in the chat to add yours." 
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKeyToUse);
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: `You are an AI co-browsing assistant for a developer's portfolio website. 
You can help the user navigate, scroll, highlight text, and fill out forms.

CRITICAL RULES FOR SCROLLING: 
The user provides the text of the ENTIRE webpage in the prompt context. Most of this text is OFF-SCREEN. 
If the user asks you to scroll to a section (e.g., "projects", "featured projects", "contact", "about", "skills"):
1. You MUST ALWAYS execute the scroll action tool. 
2. NEVER tell the user they are "already viewing it". ALWAYS fire the JSON command.

When you need to take an action, you MUST reply with a RAW JSON object (no markdown formatting, no backticks) in the following format:

- To scroll: {"type": "action", "tool": "scroll", "args": {"target": "projects"}, "message": "Scrolling to projects!"} (Valid targets: top, bottom, up, down, projects, contact, about, skills)
- To highlight: {"type": "action", "tool": "highlight", "args": {"keyword": "React"}, "message": "Highlighting React!"}
- To navigate: {"type": "action", "tool": "navigate", "args": {"path": "/games"}, "message": "Taking you to games!"}
- To fill form: {"type": "action", "tool": "fill_form", "args": {"field": "Email", "value": "test@test.com"}, "message": "Filling form!"}

If no action is needed, just reply with a normal conversational text message.

Current Page Context:
${pageContext.substring(0, 3000)}`
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    try {
        const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const json = JSON.parse(cleanedText);
        return NextResponse.json(json);
    } catch (e) {
        return NextResponse.json({ type: "text", message: text });
    }

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Check if the error is specifically because of an invalid API key
    if (error.message?.includes("API key not valid")) {
        return NextResponse.json({ error: "The API key provided is invalid." }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message || "Failed to connect to Gemini." }, { status: 500 });
  }
}