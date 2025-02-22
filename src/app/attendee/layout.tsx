import AttendeeNavBar from "@/components/AttendeeNavBar";

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AttendeeNavBar /> <section>{children}</section>
    </>
  );
}
