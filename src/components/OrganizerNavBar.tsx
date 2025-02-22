"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogOutButton from "@/components/LogOutButton";

const navLinks = [
  { name: "Dashboard", href: "/organizer/dashboard" },
  { name: "Add User", href: "/organizer/create-user" },
];

const OrganizerNavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-black shadow border-b-[1px] border-[#303030] text-white">
      <div className="flex items-center gap-4">
        <Link
          href="/organizer/dashboard"
          className="text-xl font-bold text-white"
        >
          <Image src="/SHB Logo.png" alt="SHB Logo" width={40} height={40} />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex sm:items-center flex-grow justify-end h-full items-center">
          {navLinks.map((link, index) => (
            <div key={index} className="mx-4">
              <Link
                href={link.href}
                className="inline-flex items-center px-1 pt-1 text-lg font-medium text-gray-300 hover:text-white"
              >
                {link.name}
              </Link>
            </div>
          ))}
        </div>
        <LogOutButton />
      </div>
    </nav>
  );
};

export default OrganizerNavBar;
