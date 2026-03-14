import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requirePermission } from "@/lib/auth/guards";
import { registerPatient } from "@/app/dashboard/patients/actions";

type NewPatientPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPatientPage({ searchParams }: NewPatientPageProps) {
  await requirePermission("patients.read");
  const { error } = await searchParams;

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Patient Registration</CardTitle>
          <CardDescription>Capture demographics, insurance, medical history, allergies, and emergency contact.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <form action={registerPatient} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required placeholder="Maya Carson" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" name="gender" placeholder="Female" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="+1-555-0101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="maya@example.com" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="addressLine1">Address</Label>
              <Input id="addressLine1" name="addressLine1" placeholder="123 Main St" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="San Francisco" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" placeholder="CA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Zip</Label>
              <Input id="postalCode" name="postalCode" placeholder="94107" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <select
                id="specialty"
                name="specialty"
                defaultValue="dermatology"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="dermatology">Dermatology</option>
                <option value="ophthalmology">Ophthalmology</option>
                <option value="plastic_surgery">Plastic Surgery</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance provider</Label>
              <Input id="insuranceProvider" name="insuranceProvider" placeholder="Blue Cross" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceMemberId">Member ID</Label>
              <Input id="insuranceMemberId" name="insuranceMemberId" placeholder="BC-18922" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceGroupNumber">Group number</Label>
              <Input id="insuranceGroupNumber" name="insuranceGroupNumber" placeholder="GRP-420" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurancePolicyHolder">Policy holder</Label>
              <Input id="insurancePolicyHolder" name="insurancePolicyHolder" placeholder="Maya Carson" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceVerified">Insurance verified</Label>
              <select
                id="insuranceVerified"
                name="insuranceVerified"
                defaultValue="false"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="false">Pending</option>
                <option value="true">Verified</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medicalHistory">Medical history</Label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Eczema, psoriasis, past dermatologic procedures"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allergies">Allergies</Label>
              <textarea
                id="allergies"
                name="allergies"
                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Penicillin, latex, adhesive tape"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency contact name</Label>
              <Input id="emergencyContactName" name="emergencyContactName" placeholder="Evan Carson" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Input id="emergencyContactRelationship" name="emergencyContactRelationship" placeholder="Spouse" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergencyContactPhone">Emergency contact phone</Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" placeholder="+1-555-2010" />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit">Register patient</Button>
              <Button asChild type="button" variant="outline">
                <Link href="/dashboard/patients">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
