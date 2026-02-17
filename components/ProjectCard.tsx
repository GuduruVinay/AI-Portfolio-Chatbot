import { ArrowUpRight } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export default function ProjectCard({ title, description, tags, link }: ProjectProps) {
  return (
    <div className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        {link && <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />}
      </div>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}