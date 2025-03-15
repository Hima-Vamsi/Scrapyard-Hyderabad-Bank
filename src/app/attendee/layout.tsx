"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/attendee/NavBar";
import MobileNavBar from "@/components/attendee/MobileNavBar";

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 730);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className={`flex h-screen max-w-[1350px] w-full lg:mt-6 ${
          isMobile ? "pb-16" : ""
        }`}
      >
        {!isMobile && (
          <div className="w-64">
            <Sidebar />
          </div>
        )}
        {isMobile && <MobileNavBar />}
        <section className="flex-1 p-4 overflow-auto">{children}</section>
      </div>
    </div>
  );
}
