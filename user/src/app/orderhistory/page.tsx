"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxOpen,
  FaSearch,
  FaFileInvoice,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
  FaChevronDown,
  FaChevronRight,
  FaStar,
  FaDownload,
  FaExclamationTriangle
} from "react-icons/fa";
import UserNav from "@/components/UserNavbar";

// Sample order data
const initialOrders = [
  {
    id: "ORD-2023-10001",
    date: "2023-10-15",
    total: 4850,
    items: [
      {
        id: 1,
        name: "Organic Wheat",
        price: 1500,
        quantity: 2,
        image: "/images/wheat.jpg",
        seller: "Green Farms"
      },
      {
        id: 2,
        name: "Basmati Rice",
        price: 1800,
        quantity: 1,
        image: "/images/rice.jpg",
        seller: "Nature's Harvest"
      }
    ],
    status: "delivered",
    deliveryDate: "2023-10-20",
    paymentMethod: "Credit Card",
    invoiceUrl: "#",
    trackingId: "TRK-8765432",
    reviewed: true
  },
  {
    id: "ORD-2023-10002",
    date: "2023-10-10",
    total: 2850,
    items: [
      {
        id: 3,
        name: "Fresh Tomatoes",
        price: 1350,
        quantity: 1,
        image: "/images/tomatoes.jpg",
        seller: "Sunshine Farms"
      },
      {
        id: 4,
        name: "Organic Potatoes",
        price: 1100,
        quantity: 1,
        image: "/images/potatoes.jpg",
        seller: "Earth Bounty"
      },
      {
        id: 5,
        name: "Sweet Corn",
        price: 400,
        quantity: 1,
        image: "/images/corn.jpg",
        seller: "Golden Fields"
      }
    ],
    status: "in-transit",
    deliveryDate: "2023-10-25",
    paymentMethod: "UPI",
    invoiceUrl: "#",
    trackingId: "TRK-8765433",
    reviewed: false
  },
  {
    id: "ORD-2023-10003",
    date: "2023-10-05",
    total: 3000,
    items: [
      {
        id: 6,
        name: "Premium Wheat",
        price: 1500,
        quantity: 2,
        image: "/images/wheat.jpg",
        seller: "Green Farms"
      }
    ],
    status: "processing",
    deliveryDate: "2023-10-28",
    paymentMethod: "Bank Transfer",
    invoiceUrl: "#",
    trackingId: "TRK-8765434",
    reviewed: false
  },
  {
    id: "ORD-2023-10004",
    date: "2023-09-28",
    total: 5400,
    items: [
      {
        id: 7,
        name: "Basmati Rice",
        price: 1800,
        quantity: 3,
        image: "/images/rice.jpg",
        seller: "Nature's Harvest"
      }
    ],
    status: "delivered",
    deliveryDate: "2023-10-03",
    paymentMethod: "Credit Card",
    invoiceUrl: "#",
    trackingId: "TRK-8765435",
    reviewed: true
  },
  {
    id: "ORD-2023-10005",
    date: "2023-09-20",
    total: 2700,
    items: [
      {
        id: 8,
        name: "Fresh Tomatoes",
        price: 1350,
        quantity: 2,
        image: "/images/tomatoes.jpg",
        seller: "Sunshine Farms"
      }
    ],
    status: "cancelled",
    deliveryDate: null,
    paymentMethod: "UPI",
    invoiceUrl: "#",
    trackingId: null,
    cancellationReason: "Out of stock",
    reviewed: false
  }
];

const OrderHistory = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date-desc");
  const [reviewOrder, setReviewOrder] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ""
  });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      // Apply status filter
      if (filter !== "all" && order.status !== filter) {
        return false;
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          order.id.toLowerCase().includes(query) ||
          order.items.some(item => item.name.toLowerCase().includes(query)) ||
          order.items.some(item => item.seller.toLowerCase().includes(query))
        ) {
          return true;
        }
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "total-asc":
          return a.total - b.total;
        case "total-desc":
          return b.total - a.total;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Toggle order expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewOrder) {
      // In a real app, you would send this to your API
      console.log(`Submitting review for order ${reviewOrder}:`, reviewData);

      // Update the order to mark it as reviewed
      setOrders(orders.map(order =>
        order.id === reviewOrder ? { ...order, reviewed: true } : order
      ));

      // Reset review state
      setReviewOrder(null);
      setReviewData({ rating: 0, comment: "" });
    }
  };

  // Handle star rating click
  const handleRatingClick = (rating: number) => {
    setReviewData({ ...reviewData, rating });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Delivered
          </span>
        );
      case "in-transit":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaTruck className="mr-1" />
            In Transit
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaBoxOpen className="mr-1" />
            Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center mb-8">
          <FaBoxOpen className="text-green-600 text-3xl mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, product, or seller..."
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
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Highest Amount</option>
                <option value="total-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order List */}
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-40"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="mt-6 h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          // No orders state
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <FaBoxOpen className="text-gray-400 text-3xl" />
            </div>
            {searchQuery || filter !== "all" ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No matching orders found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                <button
                  onClick={() => {setFilter("all"); setSearchQuery("");}}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-6">When you place orders, they will appear here for you to track.</p>
                <Link href="/marketplace" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
                  Start Shopping
                </Link>
              </>
            )}
          </div>
        ) : (
          // Order list
          <div className="space-y-6">
            <AnimatePresence>
              {filteredAndSortedOrders.map((order) => (
				<motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                          <span className="ml-3">{getStatusBadge(order.status)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <div className="flex items-center text-green-600 font-semibold">
                          <FaRupeeSign className="text-xs mr-1" />
                          <span>{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </span>
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="ml-3 text-green-600 hover:text-green-700 focus:outline-none"
                            aria-label={expandedOrder === order.id ? "Collapse order details" : "Expand order details"}
                          >
                            {expandedOrder === order.id ? (
                              <FaChevronDown className="h-4 w-4" />
                            ) : (
                              <FaChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-gray-50">
                          {/* Order Items */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Items</h4>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center">
                                  <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div className="ml-4 flex-grow">
                                    <h5 className="text-sm font-medium text-gray-800">{item.name}</h5>
                                    <p className="text-xs text-gray-500">Sold by: {item.seller}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                      <span className="mx-2 text-gray-300">|</span>
                                      <div className="flex items-center text-green-600 text-sm">
                                        <FaRupeeSign className="text-xs mr-1" />
                                        <span>{item.price.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500 ml-1">/quintal</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-green-600 font-medium">
                                      <FaRupeeSign className="text-xs mr-1" />
                                      <span>{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Shipping Information</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                {order.status === "cancelled" ? (
                                  <div className="flex items-start">
                                    <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm text-gray-800 font-medium">Order Cancelled</p>
                                      <p className="text-sm text-gray-500 mt-1">Reason: {order.cancellationReason}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center mb-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        order.status === "delivered" ? "bg-green-100 text-green-600" :
                                        order.status === "in-transit" ? "bg-blue-100 text-blue-600" :
                                        "bg-yellow-100 text-yellow-600"
                                      }`}>
                                        {order.status === "delivered" ? (
                                          <FaCheckCircle />
                                        ) : order.status === "in-transit" ? (
                                          <FaTruck />
                                        ) : (
                                          <FaBoxOpen />
                                        )}
                                      </div>
                                      <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-800">
                                          {order.status === "delivered" ? "Delivered" :
                                          order.status === "in-transit" ? "In Transit" :
                                          "Processing"}
                                        </p>
                                        {order.status === "delivered" && (
                                          <p className="text-xs text-gray-500">
                                            Delivered on {new Date(order.deliveryDate!).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        )}
                                        {order.status === "in-transit" && (
                                          <p className="text-xs text-gray-500">
                                            Expected by {new Date(order.deliveryDate!).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        )}
                                        {order.status === "processing" && (
                                          <p className="text-xs text-gray-500">
                                            Preparing your order
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {order.trackingId && (
                                      <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Tracking ID</p>
                                        <p className="text-sm font-medium text-gray-800 mt-1">{order.trackingId}</p>
                                        {(order.status === "in-transit" || order.status === "processing") && (
                                          <Link href={`/orders/track/${order.trackingId}`} className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium mt-2">
                                            Track Order
                                            <FaChevronRight className="ml-1 h-3 w-3" />
                                          </Link>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Payment Information</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">Payment Method</span>
                                  <span className="text-sm font-medium text-gray-800">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">Subtotal</span>
                                  <div className="flex items-center text-gray-800 text-sm">
                                    <FaRupeeSign className="text-xs mr-1" />
                                    <span>{(order.total - 100).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">Shipping Fee</span>
                                  <div className="flex items-center text-gray-800 text-sm">
                                    <FaRupeeSign className="text-xs mr-1" />
                                    <span>100</span>
                                  </div>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                  <span className="text-sm font-medium text-gray-800">Total</span>
                                  <div className="flex items-center text-green-600 font-medium">
                                    <FaRupeeSign className="text-xs mr-1" />
                                    <span>{order.total.toLocaleString()}</span>
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                  <Link href={order.invoiceUrl} className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium">
                                    <FaFileInvoice className="mr-2" />
                                    Download Invoice
                                  </Link>

                                  {order.status === "delivered" && !order.reviewed && (
                                    <button
                                      onClick={() => setReviewOrder(order.id)}
                                      className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                                    >
                                      <FaStar className="mr-2" />
                                      Write Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-wrap gap-3 justify-end">
                            {order.status === "delivered" && (
                              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                Buy Again
                              </button>
                            )}

                            {(order.status === "processing" || order.status === "in-transit") && (
                              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                                Cancel Order
                              </button>
                            )}

                            <Link
                              href={`/orders/details/${order.id}`}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Review Modal */}
        <AnimatePresence>
          {reviewOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Write a Review</h3>
                    <button
                      onClick={() => setReviewOrder(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate your experience
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className={`h-8 w-8 ${
                            reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                          } focus:outline-none`}
                        >
                          <FaStar className="h-full w-full" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {reviewData.rating > 0
                          ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewData.rating - 1]
                          : 'Select rating'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Your feedback
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      placeholder="Share your experience with this order..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setReviewOrder(null)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewData.rating === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                        reviewData.rating > 0
                          ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          : 'bg-gray-300 cursor-not-allowed'
                      } transition-colors duration-200`}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Stats */}
        {!isLoading && filteredAndSortedOrders.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FaBoxOpen />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-xl font-semibold text-gray-800">{orders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FaTruck />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">In Transit</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {orders.filter(order => order.status === "in-transit").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <FaCheckCircle />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Delivered</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {orders.filter(order => order.status === "delivered").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <FaRupeeSign />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-xl font-semibold text-gray-800">
                      ₹{orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Need Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">Need help with an order?</h3>
              <p className="mt-1 text-gray-500">
                Our customer support team is available to assist you with any questions or issues.
              </p>
              <div className="mt-3">
                <Link
                  href="/support"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Contact Support
                  <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;