"use client";

import React, { useEffect, useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.push("/");
    } else {
      console.error("Failed to log out");
    }
  };

  if (!mounted) return null;

  return (
    <button onClick={handleLogout} className="text-[28px]">
      <IoExitOutline />
    </button>
  );
};

export default LogOutButton;
