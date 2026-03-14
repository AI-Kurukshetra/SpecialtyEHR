import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth/guards";
import { requireDashboardUser } from "@/services/dashboard";

type ProfilePageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  await requirePermission("dashboard.read");
  const { user, profile, role } = await requireDashboardUser();
  const { message } = await searchParams;

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile View</CardTitle>
          <CardDescription>Your account information and role details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {message && <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">{message}</p>}
          <p>
            <span className="font-semibold">Full name:</span> {profile?.full_name || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {role}
          </p>
          <Link href="/dashboard/profile/edit" className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-muted">
            Edit profile
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
