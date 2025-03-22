"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Login from "@/assets/Login.jpg"; // Replace with your actual image

export function LoginForm() {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full min-h-screen p-6")}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white p-18 rounded-xl max-w-7xl w-full shadow-lg">

        {/* Enlarged Image */}
        <div className="w-3/5 flex justify-center">
          <Image src={Login} alt="Login Illustration" width={1400} height={1400} className="object-contain" />
        </div>

        {/* Enlarged Card */}
        <Card className="w-full md:w-2/5 p-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-green-700 font-semibold">
              Login to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-6">

                {/* Name Field */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-lg font-medium">Your Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" required />
                </div>

                {/* Aadhaar Field with 12-digit validation */}
                <div className="grid gap-2">
                  <Label htmlFor="aadhaar" className="text-lg font-medium">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="Enter 12-digit Aadhaar Number"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    required
                  />
                </div>

                {/* OTP Field */}
                <div className="grid gap-2">
                  <Label htmlFor="otp" className="text-lg font-medium">OTP</Label>
                  <div className="flex gap-2">
                    <Input id="otp" type="text" placeholder="Enter OTP" required />
                    <Button className="bg-green-600 hover:bg-green-700">Send OTP</Button>
                  </div>
                </div>

                {/* Login Button */}
                <Button type="submit" className="w-full text-lg bg-green-600 hover:bg-green-700 py-3">
                  Login
                </Button>
              </div>

              {/* Register Link */}
              <div className="mt-6 text-center text-base">
                Don&apos;t have an account?
                <a href="#" className="text-green-600 underline font-medium"> Register Here</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
