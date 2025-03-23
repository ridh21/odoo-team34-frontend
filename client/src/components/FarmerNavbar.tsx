import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Logo from "@/assets/Krushimart_logo.png";
import Profile from "@/assets/Profile.jpg";


export default function FarmerNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    // Clear user session if needed (e.g., localStorage, cookies)
    // Redirect to home page
    router.push("/");
  };

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src={Logo} alt="KrushiMart Logo" width={40} height={40} />
          <h1 className="text-green-700 text-2xl font-bold">KrushiMart</h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-16">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/sellproduct"
                className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold"
              >
                Sell Crop
              </Link>
            </li>
            <li>
              <Link
                href="/crophealth"
                className="text-gray-700 text-xl transition-colors duration-300 ease-in-out hover:text-green-700 hover:font-semibold"
              >
                Crop Health Diagnosis
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile & Message Section */}
        <div className="flex items-center space-x-6">
          {/* Chat Button */}
          <Link href="/farmer/chat">
            <button className="relative bg-green-700 text-white p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-green-800">
              <MessageSquare className="w-6 h-6" />
            </button>
          </Link>
          
          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <Image
                src= {Profile} // Replace with actual profile image path
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border border-gray-300 shadow-sm"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}