import { Metadata } from "next";
import CreateUserForm from "@/components/forms/create-user";

export const metadata: Metadata = {
  title: "Create User - SHB",
  description: "User creation for Scrapyard Hyderabad Bank",
};

export default function CreateUser() {
  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <CreateUserForm />
    </div>
  );
}
