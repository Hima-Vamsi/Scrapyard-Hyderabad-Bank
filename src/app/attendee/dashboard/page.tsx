import React from "react";
import { Metadata } from "next";
import AttendeeDashboard from "@/components/attendee/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Attendee Dashboard for Scrapyard Hyderabad Bank",
};

const DashboardPage = () => {
  return <AttendeeDashboard />;
};

export default DashboardPage;
