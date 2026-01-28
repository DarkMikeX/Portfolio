import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Wallet, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { verifyRazorpayPayment } from '../services/api';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

const Checkout = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptRef = useRef(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('checkoutSession');
    if (!raw) {
      setLoading(false);
      setError('No checkout session. Add items and try again.');
      return;
    }
    try {
      const data = JSON.parse(raw);
      setSession(data);
      if (data.paymentMethod === 'razorpay' && data.razorpayKeyId && data.sessionId && data.amount) {
        loadRazorpayScript();
      } else if (data.paymentMethod === 'stripe' || data.paymentMethod === 'paypal') {
        setScriptLoaded(true);
      } else {
        setError('Invalid checkout session.');
      }
    } catch (e) {
      setError('Invalid session data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRazorpayScript = () => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Could not load Razorpay.');
    scriptRef.current = script;
    document.body.appendChild(script);
  };

  const handleBack = () => {
    sessionStorage.removeItem('checkoutSession');
    window.location.hash = '#products';
  };

  const handleStripeOrPayPalRedirect = () => {
    if (session?.url) {
      window.location.href = session.url;
    }
  };

  useEffect(() => {
    if (session?.paymentMethod === 'stripe' || session?.paymentMethod === 'paypal') {
      handleStripeOrPayPalRedirect();
    }
  }, [session?.paymentMethod, session?.url]);

  const openRazorpay = () => {
    if (!window.Razorpay || !session?.razorpayKeyId || !session?.sessionId || !session?.amount) {
      setError('Razorpay not ready. Please refresh and try again.');
      return;
    }
    setPaying(true);
    setError(null);

    const options = {
      key: session.razorpayKeyId,
      amount: session.amount,
      currency: session.currency || 'INR',
      name: 'Portfolio Shop',
      description: session.items?.length ? `Order (${session.items.length} item(s))` : 'Order',
      order_id: session.sessionId,
      theme: { color: '#dc2626' },
      handler: async function (response) {
        try {
          await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          sessionStorage.setItem('paymentSuccess', JSON.stringify({
            items: session?.items || [],
            amount: session?.amount ?? 0,
          }));
          sessionStorage.removeItem('checkoutSession');
          window.location.hash = '#payment-success';
        } catch (err) {
          const msg = err.response?.data?.detail || err.message || 'Verification failed';
          setError(msg);
        } finally {
          setPaying(false);
        }
      },
      modal: {
        ondismiss: function () {
          setPaying(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setError('Payment failed or was cancelled.');
        setPaying(false);
      });
      rzp.open();
    } catch (e) {
      setError(e.message || 'Could not open payment.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-black py-24 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => (window.location.hash = '#products')}
            className="px-6 py-3 bg-red-600 text-white rounded-full font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (session?.paymentMethod === 'stripe' || session?.paymentMethod === 'paypal') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Redirecting to payment...</p>
          <p className="text-gray-400 text-sm mt-2">You will see cards, UPI & other options there.</p>
        </div>
      </div>
    );
  }

  const amountDisplay = session?.amount ? (session.amount / 100).toFixed(2) : '0.00';
  const currencySymbol = session?.currency === 'INR' ? '₹' : '$';

  return (
    <div className="min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to products
        </button>

        <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400 text-sm mb-6">Pay with cards, UPI, wallets & more via Razorpay.</p>

          {session?.items?.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Order summary</p>
              <ul className="space-y-1 text-white">
                {session.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-gray-400">
                      {item.quantity} × {currencySymbol}{(item.price || 0).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
            <span className="text-white font-semibold">Total</span>
            <span className="text-xl font-bold text-red-400">
              {currencySymbol}{amountDisplay}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={openRazorpay}
            disabled={!scriptLoaded || paying}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {paying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : !scriptLoaded ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading payment...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Pay {currencySymbol}{amountDisplay} (Cards, UPI, Wallets)
              </>
            )}
          </button>

          <p className="text-gray-500 text-xs text-center mt-4">
            Secure payment by Razorpay. You’ll see card, UPI and other options in the popup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
