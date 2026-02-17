"use client";

import { useCoBrowsing } from '@/hooks/useCoBrowsing';

export default function Home() {
  const { scrollPage, highlightElement, fillInput } = useCoBrowsing();

  return (
    <main className="min-h-screen p-12 space-y-24">
      {/* 1. Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold">My Creative Portfolio</h1>
        <p className="text-xl text-gray-600">Building digital experiences with AI.</p>
        
        {/* TEST BUTTONS - Remove these later */}
        <div className="fixed top-4 right-4 bg-white border p-4 shadow-lg rounded-xl flex flex-col gap-2 z-50">
          <p className="text-xs font-bold text-gray-500 uppercase">Dev Tools</p>
          <button onClick={() => scrollPage('bottom')} className="px-3 py-1 bg-blue-100 rounded text-sm hover:bg-blue-200">Test Scroll Bottom</button>
          <button onClick={() => highlightElement('Creative')} className="px-3 py-1 bg-yellow-100 rounded text-sm hover:bg-yellow-200">Test Highlight 'Creative'</button>
          <button onClick={() => fillInput('email', 'test@example.com')} className="px-3 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Test Fill Email</button>
        </div>
      </section>

      {/* 2. Projects Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-2">Project Alpha</h2>
          <p className="text-gray-600">A revolutionary AI app designed for healthcare.</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold mb-2">Project Beta</h2>
          <p className="text-gray-600">An e-commerce platform built with Next.js.</p>
        </div>
      </section>

      {/* 3. Contact Section */}
      <section className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="email-input" className="block text-sm font-medium">Email Address</label>
                <input id="email-input" type="email" placeholder="Enter email" className="w-full p-2 border rounded mt-1" />
            </div>
            <textarea placeholder="Your message" className="w-full p-2 border rounded h-32"></textarea>
        </div>
      </section>
      
      {/* Spacer to make scrolling visible */}
      <div className="h-[50vh]"></div>
    </main>
  );
}