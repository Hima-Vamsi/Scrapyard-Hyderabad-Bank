import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Organizer Dashboard for Scrapyard Hyderabad Bank",
};

const OrganizerDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 text-center">
      <div className="text-4xl font-bold text-blue-600">
        Organizer Dashboard
      </div>
      <p className="text-lg text-gray-600 mt-4">Welcome back, Organizer!</p>
      <p className="text-lg text-gray-600 mt-2">
        This Page is Under Construction.
      </p>
    </div>
  );
};

export default OrganizerDashboard;
