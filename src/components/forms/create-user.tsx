"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field?: string
  ) => {
    if (typeof e === "string" && field) {
      setFormData({ ...formData, [field]: e });
    } else if (typeof e !== "string") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/auth/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("User created successfully!");
      setFormData({ name: "", email: "", password: "", role: "attendee" });
    } else {
      setMessage(data.error || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div>
        <h1 className="text-[36px] font-semibold tracking-tight text-[#EC3750] text-center">
          User Registration
        </h1>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="sr-only">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name..."
            value={formData.name}
            onChange={handleChange}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="role" className="sr-only">
            Role
          </Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value) => handleChange(value, "role")}
          >
            <SelectTrigger className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px] w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-white/10">
              <SelectItem
                value="attendee"
                className="focus:bg-white/10 focus:text-white"
              >
                Attendee
              </SelectItem>
              <SelectItem
                value="organizer"
                className="focus:bg-white/10 focus:text-white"
              >
                Organizer
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="ml-auto w-full h-auto gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage:
                "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
            }}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
