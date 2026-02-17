// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 2. Define the System Prompt
// This acts as the "Operating System" for the bot. It teaches the AI how to behave.
const SYSTEM_PROMPT = `
You are a Portfolio Assistant. You help users navigate and understand this portfolio website.
You have "Co-Browsing" capabilities. You can scroll, highlight, and navigate.

Your Goal:
1. Answer questions about the content visible on the page.
2. If the user wants to see something, navigate to it or scroll to it.
3. If the user wants to focus on something, highlight it.

Response Format:
You must ALWAYS return a JSON object. Do not return plain text.
The JSON object must have one of two structures:

Structure A (Talking):
{
  "type": "response",
  "message": "Your conversational answer here."
}

Structure B (Action - Tool Call):
{
  "type": "action",
  "tool": "scroll" | "highlight" | "navigate" | "fill_form",
  "args": { ...arguments for the tool... },
  "message": "Optional short text to say while doing the action (e.g., 'Sure, scrolling down.')"
}

Tools Available:
- scroll: args { direction: "up" | "down" | "top" | "bottom" }
- highlight: args { text: "text to find" }
- navigate: args { path: "/path" }
- fill_form: args { field: "field name", value: "text to fill" }

Example 1 (User: "Who is this person?"):
{ "type": "response", "message": "This is the portfolio of Alex, a Creative Developer..." }

Example 2 (User: "Show me the projects"):
{ "type": "action", "tool": "scroll", "args": { "direction": "down" }, "message": "Here are the projects." }
`;

export async function POST(req: Request) {
  try {
    // 3. Parse Incoming Data
    const { message, pageContext, history } = await req.json();

    // 4. Construct the Prompt with Context
    // We inject the "pageContext" (scraped text from frontend) so the AI knows what's on screen.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: history || [], // Maintain conversation history if needed
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7, // Creativity balance
      },
    });

    const fullPrompt = `
      ${SYSTEM_PROMPT}
      
      --- CURRENT PAGE CONTEXT ---
      ${pageContext}
      ----------------------------
      
      User Query: ${message}
    `;

    // 5. Generate Response
    const result = await chat.sendMessage(fullPrompt);
    const responseText = result.response.text();

    // 6. Clean and Parse JSON
    // Sometimes LLMs add markdown code blocks (```json ... ```). We strip them.
    const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedResponse);
    } catch (e) {
      // Fallback if AI fails to generate valid JSON
      jsonResponse = { 
        type: "response", 
        message: responseText // Return raw text if JSON parse fails
      };
    }

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}