import React from "react";
import { Metadata } from "next";
import LogOutButton from "@/components/LogOutButton";

export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Attendee Dashboard for Scrapyard Hyderabad Bank",
};

const AttendeeDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="text-4xl font-bold text-blue-600">Attendee Dashboard</div>
      <p className="text-lg text-gray-600 mt-4">
        Welcome to your dashboard, Attendee!
      </p>
      <p className="text-lg text-gray-600 mt-2">
        This Page is Under Construction.
      </p>
      <LogOutButton />
    </div>
  );
};

export default AttendeeDashboard;
