import React from "react";
import { Metadata } from "next";
import LogOutButton from "@/components/LogOutButton";

export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Organizer Dashboard for Scrapyard Hyderabad Bank",
};

const OrganizerDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="text-4xl font-bold text-blue-600">
        Organizer Dashboard
      </div>
      <p className="text-lg text-gray-600 mt-4">Welcome back, Organizer!</p>
      <p className="text-lg text-gray-600 mt-2">
        This Page is Under Construction.
      </p>
      <LogOutButton />
    </div>
  );
};

export default OrganizerDashboard;
