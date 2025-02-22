import { Metadata } from "next";
import UnauthorizedComponent from "@/components/UnauthorizedComponent";

export const metadata: Metadata = {
  title: "Unauthorized - SHB",
  description: "Unauthorized access page for SHB",
};

export default function UnauthorizedPage() {
  return <UnauthorizedComponent />;
}
