import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { signUp } from "../login/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="auth-shell">
      <section className="container mx-auto grid min-h-screen items-center gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <aside className="auth-panel">
          <div className="space-y-4">
            <p className="auth-chip">
              <ShieldCheck className="h-4 w-4" />
              Modern Specialty EHR
            </p>
            <h1 className="auth-title text-balance">Create your practice account</h1>
            <p className="auth-subtitle text-balance">
              Start with a secure foundation for appointments, documentation, imaging, and patient communications.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="auth-feature">
              <Sparkles className="h-4 w-4 text-primary" />
              Built for specialty-specific templates and workflows
            </li>
            <li className="auth-feature">
              <Sparkles className="h-4 w-4 text-primary" />
              Faster onboarding with cloud-native practice setup
            </li>
            <li className="auth-feature">
              <Sparkles className="h-4 w-4 text-primary" />
              Expand from MVP to advanced AI and analytics modules
            </li>
          </ul>
        </aside>

        <Card className="auth-card">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Create account</CardTitle>
            <CardDescription>Use your work email to start onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" type="text" required placeholder="Dr. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue="receptionist"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@clinic.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters" />
              </div>
              <FormSubmitButton
                type="submit"
                formAction={signUp}
                className="auth-submit w-full"
                idleLabel="Create account"
                loadingLabel="Creating account..."
              />
            </form>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Back to{" "}
              <Link href="/" className="text-primary underline-offset-4 hover:underline">
                home
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
