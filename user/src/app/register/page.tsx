"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import RegisterImage from "@/assets/Login.jpg"; // Replace with your registration image
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function RegisterForm() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Verify OTP, 3: Complete Registration
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP to mobile number
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        mobileNumber,
      });

      if (response.data.message) {
        setStep(2); // Move to OTP verification step
        toast.success("OTP sent successfully. Please check your mobile.");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("Verifying OTP...");
      const response = await axios.post(`${API_URL}/api/auth/verify-otp-register`, {
        mobileNumber,
        otp,
        password,
      });
  
      console.log("OTP Verification Response:", response.data);
  
      if (response.data.success) {
        setStep(3); // Move to registration step
        toast.success("OTP verified successfully. Please complete your registration.");
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailID || !password || !state || !city || !pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        mobileNumber,
        emailID,
        password,
        state,
        city,
        pincode,
      });

      if (response.data.message) {
        toast.success("Registration successful! Redirecting to login...");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-screen p-6"
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white p-18 rounded-xl max-w-7xl w-full shadow-lg">
        <div className="w-3/5 flex justify-center">
          <Image
            src={RegisterImage}
            alt="Register Illustration"
            width={1400}
            height={1400}
            className="object-contain"
          />
        </div>

        <Card className="w-full md:w-2/5 p-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-green-700 font-semibold">
              Register Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleSendOTP}>
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

                  <Button
                    type="submit"
                    className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                    disabled={
                      isLoading || !mobileNumber || mobileNumber.length !== 10
                    }
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="mobile" className="text-lg font-medium">
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      type="text"
                      placeholder="Enter 10-digit Mobile Number"
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

                  <div className="grid gap-2">
                    <Label htmlFor="otp" className="text-lg font-medium">
                      OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                    disabled={isLoading || !otp || !mobileNumber || !password}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleRegister}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-lg font-medium">
                      Email ID
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={emailID}
                      onChange={(e) => setEmailID(e.target.value)}
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
                  <div className="grid gap-2">
                    <Label htmlFor="state" className="text-lg font-medium">
                      State
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="Enter your state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="text-lg font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pincode" className="text-lg font-medium">
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="Enter your pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-base">
              Already have an account?
              <a href="/login" className="text-green-600 underline font-medium">
                {" "}
                Login Here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
