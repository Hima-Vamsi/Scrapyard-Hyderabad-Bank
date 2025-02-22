"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = { role: "attendee" | "organizer" };

export function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (res.ok) {
          const data: User = await res.json();
          router.replace(`/${data.role}/dashboard`);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setShowPassword(true);
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      router.replace(`/${data.role}/dashboard`);
    } else {
      setMessage(data.error || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="font-bold uppercase text-[#e0e6ed] opacity-40 text-[16px]">
        Scrapyard Hyderabad
      </h2>
      <h1 className="text-[48px] font-semibold tracking-tight text-[#EC3750]">
        Sign in to SHB
      </h1>
      {message && <p className="text-sm text-red-500">{message}</p>}
      <form
        onSubmit={showPassword ? handleSubmit : handleContinue}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email..."
            value={formData.email}
            onChange={handleChange}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
          />
        </div>
        {showPassword && (
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
            />
          </div>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="ml-auto w-[114px] h-[43px] gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage:
                "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
            }}
          >
            {showPassword ? "Sign In" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
