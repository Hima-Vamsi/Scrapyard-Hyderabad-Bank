import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Attendee Dashboard for Scrapyard Hyderabad Bank",
};

const AttendeeDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 text-center">
      <div className="text-4xl font-bold text-blue-600">Attendee Dashboard</div>
      <p className="text-lg text-gray-600 mt-4">
        Welcome to your dashboard, Attendee!
      </p>
      <p className="text-lg text-gray-600 mt-2">
        This Page is Under Construction.
      </p>
    </div>
  );
};

export default AttendeeDashboard;
