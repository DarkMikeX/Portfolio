import React from 'react';
import { Globe, Code2, Palette, Briefcase, ArrowUpRight } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  Globe: Globe,
  Code2: Code2,
  Palette: Palette,
  Briefcase: Briefcase,
};

const Services = () => {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(220, 38, 38, 0.5) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
            What I Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Services
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Delivering exceptional digital solutions with precision, creativity, and a commitment to excellence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:via-red-600/10 group-hover:to-transparent rounded-3xl transition-all duration-500" />

                {/* Icon */}
                <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl group-hover:bg-red-500/30 transition-colors" />
                  <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                    {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Number */}
                <div className="absolute top-6 right-6 text-6xl font-bold text-white/5 group-hover:text-red-500/10 transition-colors">
                  0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
