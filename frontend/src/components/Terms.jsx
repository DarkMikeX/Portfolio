import React from 'react';

const Terms = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-gray-400 text-lg mb-10 text-center">
          These terms outline the conditions under which you may use my website, products, and services.
        </p>

        <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Use of Website & Content</h2>
            <p>
              All content on this site, including code, designs, text, and media, is provided for your personal or
              business use as permitted by the specific license of each product. You may not resell, redistribute, or
              claim ownership of the original products.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Purchases & Licensing</h2>
            <p>
              When you purchase a product, you receive a non-exclusive, non-transferable license to use it in your own
              projects. Unless explicitly stated, licenses are for a single developer or team within one organization.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. No Warranty</h2>
            <p>
              Products are provided &quot;as is&quot; without warranties of any kind. I do my best to keep everything
              up-to-date and secure, but I cannot guarantee that the products will be error-free or compatible with
              every tech stack or environment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, I am not liable for any indirect, incidental, or consequential
              damages arising from the use or inability to use the products, including lost profits or data loss.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Changes to These Terms</h2>
            <p>
              These terms may be updated from time to time. Significant changes will be reflected on this page, and
              continued use of the site after changes means you accept the updated terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;

