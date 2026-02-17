"use client";

import ProjectCard from "@/components/ProjectCard";
import { Github, Code2, Terminal, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-600 mb-4 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Available for new projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Building with <span className="text-blue-600">Intelligence.</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            I'm a Full Stack Developer specializing in AI Agents and Modern Web Interfaces. 
            Try asking the chatbot to <span className="font-bold text-slate-800">"scroll to projects"</span> or <span className="font-bold text-slate-800">"fill out the contact form"</span>.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-transform hover:scale-105">
              View Work
            </button>
            <button className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors">
              Contact Me
            </button>
          </div>
        </div>
      </section>


      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8 text-center">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {/* Simple visual placeholders for skills */}
             <div className="p-4 hover:bg-slate-50 rounded-xl transition">
                <Code2 className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold">Next.js 14</h3>
             </div>
             <div className="p-4 hover:bg-slate-50 rounded-xl transition">
                <Terminal className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold">TypeScript</h3>
             </div>
             <div className="p-4 hover:bg-slate-50 rounded-xl transition">
                <Cpu className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                <h3 className="font-semibold">Generative AI</h3>
             </div>
             <div className="p-4 hover:bg-slate-50 rounded-xl transition">
                <Github className="w-8 h-8 mx-auto mb-3 text-slate-700" />
                <h3 className="font-semibold">Open Source</h3>
             </div>
          </div>
        </div>
      </section>


      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Projects</h2>
            <p className="text-slate-600 max-w-2xl">
              A selection of projects where design meets artificial intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <ProjectCard 
              title="AI Co-Browsing Agent"
              description="A conversational agent that can navigate, scroll, and interact with this very website using the Gemini API."
              tags={["Next.js", "Gemini 2.5 Flash", "Tailwind"]}
            />
            <ProjectCard 
              title="Neuro-Finance Dashboard"
              description="Real-time financial analytics platform using predictive machine learning models to forecast market trends."
              tags={["Python", "React", "TensorFlow"]}
            />
            <ProjectCard 
              title="EcoTrack Mobile"
              description="A React Native application for tracking carbon footprints with image recognition for recycling."
              tags={["React Native", "Vision API", "Node.js"]}
            />
            <ProjectCard 
              title="Generative UI System"
              description="An experimental design system that generates component layouts based on user intent."
              tags={["TypeScript", "Figma API", "OpenAI"]}
            />
          </div>
        </div>
      </section>


      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-blue-400">About Me</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              I am a passionate developer who believes the future of the web is agentic. 
              Instead of just clicking buttons, users should be able to converse with interfaces.
            </p>
            <p className="text-slate-400">
              When I'm not coding, I'm exploring LLM architecture, hiking, or brewing the perfect cup of coffee.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-linear-to-tr from-blue-500 to-purple-600 rounded-full blur-3xl opacity-50 absolute"></div>
            <div className="relative w-64 h-64 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center">
              <span className="text-slate-500 font-mono">Image Placeholder</span>
            </div>
          </div>
        </div>
      </section>


      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Get In Touch</h2>
            <p className="text-slate-600 mt-2">Have a project in mind? Let's chat.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                ></textarea>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200">
        <p>© {new Date().getFullYear()} AI Portfolio. Built with Next.js & Gemini.</p>
      </footer>
    </main>
  );
}