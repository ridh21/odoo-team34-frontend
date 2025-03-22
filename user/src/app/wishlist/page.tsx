"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaTrash, FaRupeeSign, FaRegHeart, FaShare, FaEllipsisH } from "react-icons/fa";
import UserNav from "@/components/UserNavbar";
import Rice from '@/assets/rice.jpg'
import Tomato from '@/assets/tomato.jpg'
import Wheat from '@/assets/wheat.jpg'
import Corn from '@/assets/corn.jpg'
import Potato from '@/assets/potato.jpg'

// Initial wishlist data
const initialWishlist = [
{
    id: 1,
    name: "Organic Wheat",
    price: 1500,
    image: Wheat,
    seller: "Green Farms",
    category: "Grains",
    inStock: true,
    rating: 4.5,
    dateAdded: "2023-10-15"
},
{
    id: 2,
    name: "Basmati Rice",
    price: 1800,
    image: Rice,
    seller: "Nature's Harvest",
    category: "Grains",
    inStock: true,
    rating: 4.8,
    dateAdded: "2023-10-12"
},
{
    id: 3,
    name: "Fresh Tomatoes",
    price: 1350,
    image: Tomato,
    seller: "Sunshine Farms",
    category: "Vegetables",
    inStock: true,
    rating: 4.2,
    dateAdded: "2023-10-10"
},
{
    id: 4,
    name: "Organic Potatoes",
    price: 1100,
    image: Potato,
    seller: "Earth Bounty",
    category: "Vegetables",
    inStock: false,
    rating: 4.0,
    dateAdded: "2023-10-05"
},
{
    id: 5,
    name: "Sweet Corn",
    price: 1400,
    image: Corn,
    seller: "Golden Fields",
    category: "Vegetables",
    inStock: true,
    rating: 4.7,
    dateAdded: "2023-10-01"
}
];

const Wishlist = () => {
const [wishlist, setWishlist] = useState(initialWishlist);
const [filter, setFilter] = useState("all");
const [sort, setSort] = useState("dateAdded");
const [showConfirmation, setShowConfirmation] = useState(false);
const [itemToRemove, setItemToRemove] = useState<number | null>(null);
const [searchQuery, setSearchQuery] = useState("");
const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
useEffect(() => {
    const timer = setTimeout(() => {
    setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
}, []);

  // Filter and sort wishlist items
const filteredAndSortedWishlist = wishlist
    .filter(item => {
      // Apply category filter
    if (filter !== "all" && item.category.toLowerCase() !== filter) {
        return false;
    }

      // Apply search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
    }

    return true;
    })
    .sort((a, b) => {
      // Apply sorting
    switch (sort) {
        case "priceAsc":
        return a.price - b.price;
        case "priceDesc":
        return b.price - a.price;
        case "nameAsc":
        return a.name.localeCompare(b.name);
        case "nameDesc":
        return b.name.localeCompare(a.name);
        case "dateAdded":
        default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    });

  // Remove item from wishlist
const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    setShowConfirmation(true);

    // Hide confirmation after 3 seconds
    setTimeout(() => {
    setShowConfirmation(false);
    }, 3000);
};

  // Confirm removal dialog
const confirmRemoval = (id: number) => {
    setItemToRemove(id);
};

  // Cancel removal
const cancelRemoval = () => {
    setItemToRemove(null);
};

  // Add to cart
const addToCart = (id: number) => {
    // Implement add to cart functionality
    alert(`Added item ${id} to cart`);
};

  // Clear all items from wishlist
const clearWishlist = () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
    setWishlist([]);
    }
};

  // Share wishlist
const shareWishlist = () => {
    // Implement share functionality
    alert("Share functionality would open here");
};

  // Render star rating
const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (

    <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        ))}

        {hasHalfStar && (
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
            <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        )}

        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        ))}

        <span className="ml-1 text-gray-500 text-sm">{rating.toFixed(1)}</span>
    </div>
    );
};

return (
    <div className="min-h-screen bg-gray-50">
    <UserNav />
    <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
            <FaHeart className="text-red-500 text-3xl mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
            <span className="ml-4 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
            </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            <button
            onClick={shareWishlist}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
            <FaShare className="mr-2" />
            Share
            </button>

            {wishlist.length > 0 && (
            <button
                onClick={clearWishlist}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
                <FaTrash className="mr-2" />
                Clear All
            </button>
            )}
        </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
                <option value="all">All Categories</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
            </select>

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
                <option value="dateAdded">Recently Added</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
            </select>
            </div>
        </div>
        </div>

        {/* Confirmation Toast */}
        <AnimatePresence>
        {showConfirmation && (
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md"
            style={{ maxWidth: "300px" }}
            >
            <div className="flex">
                <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-3">
                <p className="text-sm">Item removed from wishlist</p>
                <button className="text-xs text-green-800 font-medium hover:text-green-900 mt-1">Undo</button>
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Wishlist Content */}
        {isLoading ? (
          // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
                </div>
            </div>
            ))}
        </div>
        ) : wishlist.length === 0 ? (
          // Empty wishlist state
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <FaRegHeart className="text-red-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Items added to your wishlist will appear here. Start exploring and add products you love!</p>
            <Link href="/marketplace" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
            Explore Products
            </Link>
        </div>
        ) : filteredAndSortedWishlist.length === 0 ? (
          // No results from filter
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No matching items found</h2>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
            <button
            onClick={() => {setFilter("all"); setSearchQuery("");}}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
            Clear Filters
            </button>
        </div>
        ) : (
          // Wishlist items grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
            {filteredAndSortedWishlist.map((item) => (
                <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden relative group"
                >
                  {/* Confirmation Dialog */}
                {itemToRemove === item.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center p-4">
                    <p className="text-gray-800 font-medium text-center mb-4">Remove this item from your wishlist?</p>
                    <div className="flex space-x-3">
                        <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                        Remove
                        </button>
                        <button
                        onClick={cancelRemoval}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                )}

                  {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                    <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => confirmRemoval(item.id)}
                        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove from wishlist"
                    >
                        <FaTrash className="w-3 h-3" />
                    </button>
                    </div>

                    {/* Stock Badge */}
                    {!item.inStock && (
                    <div className="absolute top-2 left-2">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Out of Stock
                        </span>
                    </div>
                    )}
                </div>

                  {/* Product Details */}
                <div className="p-4">
                    <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {item.category}
                    </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>

                    <p className="text-sm text-gray-600 mb-2">Sold by: {item.seller}</p>

                    {/* Rating */}
                    <div className="mb-3">
                    {renderRating(item.rating)}
                    </div>

                    <div className="flex justify-between items-center">
                    <div className="flex items-center text-green-600 font-semibold">
                        <FaRupeeSign className="text-xs mr-1" />
                        <span>{item.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 font-normal ml-1">/quintal</span>
                    </div>

                    <button
                        onClick={() => addToCart(item.id)}
                        disabled={!item.inStock}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${
                        item.inStock
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        } transition-colors duration-200`}
                    >
                        <FaShoppingCart className="mr-1" />
                        {item.inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                    </div>

                    {/* Date Added */}
                    <div className="mt-3 text-xs text-gray-500">
                    Added on {new Date(item.dateAdded).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                    </div>
                </div>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
        )}
      </div>
	</div>
  );
};

export default Wishlist;