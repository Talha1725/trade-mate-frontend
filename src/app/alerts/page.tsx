import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";



export default function AlertsPage() {
  return (
    <AppShell>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <PageHeader title="Alerts" />

        {/* page not found */}
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-gray-500">The page you are looking for does not exist.</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700">Go back to the home page</Link>
      </div>
    </AppShell>
  );
}