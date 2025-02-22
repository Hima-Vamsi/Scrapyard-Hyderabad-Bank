import { Metadata } from "next";
import CreateUserForm from "@/components/forms/create-user";

export const metadata: Metadata = {
  title: "Create User - SHB",
  description: "User creation for Scrapyard Hyderabad Bank",
};

export default function CreateUser() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen pt-20 p-6">
      <CreateUserForm />
    </div>
  );
}
