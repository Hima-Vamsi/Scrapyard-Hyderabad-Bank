"use client";

import React, { useState, useEffect } from "react";
import PickReceiver from "@/components/attendee/banking/PickReceiver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AwardPoints = () => {
    const [receiver, setReceiver] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [organizer, setOrganizer] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch organizer name when component mounts
        const fetchOrganizerName = async () => {
            try {
                const response = await fetch("/api/public/util/user-name");
                const data = await response.json();
                setOrganizer(data.name);
            } catch (error) {
                console.error("Error fetching organizer name:", error);
            }
        };

        fetchOrganizerName();
    }, []);

    const handleReceiverSelect = (email: string) => {
        setReceiver(email);
    };

    const handleNext = () => {
        if (step === 1 && receiver) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/private/award-money", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiverEmail: receiver,
                    amount: parseFloat(amount),
                    reason,
                    organizerName: organizer,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Points awarded successfully");
            } else {
                setError(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error awarding points:", error);
            setError("Internal server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="w-full max-w-sm p-8 border border-gray-500 rounded-xl">
                <div>
                    <h1 className="text-[36px] font-semibold tracking-tight text-[#EC3750] text-center">
                        Award Points
                    </h1>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="receiver_email" className="sr-only">
                                Receiver Email
                            </Label>
                            <PickReceiver onSelect={handleReceiverSelect} />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleNext}
                                disabled={!receiver}
                                className="ml-auto w-full h-auto gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
                                }}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="sr-only">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="Enter amount..."
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                step="1"
                                required
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="sr-only">
                                Reason
                            </Label>
                            <Input
                                id="reason"
                                name="reason"
                                type="text"
                                placeholder="Enter reason..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
                            />
                        </div>
                        <div className="flex justify-between">
                            <Button
                                onClick={handleBack}
                                className="w-full h-auto gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="ml-2 w-full h-auto gap-2 inline-flex items-center justify-center text-white bg-[#338eda] text-[18px] bg-opacity-75 border-0 rounded-[12px] shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(ellipse farthest-corner at top left, #67b3f2, #2190ec)",
                                }}
                            >
                                {loading ? "Processing..." : "Submit"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AwardPoints;