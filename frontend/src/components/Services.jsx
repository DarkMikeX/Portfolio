import React from 'react';
import { Globe, Code2, Palette, Briefcase } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  Globe: Globe,
  Code2: Code2,
  Palette: Palette,
  Briefcase: Briefcase,
};

const Services = () => {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-[#121212]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My <span className="text-[#ff2244]">Services</span>
          </h2>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            Delivering exceptional digital solutions with precision and creativity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="group p-6 bg-[#1a1a1a] border border-[#252525] hover:border-[#ff2244]/50 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#ff2244]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#ff2244] transition-colors">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-[#ff2244] group-hover:text-white transition-colors" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
