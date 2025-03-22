"use client";
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '@/components/Navbar';
import MySwiper from '@/components/Swiper';
import TestimonialCarousel from '@/components/testimonial';




const Home = () => {

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Auto Sliding Carousel */}
      <MySwiper/>

      {/* Mission Section */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-green-700 text-3xl font-bold mb-4">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          At KrushiMart, we empower farmers practicing natural farming by providing them with a reliable and direct market
          while ensuring consumers can easily access and verify authentic natural farming products.
        </p>
      </section>

      {/* Success Stories */}
          <TestimonialCarousel/>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="mt-2">Ministry of Agriculture & Farmers Welfare</p>
            <p>Krishi Bhavan, Dr. Rajendra Prasad Road</p>
            <p>New Delhi, India, PIN: 110001</p>
          </div>
        </div>
        <p className="text-center text-sm mt-6">© 2025 KrushiMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home