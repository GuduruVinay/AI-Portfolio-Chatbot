"use client";

import ProjectCard from "@/components/ProjectCard";
import { Github, Linkedin, Mail, Code2, Terminal, Cpu, Database } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-blue-400/20 dark:bg-blue-900/20 rounded-[100%] blur-3xl -z-10 opacity-50 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Available for new projects
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Building with <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Intelligence.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            I'm a Full Stack Developer specializing in AI Agents. 
            <br className="hidden md:block" />
            Try asking the chatbot to <span className="font-bold text-slate-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 px-1 rounded">"scroll to projects"</span> or <span className="font-bold text-slate-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 px-1 rounded">"fill out the contact form"</span>.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <a 
              href="#projects" 
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all hover:scale-105 shadow-lg shadow-slate-900/20"
            >
              View Work
            </a>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-12 text-center">Tech Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-slate-700 transition-all group">
                <Code2 className="w-10 h-10 mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Next.js 14</h3>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-purple-100 dark:hover:border-slate-700 transition-all group">
                <Terminal className="w-10 h-10 mx-auto mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">TypeScript</h3>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-orange-100 dark:hover:border-slate-700 transition-all group">
                <Cpu className="w-10 h-10 mx-auto mb-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Generative AI</h3>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-slate-700 transition-all group">
                <Database className="w-10 h-10 mx-auto mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Backend</h3>
             </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Featured Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              A selection of my recent work, focusing on AI agents and responsive interfaces.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard 
              title="AI Co-Browsing Agent"
              description="A conversational agent that can navigate, scroll, and interact with this very website using the Gemini API. Features real-time DOM manipulation."
              tags={["Next.js", "Gemini", "Tailwind CSS"]}
            />
            <ProjectCard 
              title="Neuro-Finance Dashboard"
              description="Real-time financial analytics platform using predictive machine learning models to forecast market trends."
              tags={["Python", "React", "TensorFlow"]}
            />
            <ProjectCard 
              title="EcoTrack Mobile"
              description="A React Native application for tracking carbon footprints with image recognition for recycling verification."
              tags={["React Native", "Vision API", "Node.js"]}
            />
            <ProjectCard 
              title="Generative UI System"
              description="An experimental design system that generates component layouts based on user intent using Large Language Models."
              tags={["TypeScript", "OpenAI", "React"]}
            />
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Me</h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                I am a passionate developer who believes the future of the web is <span className="font-bold text-blue-600 dark:text-blue-400">agentic</span>. 
                Instead of just clicking buttons, I build interfaces that users can converse with.
              </p>
              
              <div className="flex gap-4 pt-4">
                <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center relative">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-64 h-64 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">👨‍💻</div>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">dev_mode: active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Get In Touch</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Have a project in mind? Let's chat.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea 
                  id="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} AI Portfolio. Built with <span className="text-blue-500 font-semibold">Next.js</span> & <span className="text-purple-500 font-semibold">Gemini</span>.
        </p>
      </footer>
    </main>
  );
}