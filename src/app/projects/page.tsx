"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Code, ChevronRight, Eye } from "lucide-react";
import { projects } from "@/data/projects";
import { showcaseProjects } from "@/data/showcase";

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.push("/login"); return; }
        setUser(data.user);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 text-white shadow-lg shadow-purple-500/20">
          <Sparkles size={22} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Projects 🚀</h1>
          <p className="text-xs sm:text-sm text-gray-500">Build fun projects and show off your skills!</p>
        </div>
      </div>

      {/* Interactive Showcase */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2 text-white shadow-lg shadow-orange-500/20">
            <Sparkles size={16} />
          </div>
          <h2 className="text-base font-extrabold text-gray-800">Interactive Showcase</h2>
          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">Click. Watch. Learn.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {showcaseProjects.map((project) => (
            <Link
              key={project.id}
              href={`/showcase/${project.id}`}
              className="group bg-white rounded-2xl shadow-md border border-yellow-100 hover:border-yellow-300 card-hover overflow-hidden relative block"
            >
              <div className="h-24 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                {project.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800">
                    🎮 Interactive
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    project.difficulty === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{project.hook}</p>
                <div className="flex items-center gap-1 text-orange-600 text-[11px] font-bold mt-2 group-hover:gap-2 transition-all">
                  <Eye size={12} /> Explore <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Step-by-Step Projects */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-2 text-white shadow-lg shadow-purple-500/20">
          <Code size={16} />
        </div>
        <h2 className="text-base font-extrabold text-gray-800">Step-by-Step Projects</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project, idx) => {
          const gradients = [
            "bg-gradient-to-br from-purple-500 to-pink-500",
            "bg-gradient-to-br from-blue-500 to-cyan-500",
            "bg-gradient-to-br from-orange-500 to-amber-500",
          ];
          const shadows = [
            "shadow-purple-500/20",
            "shadow-blue-500/20",
            "shadow-orange-500/20",
          ];
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group bg-white rounded-2xl shadow-md border border-gray-100 card-hover overflow-hidden relative block"
            >
              <div className={`h-2 ${gradients[idx % gradients.length]}`} />
              <div className="p-5 sm:p-6">
                <div className={`${gradients[idx % gradients.length]} rounded-xl p-3 text-white shadow-lg ${shadows[idx % shadows.length]} inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{project.emoji}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    project.difficulty === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-gray-800 mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {project.emoji} {project.title}
                </h3>

                <p className="text-xs text-purple-600 font-semibold mb-2">{project.hook}</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold group-hover:gap-2 transition-all">
                  Start Project <ChevronRight size={14} />
                </div>

                {user?.role === "admin" && (
                  <Link
                    href={`/admin/projects?project=${project.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-all"
                  >
                    <Code size={10} /> View Submissions
                  </Link>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
