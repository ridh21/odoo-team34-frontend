// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart, Search, ShoppingCart } from "lucide-react";
// import Navbar from "@/components/UserNavbar";
// import { toast } from "react-hot-toast";

// import Mango from "@/assets/mango.jpg";
// import Pomegranate from "@/assets/pomegranate.jpg";
// import Bananas from "@/assets/bananas.jpg";
// import Apples from "@/assets/apples.jpg";
// import Grapes from "@/assets/grapes.jpg";
// import Papaya from "@/assets/papaya.jpg";

// const products = [
//   {
//     id: 1,
//     name: "Organic Alphonso Mangoes",
//     price: 135,
//     originalPrice: 150,
//     discount: "10%",
//     unit: "kg",
//     image: Mango, // Linked to the imported Mango image
//     location: "Nashik, India",
//     farmer: "Rakesh Patel",
//   },
//   {
//     id: 2,
//     name: "Farm Fresh Pomegranate",
//     price: 158,
//     originalPrice: 180,
//     discount: "12%",
//     unit: "kg",
//     image: Pomegranate, // Linked to the imported Pomegranate image
//     location: "Solapur, Maharashtra",
//     farmer: "Manohar Jadhav",
//   },
//   {
//     id: 3,
//     name: "Naturally Ripened Bananas",
//     price: 45,
//     originalPrice: 50,
//     discount: "10%",
//     unit: "dozen",
//     image: Bananas, // Linked to the imported Bananas image
//     location: "Pollachi, Tamil Nadu",
//     farmer: "Rakesh Patel",
//   },
//   {
//     id: 4,
//     name: "Pesticide-Free Apples",
//     price: 198,
//     originalPrice: 220,
//     discount: "10%",
//     unit: "kg",
//     image: Apples, // Linked to the imported Apples image
//     location: "Himachal Pradesh",
//     farmer: "Arjun Thakur",
//   },
//   {
//     id: 5,
//     name: "Organic Seedless Grapes",
//     price: 120,
//     originalPrice: 130,
//     discount: "8%",
//     unit: "kg",
//     image: Grapes, // Linked to the imported Grapes image
//     location: "Nashik Vineyards, Maharashtra",
//     farmer: "Vinayak Pawar",
//   },
//   {
//     id: 6,
//     name: "Farm-Fresh Papaya",
//     price: 90,
//     originalPrice: 100,
//     discount: "10%",
//     unit: "kg",
//     image: Papaya, // Linked to the imported Papaya image
//     location: "Karnataka",
//     farmer: "Rajesh Gowda",
//   },
// ];

// const Sidebar = () => {
//   const [price, setPrice] = useState(150);
//   return (
//     <div className="w-1/4 p-4">
//       <Card className="mb-4">
//         <CardContent>
//           <h3 className="text-lg font-bold">Categories</h3>
//           <ul className="mt-2 space-y-2">
//             <li><input type="checkbox" className="mr-2" />Fruits</li>
//             <li><input type="checkbox" className="mr-2" />Dairy</li>
//             <li><input type="checkbox" className="mr-2" />Grains</li>
//             <li><input type="checkbox" className="mr-2" />Vegetables</li>
//           </ul>
//         </CardContent>
//       </Card>
//       <Card className="mb-4">
//         <CardContent>
//           <h3 className="text-lg font-bold">Price Range</h3>
//           <input 
//             type="range" 
//             min="50" 
//             max="1500" 
//             value={price} 
//             onChange={(e) => setPrice(e.target.value)} 
//             className="w-full" 
//           />
//           <p className="text-center mt-2">₹{price}</p>
//         </CardContent>
//       </Card>
//       <Card className="mb-4">
//         <CardContent>
//           <h3 className="text-lg font-bold">Farmers</h3>
//           <div>
//             <input type="checkbox" id="allFarmers" />
//             <label htmlFor="allFarmers" className="ml-2">All Farmers</label>
//           </div>
//           <div>
//             <input type="checkbox" id="certifiedFarmers" />
//             <label htmlFor="certifiedFarmers" className="ml-2">Certified Farmers</label>
//           </div>
//         </CardContent>
//       </Card>
//       <Card className="mb-4">
//         <CardContent>
//           <h3 className="text-lg font-bold">Location</h3>
//           <ul className="mt-2 space-y-2">
//             <li><input type="checkbox" className="mr-2" />Ahmedabad</li>
//             <li><input type="checkbox" className="mr-2" />Bhavnagar</li>
//             <li><input type="checkbox" className="mr-2" />Rajkot</li>
//             <li><input type="checkbox" className="mr-2" />Surat</li>
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// const Marketplace = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [cart, setCart] = useState([]);

//   const toggleWishlist = (product) => {
//     const isInWishlist = wishlist.some(item => item.id === product.id);
    
//     if (isInWishlist) {
//       setWishlist(wishlist.filter(item => item.id !== product.id));
//       toast.success(`${product.name} removed from wishlist`);
//     } else {
//       setWishlist([...wishlist, product]);
//       toast.success(`${product.name} added to wishlist`);
//     }
//   };

//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
    
//     toast.success(`${product.name} added to cart`);
//   };

//   return (
//     <div className="p-0 flex flex-col">
//       <Navbar 
//         className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md" 
//         cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
//         wishlistCount={wishlist.length}
//       />
//       <div className="mt-5 p-5 flex justify-between items-center">
//         <div className="flex space-x-4">
//           <Button 
//             variant="outline" 
//             className="flex items-center gap-2"
//             onClick={() => console.log('Cart items:', cart)}
//           >
//             <ShoppingCart size={18} />
//             Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
//           </Button>
//           <Button 
//             variant="outline" 
//             className="flex items-center gap-2"
//             onClick={() => console.log('Wishlist items:', wishlist)}
//           >
//             <Heart size={18} />
//             Wishlist ({wishlist.length})
//           </Button>
//         </div>
//         <div className="relative w-1/4">
//           <input type="text" placeholder="Search..." className="w-full p-2 border rounded-md shadow-sm pl-10" />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>
//       <div className="flex">
//         <Sidebar />
//         <div className="w-3/4">
//           <h1 className="text-3xl font-bold text-green-800 text-center p-0">Market Place</h1>
//           <p className="text-gray-600 mt-1 m-3 text-center">
//             Explore fresh, organic produce directly from trusted farmers
//           </p>
//           <div className="grid grid-cols-3 gap-6 mt-6">
//             {products.map((product) => (
//               <Card key={product.id} className="relative">
//                 <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover rounded-t-lg" />
//                 <CardContent className="p-4">
//                   <div 
//                     className="absolute top-3 right-3 cursor-pointer transition-transform transform hover:scale-110"
//                     onClick={() => toggleWishlist(product)}
//                   >
//                     <Heart 
//                       className={`w-6 h-6 drop-shadow-md ${
//                         wishlist.some(item => item.id === product.id) 
//                           ? "fill-red-600 text-red-600" 
//                           : "stroke-green-700 hover:fill-green-700 hover:text-green-700"
//                       }`} 
//                     />
//                   </div>
//                   <h2 className="font-semibold text-lg">{product.name}</h2>
//                   <p className="text-sm text-gray-500">{product.location}</p>
//                   <p className="text-xs text-gray-500">By {product.farmer}</p>
//                   <p className="text-xl font-bold">₹{product.price}/{product.unit}</p>
//                   <Button 
//                     className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
//                     onClick={() => addToCart(product)}
//                   >
//                     Add to Cart
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Marketplace;


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Search, ShoppingCart } from "lucide-react";
import Navbar from "@/components/UserNavbar";
import { toast } from "react-hot-toast";

// Import images
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
    category: "Fruits",
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
    category: "Fruits",
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
    category: "Fruits",
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
    category: "Fruits",
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
    category: "Fruits",
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
    category: "Fruits",
  },
];

const Sidebar = ({ priceRange, setPriceRange, filters, setFilters }) => {
  // Handle category checkbox changes
  const handleCategoryChange = (category) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter(c => c !== category)
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category]
      });
    }
  };

  // Handle location checkbox changes
  const handleLocationChange = (location) => {
    if (filters.locations.includes(location)) {
      setFilters({
        ...filters,
        locations: filters.locations.filter(l => l !== location)
      });
    } else {
      setFilters({
        ...filters,
        locations: [...filters.locations, location]
      });
    }
  };

  // Handle farmer checkbox changes
  const handleFarmerChange = (farmer) => {
    if (filters.farmers.includes(farmer)) {
      setFilters({
        ...filters,
        farmers: filters.farmers.filter(f => f !== farmer)
      });
    } else {
      setFilters({
        ...filters,
        farmers: [...filters.farmers, farmer]
      });
    }
  };

  return (
    <div className="w-1/4 p-4">
      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Categories</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <input
                type="checkbox"
                id="allCategories"
                className="mr-2"
                checked={filters.categories.length === 0}
                onChange={() => setFilters({...filters, categories: []})}
              />
              <label htmlFor="allCategories">All Categories</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="fruits"
                className="mr-2"
                checked={filters.categories.includes("Fruits")}
                onChange={() => handleCategoryChange("Fruits")}
              />
              <label htmlFor="fruits">Fruits</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="dairy"
                className="mr-2"
                checked={filters.categories.includes("Dairy")}
                onChange={() => handleCategoryChange("Dairy")}
              />
              <label htmlFor="dairy">Dairy</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="grains"
                className="mr-2"
                checked={filters.categories.includes("Grains")}
                onChange={() => handleCategoryChange("Grains")}
              />
              <label htmlFor="grains">Grains</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="vegetables"
                className="mr-2"
                checked={filters.categories.includes("Vegetables")}
                onChange={() => handleCategoryChange("Vegetables")}
              />
              <label htmlFor="vegetables">Vegetables</label>
            </li>
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
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-center mt-2">₹{priceRange}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Farmers</h3>
          <div>
            <input
              type="checkbox"
              id="allFarmers"
              checked={filters.farmers.length === 0}
              onChange={() => setFilters({...filters, farmers: []})}
            />
            <label htmlFor="allFarmers" className="ml-2">All Farmers</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="rakeshPatel"
              checked={filters.farmers.includes("Rakesh Patel")}
              onChange={() => handleFarmerChange("Rakesh Patel")}
            />
            <label htmlFor="rakeshPatel" className="ml-2">Rakesh Patel</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="manoharJadhav"
              checked={filters.farmers.includes("Manohar Jadhav")}
              onChange={() => handleFarmerChange("Manohar Jadhav")}
            />
            <label htmlFor="manoharJadhav" className="ml-2">Manohar Jadhav</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="manoharJadhav"
              checked={filters.farmers.includes("Vinayak Pawar")}
              onChange={() => handleFarmerChange("Vinayak Pawar")}
            />
            <label htmlFor="manoharJadhav" className="ml-2">Vinayak Pawar</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="manoharJadhav"
              checked={filters.farmers.includes("Rajesh Gowda")}
              onChange={() => handleFarmerChange("Rajesh Gowda")}
            />
            <label htmlFor="manoharJadhav" className="ml-2">Rajesh Gowda</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="arjunThakur"
              checked={filters.farmers.includes("Arjun Thakur")}
              onChange={() => handleFarmerChange("Arjun Thakur")}
            />
            <label htmlFor="arjunThakur" className="ml-2">Arjun Thakur</label>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <h3 className="text-lg font-bold">Location</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <input
                type="checkbox"
                id="ahmedabad"
                className="mr-2"
                checked={filters.locations.includes("Ahmedabad")}
                onChange={() => handleLocationChange("Ahmedabad")}
              />
              <label htmlFor="ahmedabad">Ahmedabad</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="nashik"
                className="mr-2"
                checked={filters.locations.includes("Nashik")}
                onChange={() => handleLocationChange("Nashik")}
              />
              <label htmlFor="nashik">Nashik</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="rajkot"
                className="mr-2"
                checked={filters.locations.includes("Rajkot")}
                onChange={() => handleLocationChange("Rajkot")}
              />
              <label htmlFor="rajkot">Rajkot</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="surat"
                className="mr-2"
                checked={filters.locations.includes("Surat")}
                onChange={() => handleLocationChange("Surat")}
              />
              <label htmlFor="surat">Surat</label>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

const Marketplace = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [priceRange, setPriceRange] = useState(1500);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    farmers: []
  });

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

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

  // Filter products based on search, price range, and other filters
  const filteredProducts = products.filter(product => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by price range
    if (product.price > priceRange) {
      return false;
    }

    // Filter by categories
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Filter by locations
    if (filters.locations.length > 0 && !filters.locations.some(location =>
      product.location.toLowerCase().includes(location.toLowerCase())
    )) {
      return false;
    }

    // Filter by farmers
    if (filters.farmers.length > 0 && !filters.farmers.includes(product.farmer)) {
      return false;
    }

    return true;
  });

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
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-md shadow-sm pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex">
        <Sidebar
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          filters={filters}
          setFilters={setFilters}
        />
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-green-800 text-center p-0">Market Place</h1>
          <p className="text-gray-600 mt-1 m-3 text-center">
            Explore fresh, organic produce directly from trusted farmers
          </p>
          <div className="grid grid-cols-3 gap-6 mt-6 p-10 pt-5">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <Card key={product.id} className="relative overflow-hidden p-0">
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-md"
          />
          <div
            className="absolute top-3 right-3 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => toggleWishlist(product)}
          >
            <Heart
              className={`w-6 h-6 drop-shadow-md ${
                wishlist.some(item => item.id === product.id)
                  ? "fill-red-600 text-red-600"
                  : "stroke-white hover:fill-red-600 hover:text-green-700"
              }`}
            />
          </div>
        </div>
        <CardContent className="p-4">
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
    ))
  ) : (
              <div className="col-span-3 text-center py-10">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange(1500);
                    setFilters({
                      categories: [],
                      locations: [],
                      farmers: []
                    });
                    toast.success("All filters cleared");
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;