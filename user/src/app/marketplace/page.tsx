"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Navbar from "@/components/UserNavbar";
import { toast } from "react-hot-toast";

import Mango from "@/assets/mango.jpg";
import Pomegranate from "@/assets/pomegranate.jpg";
import Bananas from "@/assets/bananas.jpg";
import Apples from "@/assets/apples.jpg";
import Grapes from "@/assets/grapes.jpg";
import Papaya from "@/assets/papaya.jpg";

const products = [
  {
    id: 1,
    name: "Organic Alphonso Mangoes",
    price: 135,
    originalPrice: 150,
    discount: "10%",
    unit: "kg",
    image: Mango, // Linked to the imported Mango image
    location: "Nashik, India",
    farmer: "Rakesh Patel",
  },
  {
    id: 2,
    name: "Farm Fresh Pomegranate",
    price: 158,
    originalPrice: 180,
    discount: "12%",
    unit: "kg",
    image: Pomegranate, // Linked to the imported Pomegranate image
    location: "Solapur, Maharashtra",
    farmer: "Manohar Jadhav",
  },
  {
    id: 3,
    name: "Naturally Ripened Bananas",
    price: 45,
    originalPrice: 50,
    discount: "10%",
    unit: "dozen",
    image: Bananas, // Linked to the imported Bananas image
    location: "Pollachi, Tamil Nadu",
    farmer: "Rakesh Patel",
  },
  {
    id: 4,
    name: "Pesticide-Free Apples",
    price: 198,
    originalPrice: 220,
    discount: "10%",
    unit: "kg",
    image: Apples, // Linked to the imported Apples image
    location: "Himachal Pradesh",
    farmer: "Arjun Thakur",
  },
  {
    id: 5,
    name: "Organic Seedless Grapes",
    price: 120,
    originalPrice: 130,
    discount: "8%",
    unit: "kg",
    image: Grapes, // Linked to the imported Grapes image
    location: "Nashik Vineyards, Maharashtra",
    farmer: "Vinayak Pawar",
  },
  {
    id: 6,
    name: "Farm-Fresh Papaya",
    price: 90,
    originalPrice: 100,
    discount: "10%",
    unit: "kg",
    image: Papaya, // Linked to the imported Papaya image
    location: "Karnataka",
    farmer: "Rajesh Gowda",
  },
];

const Sidebar = () => {
  const [price, setPrice] = useState(150);
  return (
    <div className="w-1/4 p-4">
      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Categories</h3>
          <ul className="mt-2 space-y-2">
            <li><input type="checkbox" className="mr-2" />Fruits</li>
            <li><input type="checkbox" className="mr-2" />Dairy</li>
            <li><input type="checkbox" className="mr-2" />Grains</li>
            <li><input type="checkbox" className="mr-2" />Vegetables</li>
          </ul>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Price Range</h3>
          <input 
            type="range" 
            min="50" 
            max="1500" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full" 
          />
          <p className="text-center mt-2">₹{price}</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Farmers</h3>
          <div>
            <input type="checkbox" id="allFarmers" />
            <label htmlFor="allFarmers" className="ml-2">All Farmers</label>
          </div>
          <div>
            <input type="checkbox" id="certifiedFarmers" />
            <label htmlFor="certifiedFarmers" className="ml-2">Certified Farmers</label>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Location</h3>
          <ul className="mt-2 space-y-2">
            <li><input type="checkbox" className="mr-2" />Ahmedabad</li>
            <li><input type="checkbox" className="mr-2" />Bhavnagar</li>
            <li><input type="checkbox" className="mr-2" />Rajkot</li>
            <li><input type="checkbox" className="mr-2" />Surat</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

const Marketplace = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.success(`${product.name} removed from wishlist`);
    } else {
      setWishlist([...wishlist, product]);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="p-0 flex flex-col">
      <Navbar 
        className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md" 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        wishlistCount={wishlist.length}
      />
      <div className="mt-5 p-5 flex justify-between items-center">
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => console.log('Cart items:', cart)}
          >
            <ShoppingCart size={18} />
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => console.log('Wishlist items:', wishlist)}
          >
            <Heart size={18} />
            Wishlist ({wishlist.length})
          </Button>
        </div>
        <div className="relative w-1/4">
          <input type="text" placeholder="Search..." className="w-full p-2 border rounded-md shadow-sm pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex">
        <Sidebar />
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-green-800 text-center p-0">Market Place</h1>
          <p className="text-gray-600 mt-1 m-3 text-center">
            Explore fresh, organic produce directly from trusted farmers
          </p>
          <div className="grid grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
              <Card key={product.id} className="relative">
                <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                <CardContent className="p-4">
                  <div 
                    className="absolute top-3 right-3 cursor-pointer transition-transform transform hover:scale-110"
                    onClick={() => toggleWishlist(product)}
                  >
                    <Heart 
                      className={`w-6 h-6 drop-shadow-md ${
                        wishlist.some(item => item.id === product.id) 
                          ? "fill-red-600 text-red-600" 
                          : "stroke-green-700 hover:fill-green-700 hover:text-green-700"
                      }`} 
                    />
                  </div>
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.location}</p>
                  <p className="text-xs text-gray-500">By {product.farmer}</p>
                  <p className="text-xl font-bold">₹{product.price}/{product.unit}</p>
                  <Button 
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
