"use client";

import { useState, useEffect } from "react";
import SuccessfulTransfer from "@/components/attendee/banking/SuccessfulTransfer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PickReceiver from "@/components/attendee/banking/PickReceiver";

export default function TransferMoney() {
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [error, setError] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);

  useEffect(() => {
    const fetchSenderEmail = async () => {
      try {
        const response = await fetch("/api/public/util/user-email");
        const data = await response.json();
        if (response.ok) {
          setSenderEmail(data.email);
        } else {
          throw new Error(data.error || "Failed to fetch sender email");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch sender email"
        );
      }
    };

    fetchSenderEmail();
  }, []);

  const handleReceiverSelect = (email: string) => {
    setSelectedReceiver(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedReceiver) {
      setError("Please select a receiver");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/public/banking/attendee-transfer-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiver_email: selectedReceiver,
            amount: Number(formData.amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transfer failed");
      }
      setSuccess(true);
      setReceiverEmail(selectedReceiver);
      setFormData({ amount: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  return success ? (
    <SuccessfulTransfer receiver_email={receiverEmail} sender_email={senderEmail} />
  ) : (
    <div className="flex items-center justify-center w-full scale-110">
      <div className="w-full max-w-sm p-8 border border-gray-500 rounded-xl">
        <div>
          <h1 className="text-[36px] font-semibold tracking-tight text-[#EC3750] text-center">
            Transfer Money
          </h1>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiver_email" className="sr-only">
              Receiver Email
            </Label>
            <PickReceiver onSelect={handleReceiverSelect} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="sr-only">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount..."
              value={formData.amount}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              min="1"
              step="1"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="ml-auto w-full h-auto gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
              }}
            >
              {loading ? "Processing..." : "Transfer Money"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
