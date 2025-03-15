import React from "react";
import { Metadata } from "next";
import AwardPoints from "@/components/organizer/forms/AwardMoney";


export const metadata: Metadata = {
  title: "Dashboard - SHB",
  description: "Organizer Dashboard for Scrapyard Hyderabad Bank",
};

const OrganizerDashboard = () => {
  return (
  <div>
    <AwardPoints />
  </div>
  );
};

export default OrganizerDashboard;
