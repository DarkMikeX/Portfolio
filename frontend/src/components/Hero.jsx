import React from 'react';
import { Zap, ArrowDown } from 'lucide-react';
import { personalInfo, skills } from '../data/mock';

const Hero = () => {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-[#121212] overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255, 34, 68, 0.1) 0%, transparent 50%, rgba(255, 34, 68, 0.05) 100%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-32">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-[#ff2244] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff2244]/30">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-white">GAU</span>
              <span className="text-[#ff2244]">RAV</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-[#b0b0b0] text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            {personalInfo.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="group px-8 py-4 bg-[#ff2244] hover:bg-[#e61e3c] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#ff2244]/30 hover:shadow-[#ff2244]/50 hover:scale-105 flex items-center gap-2"
            >
              View My Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="px-8 py-4 border-2 border-[#333] hover:border-[#ff2244] text-white font-semibold rounded-full transition-all duration-300 hover:bg-[#ff2244]/10"
            >
              Get In Touch
            </button>
          </div>

          {/* Skills Section */}
          <div className="w-full max-w-2xl">
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#888] text-sm font-medium">{skill.name}</span>
                    <span className="text-[#ff2244] text-sm font-bold">{skill.level}%</span>
                  </div>
                  <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    {/* Animated skill bar with diagonal stripes */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff2244] to-[#ff4466] rounded-full transition-all duration-1000 ease-out skill-bar"
                      style={{
                        width: `${skill.level}%`,
                        animationDelay: `${index * 200}ms`,
                      }}
                    >
                      {/* Diagonal stripe pattern */}
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: `repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 4px,
                            rgba(255, 255, 255, 0.1) 4px,
                            rgba(255, 255, 255, 0.1) 8px
                          )`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-[#333] rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-[#ff2244] rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
