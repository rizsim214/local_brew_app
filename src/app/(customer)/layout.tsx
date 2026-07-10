import { NavMenu } from "@/src/components/shared/nav-menu";

export default function CustomerLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <NavMenu />
      {children}
    </div>
  );
}
