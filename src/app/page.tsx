import { SignInForm } from "@/components/auth-forms/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in - SHB",
  description: "Scrapyard Hyderabad Bank Sign in page",
};

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <SignInForm />
    </div>
  );
}
