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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function LoginForm() {
  const router = useRouter();
  const [adharNumber, setAdharNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Check Adhar, 2: Enter Password, 3: Enter OTP
  const [isLoading, setIsLoading] = useState(false);
  const [farmerId, setFarmerId] = useState("");
  const [adharUUID, setAdharUUID] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");

  // Step 1: Check if Adhar card is valid
  const handleCheckAdhar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adharNumber || adharNumber.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/farmers/check-adhar`, {
        adharNumber
      });

      if (response.data.success) {
        setAdharUUID(response.data.adharUUID);
        setMobileNumber(response.data.mobileNumber);
        setName(response.data.name);
        
        // If farmer is already registered, move to password step
        if (response.data.isRegistered) {
          setFarmerId(response.data.farmerId);
          setStep(2);
          toast.success("Aadhaar verified. Please enter your password.");
        } else {
          // If not registered, redirect to registration page
          toast.info("You are not registered. Redirecting to registration page.");
          router.push("/register");
        }
      }
    } catch (error: any) {
      console.error("Error checking Aadhaar:", error);
      toast.error(error.response?.data?.error || "Invalid Aadhaar number");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Login with password
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/farmers/login`, {
        adharNumber,
        password
      });

      if (response.data.success) {
        if (response.data.requireOTP) {
          // If OTP is required for 2FA
          setFarmerId(response.data.farmerId);
          setStep(3);
          toast.success("Password verified. Please enter the OTP sent to your mobile.");
        } else {
          // If no OTP required (though the current implementation always requires OTP)
          handleLoginSuccess(response.data);
        }
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Send login OTP (if user needs to resend)
  const handleSendLoginOTP = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/farmers/send-login-otp`, {
        adharNumber
      });

      if (response.data.success) {
        toast.success("OTP sent successfully to your registered mobile number");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Verify login OTP
  const handleVerifyLoginOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/farmers/verify-login-otp`, {
        adharNumber,
        otp
      });

      if (response.data.success) {
        handleLoginSuccess(response.data);
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (data: any) => {
    localStorage.setItem(
      "farmerInfo",
      JSON.stringify({
        farmerId: data.farmerId,
        name: data.name,
        adharUUID: data.adharUUID,
        mobileNumber: data.mobileNumber,
      })

    );

    toast.success("Login successful!");
    router.push("/dashboard");
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
            {step === 1 && (
              <form onSubmit={handleCheckAdhar}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="aadhaar" className="text-lg font-medium">
                      Aadhaar Number
                    </Label>
                    <Input
                      id="aadhaar"
                      type="text"
                      placeholder="Enter 12-digit Aadhaar Number"
                      pattern="[0-9]{12}"
                      maxLength={12}
                      value={adharNumber}
                      onChange={(e) => setAdharNumber(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                    disabled={isLoading || !adharNumber || adharNumber.length !== 12}
                  >
                    {isLoading ? "Verifying..." : "Verify Aadhaar"}
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePasswordLogin}>
                <div className="grid gap-6">
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
                    disabled={isLoading || !password}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleVerifyLoginOTP}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="otp" className="text-lg font-medium">
                      OTP
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleSendLoginOTP}
                        disabled={isLoading}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg bg-green-600 hover:bg-green-700 py-3"
                    disabled={isLoading || !otp}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            )}

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
