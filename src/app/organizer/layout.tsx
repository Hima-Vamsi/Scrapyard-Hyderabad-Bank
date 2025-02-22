import OrganizerNavBar from "@/components/OrganizerNavBar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizerNavBar /> <section>{children}</section>
    </>
  );
}
