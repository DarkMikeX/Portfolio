import React, { useState, useEffect } from 'react';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('paymentSuccess');
    if (raw) {
      try {
        setSummary(JSON.parse(raw));
        sessionStorage.removeItem('paymentSuccess');
      } catch (_) {}
    }
  }, []);

  const goToProducts = () => {
    window.location.hash = '#products';
  };

  const goHome = () => {
    window.location.hash = '#home';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Payment Successful</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your order. Your payment has been confirmed.
        </p>

        {summary && (summary.items?.length > 0 || summary.amount != null) && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-400" />
              Order summary
            </h2>
            {summary.items?.length > 0 && (
              <ul className="space-y-2 mb-4">
                {summary.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-white">
                    <span>{item.name}</span>
                    <span className="text-gray-400">
                      {item.quantity} × ₹{(item.price || 0).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {summary.amount != null && (
              <div className="pt-4 border-t border-white/10 flex justify-between text-white font-semibold">
                <span>Total paid</span>
                <span className="text-green-400">₹{(summary.amount / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={goToProducts}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue shopping
          </button>
          <button
            onClick={goHome}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
