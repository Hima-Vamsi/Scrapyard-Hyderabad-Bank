"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/forms/sign-in";

type User = { role: "attendee" | "organizer" };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });

        if (res.ok) {
          const data: User = await res.json();
          router.replace(`/${data.role}/dashboard`);
          return;
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <SignInForm />
    </div>
  );
}
