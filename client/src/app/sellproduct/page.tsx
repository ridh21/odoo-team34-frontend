"use client";

import FarmerNav from '@/components/FarmerNavbar';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Rice from '@/assets/rice.jpg'
import Tomato from '@/assets/tomato.jpg'

const SellProduct = () => {
  const [formData, setFormData] = useState({
    heading: '',
    image: null,
    imagePreview: null,
    mspPrice: 1500, // Example MSP price, non-editable
    finalPrice: '',
    discount: 0,
    discountEnabled: false,
    category: 'Standard',
    quantity: 100, // Example max quantity from govt data
    refundable: 'Yes',
    returnDays: '',
    exchangeDays: '',
    active: true
  });

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: 'Wheat',
      quantity: 50,
      selling: false,
      category: 'Grains',
      image: null,
      mspPrice: 1500,
      finalPrice: '',
      discount: 0,
      discountEnabled: false,
      refundable: 'Yes',
      returnDays: '',
      exchangeDays: '',
      active: true
    },
    {
      id: 2,
      name: 'Rice',
      quantity: 80,
      selling: true,
      category: 'Grains',
      image: Rice,
      mspPrice: 1600,
      finalPrice: '1800',
      discount: 5,
      discountEnabled: true,
      refundable: 'Yes',
      returnDays: '7',
      exchangeDays: '15',
      active: true
    },
    {
      id: 3,
      name: 'Corn',
      quantity: 120,
      selling: false,
      category: 'Grains',
      image: null,
      mspPrice: 1400,
      finalPrice: '',
      discount: 0,
      discountEnabled: false,
      refundable: 'No',
      returnDays: '',
      exchangeDays: '',
      active: false
    },
    {
      id: 4,
      name: 'Tomatoes',
      quantity: 65,
      selling: true,
      category: 'Vegetables',
      image: Tomato,
      mspPrice: 1200,
      finalPrice: '1350',
      discount: 0,
      discountEnabled: false,
      refundable: 'Yes',
      returnDays: '3',
      exchangeDays: '5',
      active: true
    },
    {
      id: 5,
      name: 'Potatoes',
      quantity: 95,
      selling: false,
      category: 'Vegetables',
      image: null,
      mspPrice: 1100,
      finalPrice: '',
      discount: 0,
      discountEnabled: false,
      refundable: 'No',
      returnDays: '',
      exchangeDays: '',
      active: false
    }
  ]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('quantity');
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    let result = [...crops];

    // Apply search filter
    if (search) {
      result = result.filter(crop =>
        crop.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(crop => crop.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'quantity') {
        return b.quantity - a.quantity;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredCrops(result);
  }, [crops, search, categoryFilter, sortBy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imagePreview: imageUrl
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Here you would typically send the data to your backend

    // Update the crops array with the new data
    const updatedCrops = crops.map(crop => {
      if (crop.id === selectedCrop.id) {
        return {
          ...crop,
          selling: true,
          name: formData.heading,
          finalPrice: formData.finalPrice,
          discount: formData.discount,
          discountEnabled: formData.discountEnabled,
          category: formData.category,
          quantity: formData.quantity,
          refundable: formData.refundable,
          returnDays: formData.returnDays,
          exchangeDays: formData.exchangeDays,
          active: formData.active,
          // If they uploaded a new image, we'd use that
          image: formData.image ? URL.createObjectURL(formData.image) : (selectedCrop.type === 'edit' ? selectedCrop.image : '/images/default-crop.jpg')
        };
      }
      return crop;
    });

    setCrops(updatedCrops);

    // Show success message
    alert(`Product ${selectedCrop.type === 'edit' ? 'updated' : 'published'} successfully!`);

    // Reset form and selection
    setSelectedCrop(null);
  };

  const handleCropClick = (crop, type) => {
    // Close any open form first
    setSelectedCrop(null);

    // Then open the new form after a small delay
    setTimeout(() => {
      if (crop.selling && type === 'edit') {
        setSelectedCrop({ ...crop, type });
        setFormData({
          heading: crop.name,
          image: null,
          imagePreview: crop.image,
          mspPrice: crop.mspPrice,
          finalPrice: crop.finalPrice,
          discount: crop.discount,
          discountEnabled: crop.discountEnabled,
          category: crop.category || 'Standard',
          quantity: crop.quantity,
          refundable: crop.refundable,
          returnDays: crop.returnDays,
          exchangeDays: crop.exchangeDays,
          active: crop.active
        });
      } else if (!crop.selling && type === 'sell') {
        setSelectedCrop({ ...crop, type });
        setFormData({
          heading: crop.name,
          image: null,
          imagePreview: null,
          mspPrice: crop.mspPrice,
          finalPrice: '',
          discount: 0,
          discountEnabled: false,
          category: 'Standard',
          quantity: crop.quantity,
          refundable: 'Yes',
          returnDays: '',
          exchangeDays: '',
          active: true
        });
      }
    }, 100);
  };

  const calculateFinalPrice = () => {
    if (!formData.finalPrice) return '';
    if (!formData.discountEnabled || !formData.discount) return formData.finalPrice;

    const discountAmount = (formData.finalPrice * formData.discount) / 100;
    return (formData.finalPrice - discountAmount).toFixed(2);
  };

  // Function to get crop icon based on category
  const getCropIcon = (category) => {
    switch(category) {
      case 'Grains':
        return (
          <svg className="h-12 w-12 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        );
      case 'Vegetables':
        return (
          <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM15.42 5.6a4 4 0 0 1 0 5.65"></path>
            <path d="M18.9 2.12a4 4 0 0 1 0 5.66"></path>
          </svg>
        );
      case 'Fruits':
        return (
          <svg className="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 8.8a6 6 0 0 1-8.5 8.4"></path>
            <path d="M9 15c-2.67 0-8-1.34-8-4 0-2.67 5.33-4 8-4"></path>
            <path d="M15.9 4a7 7 0 0 1 4.1 6.7c0 3.31-2.69 6-6 6"></path>
          </svg>
        );
      default:
        return (
          <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
            <path d="M12 6v8l4 2"></path>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Crop Inventory</h2>
            <p className="text-gray-600 mt-1">Manage and sell your available crops</p>
          </div>

          <div className="flex flex-col md:flex-row mb-6 gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="quantity">Sort by Quantity</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {filteredCrops.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No crops found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg
:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCrops.map((crop) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-gray-100">
                    {crop.selling && crop.image ? (
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
                        {getCropIcon(crop.category)}
                        <div className="mt-2 text-sm font-medium text-gray-500">
                          {crop.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Not listed for sell
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${crop.selling ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {crop.selling ? 'Selling' : 'Not Selling'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
                        <p className="text-sm text-gray-600">Category: {crop.category}</p>
                        <div className="mt-1 flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{crop.quantity} quintals available</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleCropClick(crop, 'edit')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          crop.selling
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!crop.selling}
                      >
                        <span className="flex items-center justify-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => handleCropClick(crop, 'sell')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                          crop.selling
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } transition-colors duration-200`}
                      >
                        <span className="flex items-center justify-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {crop.selling ? 'Update' : 'Sell'}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedCrop && (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCrop.type === 'edit' ? 'Update Product Listing' : 'Create Product Listing'}
                </h2>
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="heading"
                      value={formData.heading}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Sample">Sample</option>
                      <option value="Standard">Standard</option>
                      <option value="Bulk">Bulk</option>
                      <option value="Premium">Premium</option>
                      <option value="Organic">Organic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative h-32 w-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {formData.imagePreview ? (
                          <Image
                            src={formData.imagePreview}
                            alt="Product preview"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            {getCropIcon(selectedCrop.category)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-center">
                          <span className="text-sm font-medium text-gray-700">Choose file</span>
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Available (quintals)</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      max={selectedCrop.quantity}
                      min="1"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Maximum available: {selectedCrop.quantity} quintals</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MSP Price (₹/quintal)</label>
                    <input
                      type="text"
                      name="mspPrice"
                      value={formData.mspPrice}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full bg-gray-50 focus:outline-none"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Government set minimum support price</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Price (₹/quintal)</label>
                    <input
                      type="number"
                      name="finalPrice"
                      value={formData.finalPrice}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={formData.mspPrice}
                      required
                    />
                    {Number(formData.finalPrice) < Number(formData.mspPrice) && (
                      <p className="mt-1 text-xs text-red-500">Price cannot be lower than MSP</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded-lg px-4 py-3 w-20 focus:outline-none ${
                          formData.discountEnabled ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'bg-gray-50'
                        }`}
                        disabled={!formData.discountEnabled}
                        min="0"
                        max="100"
                      />
                      <span className="text-gray-500">%</span>
                      <label className="inline-flex items-center ml-2">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="discountEnabled"
                            checked={formData.discountEnabled}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${formData.discountEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${formData.discountEnabled ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Enable</span>
                      </label>
                    </div>

                    {formData.discountEnabled && formData.discount > 0 && formData.finalPrice && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700">Final price: </span>
                        <span className="text-green-600 font-medium">₹{calculateFinalPrice()}/quintal</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refundable</label>
                    <select
                      name="refundable"
                      value={formData.refundable}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Period (Days)</label>
                    <input
                      type="number"
                      name="returnDays"
                      value={formData.returnDays}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      max="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Period (Days)</label>
                    <input
                      type="number"
                      name="exchangeDays"
                      value={formData.exchangeDays}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      max="30"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 py-2">
                  <label className="block text-sm font-medium text-gray-700">Listing Status:</label>
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-sm text-gray-500">Inactive</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${formData.active ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSelectedCrop(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-2 focus:outline-none focus:ring-2 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                  >
                    {selectedCrop.type === 'edit' ? 'Update Product' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellProduct;