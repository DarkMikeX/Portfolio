import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../data/mock';

const categories = ['All', 'Web Development', 'Software Engineering', 'UI/UX Design', 'Freelancing'];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState(null);

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-[#ff2244]">Projects</span>
          </h2>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            A showcase of my recent work demonstrating expertise across technologies.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#ff2244] text-white'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white border border-[#252525]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#1a1a1a] border border-[#252525] hover:border-[#ff2244]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-[#ff2244] text-white text-xs font-medium rounded-full">
                    {project.category.split(' ')[0]}
                  </span>
                </div>

                {/* Overlay Links */}
                <div
                  className={`absolute inset-0 flex items-center justify-center gap-3 bg-[#121212]/90 transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <a
                    href={project.link}
                    className="p-3 bg-[#ff2244] hover:bg-[#e61e3c] rounded-full text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <a
                    href={project.github}
                    className="p-3 bg-[#252525] hover:bg-[#333] rounded-full text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-[#888] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-[#252525] text-[#888] text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
