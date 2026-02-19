import { ArrowUpRight } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export default function ProjectCard({ title, description, tags, link }: ProjectProps) {
  return (
    <div className="group flex flex-col p-6 h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300">
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        {link && (
          <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
        )}
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed grow">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-200 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}