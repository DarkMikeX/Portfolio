import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Twitter, Download } from 'lucide-react';
import { useBootstrap } from '../context/BootstrapContext';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { data, loading } = useBootstrap();
  const personalInfo = data?.personalInfo ?? null;
  const stats = data?.stats ?? [];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Web Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(220, 38, 38, 0.1) 60%, transparent 70%)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Floating Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-800/15 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: '1s',
            transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)`,
          }}
        />
        
        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(220, 38, 38, 0.5) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(220, 38, 38, 0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {personalInfo && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center opacity-0 animate-fade-in-up">
            {/* Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-sm font-medium">Available for projects</span>
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight">
                Hi, I'm{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600">
                    {personalInfo.nickname}
                  </span>
                  <span className="absolute -inset-1 bg-red-500/20 blur-lg rounded-lg" />
                </span>
              </h1>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-400 font-light mb-6">
                {personalInfo.title}
              </h2>

              {/* Tagline */}
              <p className="text-lg text-red-400/80 italic mb-6 font-medium">
                "{personalInfo.tagline}"
              </p>

              {/* Description */}
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                {personalInfo.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <button
                  onClick={() => scrollToSection('#portfolio')}
                  className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 flex items-center gap-2"
                >
                  View My Work
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </button>
                <a
                  href={personalInfo.resume}
                  className="group px-8 py-4 border-2 border-red-500/50 hover:border-red-500 text-white font-semibold rounded-full transition-all duration-300 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <span className="text-gray-500 text-sm">Follow me:</span>
                <div className="flex gap-3">
                  {personalInfo.socials?.github && (
                    <a
                      href={personalInfo.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300 group"
                    >
                      <Github className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                    </a>
                  )}
                  {personalInfo.socials?.linkedin && (
                    <a
                      href={personalInfo.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300 group"
                    >
                      <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                    </a>
                  )}
                  {personalInfo.socials?.twitter && (
                    <a
                      href={personalInfo.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300 group"
                    >
                      <Twitter className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar & Stats */}
            <div className="relative order-1 lg:order-2">
              {/* Glowing Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-2 border-red-500/30 animate-spin-slow" />
                <div className="absolute w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border border-red-500/20 animate-reverse-spin" />
              </div>

              {/* Avatar */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 rounded-full blur-2xl opacity-40" />
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-red-500/50 shadow-2xl shadow-red-500/20"
                  />
                </div>
              </div>

              {/* Floating Stats Cards */}
              {stats.length > 0 && (
                <>
                  <div className="absolute -top-4 -right-4 lg:top-0 lg:right-0 xl:-right-8">
                    <div className="p-4 bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-xl shadow-red-500/10 animate-float">
                      <div className="text-2xl font-bold text-white">{stats[0].value}</div>
                      <div className="text-xs text-gray-400">{stats[0].label}</div>
                    </div>
                  </div>
                  {stats.length > 1 && (
                    <div className="absolute -bottom-4 -left-4 lg:bottom-0 lg:left-0 xl:-left-8">
                      <div className="p-4 bg-black/80 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-xl shadow-red-500/10 animate-float-delayed">
                        <div className="text-2xl font-bold text-white">{stats[1].value}</div>
                        <div className="text-xs text-gray-400">{stats[1].label}</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {stats.length > 0 && (
          <div className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.id || index}
                className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 hover:bg-red-500/5 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-white group-hover:text-red-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-red-500/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-red-500 rounded-full mt-2 animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
