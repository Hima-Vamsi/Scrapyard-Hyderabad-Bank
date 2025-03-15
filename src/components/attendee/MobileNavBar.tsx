"use client";

import { BadgeDollarSign, Trophy, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import LogOutButton from "@/components/LogOutButton";

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

const MobileNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#121212] text-white p-4 border-t-2 border-[#303030] flex justify-around h-auto py-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex flex-col items-center text-sm hover:text-[#ec3750] transition-colors"
        >
          <item.icon size={24} />
          <span>{item.name}</span>
        </Link>
      ))}
      <div className="flex flex-col items-center text-sm  hover:text-[#ec3750] transition-colors">
        <LogOutButton />
        <span>Logout</span>
      </div>
    </nav>
  );
};

export default MobileNavBar;
