import React from 'react';

const Support = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-center">
          Support
        </h1>
        <p className="text-gray-400 text-lg mb-10 text-center">
          Need help with a purchase, project, or collaboration? Here&apos;s how you can reach me and what to expect.
        </p>

        <div className="space-y-8 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Contact</h2>
            <p className="text-gray-400">
              For any support queries, email me at{' '}
              <a href="mailto:mikey@webdev.com" className="text-red-400 hover:text-red-300 underline">
                mikey@webdev.com
              </a>
              . I usually respond within 1–2 business days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Order & Payment Issues</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Include your order ID and payment method (Razorpay / PayPal / Stripe test).</li>
              <li>Describe the issue clearly (e.g. not received download link, payment pending, etc.).</li>
              <li>I&apos;ll verify the payment and either resend access or issue a refund according to the refund policy.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Support Scope</h2>
            <p className="text-gray-400">
              Support covers installation issues, bugs in the delivered products, and questions about how to use the
              templates, components, or code. Custom feature requests or project work may be billed separately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;

