"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Login from "@/assets/Login.jpg";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/auth/login`, {
        mobileNumber,
        password,
      });

      if (response.data.success) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: response.data.user.id,
            name: response.data.user.name,
            mobileNumber: response.data.user.mobileNumber,
          })
        );
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full min-h-screen p-6")}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white p-18 rounded-xl max-w-7xl w-full shadow-lg">
        <div className="w-3/5 flex justify-center">
          <Image
            src={Login}
            alt="Login Illustration"
            width={1400}
            height={1400}
            className="object-contain"
          />
        </div>

        <Card className="w-full md:w-2/5 p-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-green-700 font-semibold">
              Login to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="mobile" className="text-lg font-medium">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="Enter 10-digit Mobile Number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-lg font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-base">
              Don&apos;t have an account?
              <a href="/register" className="text-green-600 underline font-medium">
                {" "}
                Register Here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}