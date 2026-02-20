"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useCoBrowsing = () => {
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    if (path.startsWith('/')) {
      router.push(path);
      return `Navigating to ${path}...`;
    }
    return `Invalid path format.`;
  }, [router]);

  const scrollPage = useCallback((direction: string) => {
    if (direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    else {
        const amount = window.innerHeight * 0.8;
        window.scrollBy({ top: direction === 'down' ? amount : -amount, behavior: 'smooth' });
    }
    return `Scrolled ${direction}.`;
  }, []);

  // --- UPGRADED HIGHLIGHT UI ---
  const highlightElement = useCallback((keyword: string) => {
    if (!keyword) return "No text provided.";
    
    // Define the new aesthetic classes (Glow, Scale, Tint)
    const highlightClasses = [
        'ai-highlight', 'ring-4', 'ring-indigo-500/70', 
        'shadow-[0_0_30px_rgba(99,102,241,0.4)]', 'scale-[1.02]', 
        'z-50', 'relative', 'transition-all', 'duration-500', 
        'bg-indigo-50/50', 'dark:bg-indigo-900/30', 'rounded-xl'
    ];

    // Clean up old highlights
    document.querySelectorAll('.ai-highlight').forEach(el => {
        el.classList.remove(...highlightClasses);
    });

    const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, li, button, a, div.group'));
    const match = elements.find(el => el.textContent?.toLowerCase().includes(keyword.toLowerCase()));

    if (match) {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Apply the new classes
      match.classList.add(...highlightClasses);
      
      // Gracefully remove them after 3.5 seconds
      setTimeout(() => {
        match.classList.remove(...highlightClasses);
      }, 3500);
      
      return `Highlighted "${keyword}".`;
    }
    return `Text "${keyword}" not found.`;
  }, []);

  const fillInput = useCallback((field: string, value: string) => {
    let input = document.querySelector(`input[placeholder*="${field}" i], textarea[placeholder*="${field}" i]`) as HTMLInputElement;
    if (!input) {
         const labels = Array.from(document.querySelectorAll('label'));
         const match = labels.find(l => l.innerText.toLowerCase().includes(field.toLowerCase()));
         if (match) input = document.getElementById(match.getAttribute('for') || '') as HTMLInputElement;
    }

    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true })); 
      
      input.classList.add('ring-4', 'ring-green-400', 'transition-all', 'duration-300');
      setTimeout(() => input.classList.remove('ring-4', 'ring-green-400'), 2000);
      return `Filled ${field}.`;
    }
    return `Input "${field}" not found.`;
  }, []);

  return { navigateTo, scrollPage, highlightElement, fillInput };
};