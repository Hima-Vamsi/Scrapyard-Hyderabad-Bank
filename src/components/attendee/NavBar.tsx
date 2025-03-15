"use client";

import LogOutButton from "@/components/LogOutButton";
import { useState, useEffect } from "react";
import { BadgeDollarSign, Trophy, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  {
    name: "Transactions",
    icon: BadgeDollarSign,
    href: "/attendee/dashboard",
  },
  {
    name: "Transfers",
    icon: ArrowLeftRight,
    href: "/attendee/transfers",
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    href: "/attendee/leaderboard",
  },
];

const NavBar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch("/api/public/util/user-name");
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <nav className="flex flex-col h-screen w-64 text-white p-4 border-r-2 border-[#303030]">
      <div className="flex justify-between items-center mb-8">
        <Link href={"/attendee/dashboard"}>
          <Image src="/SHB Logo.png" alt="Logo" width={32} height={32} />
        </Link>
        <LogOutButton />
      </div>

      <div className="mb-8">
        <p className="text-[#e0e6ed] text-4xl font-semibold">
          Scrapyard Hyderabad
        </p>
        <p className="text-gray-400 mt-3">Welcome back,</p>
        <p className="text-xl font-bold">{userName}</p>
      </div>

      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[#ec3750] hover:bg-opacity-[0.2] transition-colors"
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
