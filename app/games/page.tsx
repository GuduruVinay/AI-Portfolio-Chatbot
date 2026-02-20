"use client";

import ProjectCard from "@/components/ProjectCard";

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Indie <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Games.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            A collection of solo development projects, game jam entries, and interactive experiments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ProjectCard 
            title="Unface"
            description="A psychological thriller developed entirely from scratch during a 48-hour solo game jam. Focuses on tense atmosphere and narrative discovery."
            tags={["Godot", "GDScript", "Game Jam"]}
          />
          <ProjectCard 
            title="Slide Logic"
            description="A modern, highly polished take on the classic 3x3 sliding puzzle game. Features smooth UI transitions and algorithmic puzzle generation."
            tags={["Godot", "UI/UX", "Logic"]}
          />
        </div>
      </div>
    </main>
  );
}