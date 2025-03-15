"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Transaction {
  date: string;
  time: string;
  description: string;
  amount: number;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch("/api/public/banking/retrieve-transactions");
      const data = await response.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    }

    fetchTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.max(
    Math.ceil(transactions.length / transactionsPerPage),
    1
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gray-950 text-white p-6">
      <div className="rounded-lg overflow-hidden max-h-screen">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => {
                const isPositive = transaction.amount > 0;
                const dateTime = new Date(
                  `${transaction.date} ${transaction.time}`
                );

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-900/30"
                    } ${isPositive ? "bg-green-950/50" : "bg-red-950/50"}`}
                  >
                    <td className="px-6 py-4 text-sm">
                      {format(dateTime, "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {format(dateTime, "hh:mm a")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {transaction.description}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-right ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {Number(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm">
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
