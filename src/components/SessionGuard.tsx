//TODO Remove this line
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = { role: "attendee" | "organizer" };

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/public/util/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);

          if (pathname === "/unauthorized" || pathname === "/") {
            setLoading(false);
            return;
          }

          const allowedPath = `/${data.role}`;
          if (!pathname.startsWith(allowedPath)) {
            router.replace("/unauthorized");
            return;
          }
        } else {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
      </div>
    );

  return <>{children}</>;
}
