"use client";

import React, { useEffect, useState } from "react";

const AccountBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/public/banking/check-balance");
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <p className="text-xs uppercase font-semibold text-[#e0e6ed]">
        Account Balance
      </p>
      <div className="flex flex-row space-x-2">
        <p className="text-[#8592a6] text-[25px]">$</p>
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-4 h-4 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            <span className="text-[#e0e6ed]">Loading...</span>
          </div>
        ) : (
          <div className="text-[48px] leading-[57px] text-[#e0e6ed]">
            {balance?.toLocaleString() || "0"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBalance;
