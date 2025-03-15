"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = { role: "attendee" | "organizer" };

export default function UnauthorizedComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/public/util/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">🚫 Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>

      {user ? (
        <Link
          href={`/${user.role}/dashboard`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Your Dashboard
        </Link>
      ) : (
        <Link
          href="/"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
