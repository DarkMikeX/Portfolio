import React from 'react';

const RefundPolicy = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-center">
          Refund Policy
        </h1>
        <p className="text-gray-400 text-lg mb-10 text-center">
          I want you to be happy with your purchase. This policy explains when refunds are available and how they work.
        </p>

        <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm text-gray-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Eligibility for Refunds</h2>
            <p>
              Refunds are considered within <span className="font-semibold">7 days</span> of purchase if:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The product is significantly different from the description.</li>
              <li>There is a critical bug that prevents basic usage and cannot be resolved.</li>
              <li>You have not used the product in a client or commercial project yet.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Non-Refundable Situations</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Change of mind after download.</li>
              <li>Incompatibility with stacks or tools not listed in the product description.</li>
              <li>Issues caused by custom modifications to the code or design.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. How to Request a Refund</h2>
            <p>
              Email your request to{' '}
              <a href="mailto:mike@urmikexd.me" className="text-red-400 hover:text-red-300 underline">
                mike@urmikexd.me
              </a>{' '}
              with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your order ID and payment method (Razorpay / PayPal / Stripe test).</li>
              <li>The product name.</li>
              <li>A short explanation of the issue (screenshots or logs help a lot).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Processing Time</h2>
            <p>
              If approved, refunds are usually processed within 5–10 business days, depending on your payment provider.
              You&apos;ll receive a confirmation once it has been issued.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;

