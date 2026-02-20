"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useCoBrowsing = () => {
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    // FIX: Allow both standard routes ('/games') and hash links ('#projects')
    if (path.startsWith('/') || path.startsWith('#')) {
      router.push(path);
      return `Navigating to ${path}...`;
    }
    return `Invalid path format.`;
  }, [router]);

  // FIX: Smarter scrolling that supports IDs
  const scrollPage = useCallback((target: string) => {
    if (!target) return "No target specified.";
    
    // Normalize the target string (remove hashes, make lowercase)
    const t = target.toLowerCase().replace('#', '');
    
    // 1. Handle standard directions
    if (t === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return 'Scrolled to top.'; }
    if (t === 'bottom') { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); return 'Scrolled to bottom.'; }
    if (t === 'up') { window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' }); return 'Scrolled up.'; }
    if (t === 'down') { window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }); return 'Scrolled down.'; }
    
    // 2. Handle Semantic IDs (e.g., "projects", "contact", "about", "skills")
    const element = document.getElementById(t);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return `Scrolled to the ${t} section.`;
    }
    
    // 3. Fallback
    window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
    return `Scrolled page (Section '${t}' not found).`;
  }, []);

  const highlightElement = useCallback((keyword: string) => {
    if (!keyword) return "No text provided.";
    
    const highlightClasses = [
        'ai-highlight', 'ring-4', 'ring-indigo-500/70', 
        'shadow-[0_0_30px_rgba(99,102,241,0.4)]', 'scale-[1.02]', 
        'z-50', 'relative', 'transition-all', 'duration-500', 
        'bg-indigo-50/50', 'dark:bg-indigo-900/30', 'rounded-xl'
    ];

    document.querySelectorAll('.ai-highlight').forEach(el => {
        el.classList.remove(...highlightClasses);
    });

    const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, li, button, a, div.group'));
    const match = elements.find(el => el.textContent?.toLowerCase().includes(keyword.toLowerCase()));

    if (match) {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      match.classList.add(...highlightClasses);
      setTimeout(() => match.classList.remove(...highlightClasses), 3500);
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