import React, { useState } from 'react';
import { ShoppingCart, Star, Download, Check } from 'lucide-react';
import { products } from '../data/mock';

const Products = () => {
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(null);

  const addToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
      setAddedToCart(product.id);
      setTimeout(() => setAddedToCart(null), 2000);
    }
  };

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section id="products" className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-red-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-4">
            Digital Shop
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Premium{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              Products
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            High-quality digital resources to supercharge your development workflow.
          </p>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">
                {cart.length} item{cart.length > 1 ? 's' : ''} in cart
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-400 font-bold text-lg">
                ${cart.reduce((sum, item) => sum + item.price, 0)}
              </span>
              <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors">
                Checkout
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 hover:border-red-500/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  -{calculateDiscount(product.price, product.originalPrice)}%
                </span>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <span className="text-red-400 text-xs font-medium uppercase tracking-wider">
                  {product.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mt-2 mb-2 group-hover:text-red-400 transition-colors">
                  {product.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Rating & Downloads */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Download className="w-4 h-4" />
                    <span>{product.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <span className="text-gray-500 line-through text-sm">${product.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={cart.find((item) => item.id === product.id)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      cart.find((item) => item.id === product.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30'
                    }`}
                  >
                    {cart.find((item) => item.id === product.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Added Animation */}
              {addedToCart === product.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold">Added to Cart!</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
