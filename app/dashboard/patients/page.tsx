import Link from "next/link";
import { Search, UserRoundPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requirePermission } from "@/lib/auth/guards";
import { getSearchablePatients } from "@/services/patient-module";

type PatientsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  await requirePermission("patients.read");

  const { q = "" } = await searchParams;
  const patients = await getSearchablePatients(q);

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Patient Management</CardTitle>
              <CardDescription>
                Registration, demographics, insurance, allergies, emergency contacts, and visit tracking.
              </CardDescription>
            </div>
            <Link
              href="/dashboard/patients/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              <UserRoundPlus className="h-4 w-4" />
              New patient
            </Link>
          </div>
          <form className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Search by patient name, email, or phone" className="pl-9" />
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Patient</th>
                <th className="px-2 py-2">Demographics</th>
                <th className="px-2 py-2">Insurance</th>
                <th className="px-2 py-2">Portal</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b last:border-0">
                  <td className="px-2 py-3">
                    <p className="font-medium text-foreground">{patient.fullName}</p>
                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground">
                    <p>{patient.gender || "Not set"}</p>
                    <p>{patient.dateOfBirth}</p>
                  </td>
                  <td className="px-2 py-3 text-xs">
                    <p>{patient.insuranceProvider || "Self pay"}</p>
                    <p className="text-muted-foreground">{patient.insuranceMemberId || "No member ID"}</p>
                  </td>
                  <td className="px-2 py-3 text-xs">{patient.portalEnabled ? "Enabled" : "Disabled"}</td>
                  <td className="px-2 py-3">
                    <Link href={`/dashboard/patients/${patient.id}`} className="font-medium text-primary hover:underline">
                      View profile
                    </Link>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td className="px-2 py-6 text-center text-muted-foreground" colSpan={5}>
                    No patients found for this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
