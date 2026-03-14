import Link from "next/link";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requirePermission } from "@/lib/auth/guards";
import { requireDashboardUser } from "@/services/dashboard";
import { updateProfile } from "../actions";

type EditProfilePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EditProfilePage({ searchParams }: EditProfilePageProps) {
  await requirePermission("dashboard.read");
  const { profile, user, role } = await requireDashboardUser();
  const { error } = await searchParams;

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Edit Profile</CardTitle>
          <CardDescription>Update your profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <form action={updateProfile} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={role} readOnly />
            </div>
            <div className="flex items-center gap-2">
              <FormSubmitButton idleLabel="Save changes" loadingLabel="Saving..." />
              <Link href="/dashboard/profile" className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-muted">
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
