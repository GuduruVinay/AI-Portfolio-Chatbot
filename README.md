# AI Portfolio Chatbot

A modern, interactive developer portfolio that goes beyond clicking and scrolling. This project features a built-in AI Co-Pilot (powered by Gemini 2.5 Flash) that can actively read the page context, navigate routes, highlight elements, and even fill out contact forms for the user using voice or text commands.

## Key Features

- **Agentic Co-Browsing:** The AI doesn't just chat; it interacts with the DOM. You can ask it to "scroll to my Godot games," "highlight my web development skills," or "fill out the email form."
- **Voice Commands:** Integrated Web Speech API allows users to hold a microphone button and speak directly to the AI.
- **Context-Aware:** The AI scrapes the visible viewport and page structure, allowing it to answer specific questions about featured projects like the digital catalogue, YouTube clone, or game jam entries like _Unface_.
- **Interactive Permissions:** Security first. Before the AI executes sensitive DOM actions (like filling out input fields), it renders a UI card asking the user to Approve or Deny the action.
- **Modern UI/UX:** Built with Tailwind CSS v4, featuring glassmorphism, smooth scrolling, and an integrated Dark/Light mode toggle.
- **Markdown Chat:** The chat widget fully supports markdown rendering for rich text responses.

## Tech Stack

- **Framework:** Next.js 14/15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Lucide React Icons
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
- **Theming:** `next-themes`

## Getting Started

### Prerequisites

Make sure you have Node.js installed (v18+ recommended) and a free API key from [Google AI Studio](https://aistudio.google.com/).

### Installation

## Clone the repository

```bash
git clone https://github.com/GuduruVinay/AI-Portfolio-Chatbot.git
cd AI-Portfolio-Chatbot
```

## Install Dependencies

```bash
npm install
```

## Run the project

```bash
npm run dev
```

## GitHub Link

https://github.com/GuduruVinay/AI-Portfolio-Chatbot
