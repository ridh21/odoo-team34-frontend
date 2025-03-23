"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/UserNavbar";
import { Heart, ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";

const productsData = [
  {
    id: 1,
    name: "Organic Alphonso Mangoes",
    description: "Fresh, organic Alphonso mangoes sourced directly from Nashik farms. Juicy, sweet, and chemical-free.",
    price: 135,
    originalPrice: 150,
    discount: "10%",
    unit: "kg",
    image: "/images/organic_mango.png",
    location: "Nashik, India",
    farmer: "Rakesh Patel",
    stock: 50,
    reviews: [
      { id: 1, user: "Rahul S.", rating: 4, comment: "Great taste and quality!" },
      { id: 2, user: "Priya M.", rating: 5, comment: "Loved the freshness of the mangoes!" },
      { id: 3, user: "Anjali K.", rating: 3, comment: "Good, but a bit pricey." }
    ]
  },
  {
    id: 2,
    name: "Farm Fresh Pomegranate",
    description: "Juicy and sweet pomegranates from the farms of Solapur. Rich in antioxidants and vitamins.",
    price: 158,
    originalPrice: 180,
    discount: "12%",
    unit: "kg",
    image: "/images/pomegranate.jpg",
    location: "Solapur, Maharashtra",
    farmer: "Manohar Jadhav",
    stock: 35,
    reviews: [
      { id: 1, user: "Vikram P.", rating: 5, comment: "Best pomegranates I've had in a while!" },
      { id: 2, user: "Meera S.", rating: 4, comment: "Fresh and juicy. Will buy again." }
    ]
  }
];

const ProductDetails = () => {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // Load product data and check if it's in favorites
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      
      // For demo purposes, use the hardcoded product if ID is 1
      if (params?.id === "1") {
        setProduct(productsData[0]);
      } else if (params?.id === "2") {
        setProduct(productsData[1]);
      } else {
        // Find product by ID in the array
        const productId = parseInt(params?.id);
        const foundProduct = productsData.find(p => p.id === productId);
        setProduct(foundProduct || null);
      }
      
      // Check if product is in favorites
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        setIsFavorite(!!favorites[params?.id]);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
      
      setLoading(false);
    };

    if (params?.id) {
      loadProduct();
    }
  }, [params?.id]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    const newState = !isFavorite;
    setIsFavorite(newState);
    
    // Update localStorage
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
      if (newState) {
        favorites[product.id] = true;
      } else {
        delete favorites[product.id];
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    try {
      // Get current cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product is already in cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          unit: product.unit
        });
      }
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message
      setCartMessage(`${quantity} ${product.unit} of ${product.name} added to cart!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  const goBack = () => {
    router.push('/marketplace');
  };

  if (loading) {
    return (
      <div className="p-0 flex flex-col">
        <Navbar className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md" />
        <div className="flex justify-center items-center h-screen">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-0 flex flex-col">
        <Navbar className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md" />
        <div className="flex flex-col justify-center items-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={goBack} className="bg-green-600 text-white">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 flex flex-col">
      <Navbar className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md" />
      <div className="flex flex-col items-center p-4 md:p-10 mt-20">
        {/* Back button */}
        <div className="w-full max-w-6xl mb-4">
          <Button 
            onClick={goBack} 
            variant="ghost" 
            className="flex items-center text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Marketplace
          </Button>
        </div>

        <Card className="max-w-6xl w-full shadow-lg rounded-lg">
          <CardContent className="flex flex-col md:flex-row p-4">
            {/* Product Image */}
            <div className="w-full md:w-1/2 p-2 md:p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="rounded-lg w-full object-cover"
                priority
              />
            </div>
            {/* Product Details */}
            <div className="w-full md:w-1/2 p-4 md:p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-4xl font-bold">{product.name}</h1>
                <Heart
                  onClick={toggleFavorite}
                  className={`w-6 h-6 md:w-8 md:h-8 cursor-pointer ${
                    isFavorite ? "fill-red-600 text-red-600" : "stroke-green-700 hover:fill-green-700"
                  }`}
                />
              </div>
              <p className="text-gray-500 mt-2">{product.location}</p>
              <p className="text-lg font-semibold mt-2">By: {product.farmer}</p>
              
              {/* Description */}
              <p className="mt-4 text-gray-700">{product.description}</p>
              
              {/* Stock */}
              <p className="mt-4 text-sm">
                {product.stock > 10 
                  ? <span className="text-green-600">In Stock ({product.stock} available)</span> 
                  : product.stock > 0 
                    ? <span className="text-orange-500">Low Stock (Only {product.stock} left)</span>
                    : <span className="text-red-600">Out of Stock</span>
                }
              </p>
              
              {/* Price and Discount */}
              <div className="flex items-center mt-4">
                <p className="text-2xl md:text-3xl font-bold text-green-700">₹{product.price}/{product.unit}</p>
                <p className="text-gray-400 line-through ml-4">₹{product.originalPrice}</p>
                <p className="text-green-600 ml-4">{product.discount} OFF</p>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center mt-6">
                <Button 
                  onClick={decreaseQuantity} 
                  className="bg-gray-300 text-black p-2"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </Button>
                <p className="mx-4 text-xl">{quantity}</p>
                <Button 
                  onClick={increaseQuantity} 
                  className="bg-gray-300 text-black p-2"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </Button>
              </div>
              
              {/* Add to Cart and Buy Now */}
              <div className="flex items-center mt-6 gap-3">
                <Button
                  onClick={addToCart}
                  className="bg-blue-600 text-white flex items-center"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button 
                  onClick={buyNow}
                  className="bg-green-600 text-white"
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Cart Message */}
              {cartMessage && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
                  {cartMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="max-w-6xl w-full mt-10">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {product.reviews.map((review) => (
              <Card key={review.id} className="border p-4 shadow-sm rounded-lg">
                <CardContent>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{review.user}</h3>
                    <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;