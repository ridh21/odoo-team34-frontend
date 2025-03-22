"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaRupeeSign, FaShoppingCart, FaTag, FaArrowRight } from "react-icons/fa";
import UserNav from "@/components/UserNavbar";
import Rice from '@/assets/rice.jpg'
import Tomato from '@/assets/tomato.jpg'
import Wheat from '@/assets/wheat.jpg'
import Link from "next/link";

const initialCart = [
  {
    id: 1,
    name: "Organic Wheat",
    quantity: 1,
    price: 1500,
    image: Wheat,
    seller: "Green Farms",
    category: "Grains",
  },
  {
    id: 2,
    name: "Basmati Rice",
    quantity: 1,
    price: 1800,
    image: Rice,
    seller: "Nature's Harvest",
    category: "Grains",
  },
  {
    id: 4,
    name: "Fresh Tomatoes",
    quantity: 1,
    price: 1350,
    image: Tomato,
    seller: "Sunshine Farms",
    category: "Vegetables",
  },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const total = subtotal - discountAmount + deliveryFee;

  // Quantity update with animation
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Remove item with animation
  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Apply coupon with validation and loading state
  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setCouponError("");
    setCouponSuccess("");

    // Simulate API call
    setTimeout(() => {
      if (coupon.toUpperCase() === "ORGANIC10") {
        setDiscount(10);
        setCouponSuccess("Coupon applied successfully! 10% discount");
      } else if (coupon.toUpperCase() === "FARMER15") {
        setDiscount(15);
        setCouponSuccess("Coupon applied successfully! 15% discount");
      } else {
        setCouponError("Invalid coupon code");
        setDiscount(0);
      }
      setIsLoading(false);
    }, 800);
  };

  // Handle checkout
  const handleCheckout = () => {
    // Implement checkout logic here
    alert("Proceeding to checkout...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center mb-8">
          <FaShoppingCart className="text-green-600 text-3xl mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
          <span className="ml-4 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-gray-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
			<p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
			<Link href="/marketplace">
			<button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
				Continue Shopping
			</button>
			</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                </div>

                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1">
                            <span>{item.category}</span>
                            <span className="hidden sm:block mx-2">•</span>
                            <span>Sold by: {item.seller}</span>
                          </div>
                          <div className="flex items-center mt-1 text-green-600 font-medium">
                            <FaRupeeSign className="text-xs mr-1" />
                            <span>{item.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-1">/quintal</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-l-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-300 transition-colors duration-200"
                          >
                            <span className="text-gray-600 font-medium">−</span>
                          </button>
                          <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                            <span className="text-gray-800 font-medium">{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-r-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-300 transition-colors duration-200"
                          >
                            <span className="text-gray-600 font-medium">+</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right hidden sm:block">
                            <div className="text-gray-500 text-sm">Subtotal</div>
                            <div className="text-gray-800 font-medium flex items-center justify-end">
                              <FaRupeeSign className="text-xs mr-1" />
                              {(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            aria-label="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="p-6 bg-gray-50">
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors duration-200">
                    <span className="mr-2">Continue Shopping</span>
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm sticky top-24">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <FaTag className="text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium text-gray-800">Apply Coupon</h3>
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={isLoading}
                        className={`px-4 py-3 rounded-r-lg font-medium text-white ${
                          isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        } transition-colors duration-200 flex items-center justify-center min-w-[100px]`}
                      >
                        {isLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>

                    {couponError && (
                      <p className="mt-2 text-red-500 text-sm">{couponError}</p>
                    )}

                    {couponSuccess && (
                      <p className="mt-2 text-green-500 text-sm">{couponSuccess}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <div className="flex items-center">
                        <FaRupeeSign className="text-xs mr-1" />
                        <span>{subtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <div className="flex items-center">
                          <span>-</span>
                          <FaRupeeSign className="text-xs mx-1" />
                          <span>{discountAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <div className="flex items-center">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <>
                            <FaRupeeSign className="text-xs mr-1" />
                            <span>{deliveryFee.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>Total</span>
                        <div className="flex items-center">
                          <FaRupeeSign className="text-sm mr-1" />
                          <span className="text-lg">{total.toLocaleString()}</span>
                        </div>
                      </div>

                      {deliveryFee === 0 && (
                        <p className="text-green-600 text-sm mt-1">You've qualified for free delivery!</p>
                      )}

                      {deliveryFee > 0 && (
                        <p className="text-gray-500 text-sm mt-1">Add ₹{(5000 - subtotal).toLocaleString()} more for free delivery</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">Proceed to Checkout</span>
                    <FaArrowRight />
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-3">Secure Checkout</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Secure payment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        {cart.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Quality Guarantee</h3>
                  <p className="mt-1 text-gray-500">All products are quality checked before dispatch</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Fast Delivery</h3>
                  <p className="mt-1 text-gray-500">Delivery within 2-3 business days</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">Secure Payment</h3>
                  <p className="mt-1 text-gray-500">Multiple payment options available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;