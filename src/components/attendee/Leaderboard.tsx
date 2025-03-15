"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import localFont from 'next/font/local'

// Define the type for a leaderboard entry
type LeaderboardEntry = {
    id: number
    rank: number
    name: string
    money: number
    color: string
    show?: boolean 
}

const pixelifySans = localFont({
    src: '../../../public/PixelifySans-Regular.ttf',
    display: 'swap',
})

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                // Fetch user email
                const emailResponse = await fetch("/api/public/util/user-email")
                if (!emailResponse.ok) {
                    throw new Error("Failed to fetch user email")
                }
                const emailData = await emailResponse.json()
                const userEmail = emailData.email

                // Fetch leaderboard data
                const leaderboardResponse = await fetch(`/api/public/util/leaderboard?userEmail=${userEmail}`)
                if (!leaderboardResponse.ok) {
                    throw new Error("Failed to fetch leaderboard data")
                }
                const leaderboardData = await leaderboardResponse.json()

                // Capitalize names
                const capitalizedData = leaderboardData.map((entry: LeaderboardEntry) => ({
                    ...entry,
                    name: entry.name.toUpperCase()
                }))

                setEntries(capitalizedData)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("An unknown error occurred")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboardData()
    }, [])

    const formatMoney = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    if (loading)
        return (
          <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        );

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className={`${pixelifySans.className}`}>

        <div className={`w-full max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg p-1`}>
        <div className="p-4 text-center">
        <h1 className="text-3xl font-bold text-white tracking-wider">LEADERBOARD</h1>
    </div>
            <div className="p-4">
                <div className="grid grid-cols-12 gap-2 mb-2 text-gray-400 text-lg font-bold px-2">
                    <div className="col-span-2">RANK</div>
                    <div className="col-span-7">NAME</div>
                    <div className="col-span-3 text-right">SCORE</div>
                </div>

                <div className="space-y-2">
                    {entries.slice(0, 10).map((entry) => (
                        <div
                            key={entry.id}
                            className="grid grid-cols-12 gap-2 p-2 rounded-md text-white font-bold"
                            style={{ backgroundColor: entry.color + "33" }} // Adding transparency
                        >
                            <div className="col-span-2 flex items-center">
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                    style={{ backgroundColor: entry.color }}
                                >
                                    {entry.rank}
                                </span>
                            </div>
                            <div className="col-span-7 flex items-center">{entry.name}</div>
                            <div className="col-span-3 flex items-center justify-end">${formatMoney(entry.money)}</div>
                        </div>
                    ))}
                </div>

                <div className="text-center my-2 text-gray-400 text-2xl">...</div>

                <div className="flex justify-center mb-2">
                    <button
                        onClick={() => {
                            setEntries(entries.map((entry) => (entry.id === 11 ? { ...entry, show: !entry.show } : entry)))
                        }}
                        className="px-4 py-1 bg-gray-700 text-white rounded-md text-lg hover:bg-gray-600 transition-colors"
                    >
                        {entries[10].show ? "Hide Your Rank" : "Show Your Rank"}
                    </button>
                </div>

                {entries[10].show && (
                    <div
                        className={cn(
                            "grid grid-cols-12 gap-2 p-2 rounded-md text-green-700 font-bold transition-all duration-300"
                        )}
                        style={{ backgroundColor: entries[10].color + "33" }}
                    >
                        <div className="col-span-2 flex items-center">
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                                style={{ backgroundColor: entries[10].color }}
                            >
                                {entries[10].rank}
                            </span>
                        </div>
                        <div className="col-span-7 flex items-center">{entries[10].name}</div>
                        <div className="col-span-3 flex items-center justify-end">${formatMoney(entries[10].money)}</div>
                    </div>
                )}
            </div>
        </div>
        </div>
    )
}