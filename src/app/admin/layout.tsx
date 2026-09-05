import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-[var(--color-coffee-dark)] text-[var(--color-ivory)] p-6 flex flex-col gap-6">
        <div className="font-bold text-xl">BUN Admin</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/artists">Artists</Link>
          <Link href="/admin/events">Events</Link>
          <Link href="/admin/messages">Messages</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
