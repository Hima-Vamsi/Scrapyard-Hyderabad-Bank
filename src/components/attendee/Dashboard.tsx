"use client";

import AccountBalance from "@/components/attendee/banking/AccountBalance";
import TransactionsTable from "./banking/TransactionsTable";

const AttendeeDashboard = () => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className=" w-full border-b-2 border-[#303030] pb-2">
        <h1 className="text-5xl font-semibold text-[#e0e6ed]">Financials</h1>
      </div>
      <div className="flex flex-col w-full items-start">
        <AccountBalance />
      </div>
      <h2 className="text-[28px] text-[#e0e6ed] font-semibold">Transactions</h2>
      <TransactionsTable />
    </div>
  );
};

export default AttendeeDashboard;
