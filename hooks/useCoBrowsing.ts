// hooks/useCoBrowsing.ts
"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useCoBrowsing = () => {
  const router = useRouter();

  // --- 1. Navigation ---
  const navigateTo = useCallback((path: string) => {
    // Basic validation to prevent routing to non-existent pages
    if (path.startsWith('/')) {
      router.push(path);
      return `Navigating to ${path}...`;
    }
    return `Invalid path format. Path must start with '/'`;
  }, [router]);


  // --- 2. Scrolling ---
  const scrollPage = useCallback((direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (direction === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return "Scrolled to the top.";
    } 
    if (direction === 'bottom') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return "Scrolled to the bottom.";
    }
    
    // Scroll by a viewport amount (simulating a page down/up key)
    const scrollAmount = window.innerHeight * 0.8; 
    window.scrollBy({ 
      top: direction === 'down' ? scrollAmount : -scrollAmount, 
      behavior: 'smooth' 
    });
    return `Scrolled ${direction}.`;
  }, []);


  // --- 3. Highlighting Elements ---
  const highlightElement = useCallback((keyword: string) => {
    if (!keyword) return "No keyword provided.";

    // Remove existing highlights first to avoid clutter
    document.querySelectorAll('.ai-highlight').forEach(el => {
      el.classList.remove('ai-highlight', 'ring-4', 'ring-yellow-400', 'bg-yellow-100/50');
    });

    // Strategy: Find all headings and paragraphs, search for text match
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, li, button, a'));
    
    // Find the element that best matches the keyword
    const match = elements.find(el => 
      el.textContent?.toLowerCase().includes(keyword.toLowerCase())
    );

    if (match) {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Apply Tailwind classes for highlighting
      match.classList.add('ai-highlight', 'ring-4', 'ring-yellow-400', 'transition-all', 'duration-500', 'rounded-lg');
      
      // Optional: Remove highlight after 3 seconds
      setTimeout(() => {
        match.classList.remove('ai-highlight', 'ring-4', 'ring-yellow-400');
      }, 4000);

      return `Found and highlighted section containing "${keyword}".`;
    }
    
    return `Could not find any content matching "${keyword}".`;
  }, []);


  // --- 4. Form Filling ---
  const fillInput = useCallback((labelOrPlaceholder: string, value: string) => {
    // Try to find input by placeholder first
    let input = document.querySelector(`input[placeholder*="${labelOrPlaceholder}" i], textarea[placeholder*="${labelOrPlaceholder}" i]`) as HTMLInputElement;

    // If not found, try finding a label that contains the text, then find its input
    if (!input) {
        const labels = Array.from(document.querySelectorAll('label'));
        const matchingLabel = labels.find(l => l.innerText.toLowerCase().includes(labelOrPlaceholder.toLowerCase()));
        if (matchingLabel) {
            const id = matchingLabel.getAttribute('for');
            if (id) input = document.getElementById(id) as HTMLInputElement;
        }
    }

    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
      input.value = value;
      // Trigger React/Form events so state updates
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      // visual feedback
      input.classList.add('ring-4', 'ring-green-400', 'transition-all');
      setTimeout(() => input.classList.remove('ring-4', 'ring-green-400'), 2000);

      return `Filled "${labelOrPlaceholder}" with "${value}".`;
    }

    return `Could not find an input field for "${labelOrPlaceholder}".`;
  }, []);


  return {
    navigateTo,
    scrollPage,
    highlightElement,
    fillInput
  };
};