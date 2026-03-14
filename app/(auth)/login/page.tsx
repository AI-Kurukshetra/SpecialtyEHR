import Link from "next/link";
import { signIn } from "./actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Stethoscope } from "lucide-react";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message, next } = await searchParams;

  return (
    <main className="auth-shell">
      <section className="container mx-auto grid min-h-screen items-center gap-6 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <aside className="auth-panel">
          <div className="space-y-4">
            <p className="auth-chip">
              <ShieldCheck className="h-4 w-4" />
              Secure Specialty Access
            </p>
            <h1 className="auth-title text-balance">Sign in to your clinical workspace</h1>
            <p className="auth-subtitle text-balance">
              Access schedules, patient records, imaging workflows, and operational insights in one secure platform.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="auth-feature">
              <Stethoscope className="h-4 w-4 text-primary" />
              Role-based permissions for provider and staff access
            </li>
            <li className="auth-feature">
              <Stethoscope className="h-4 w-4 text-primary" />
              End-to-end encrypted auth and protected session handling
            </li>
            <li className="auth-feature">
              <Stethoscope className="h-4 w-4 text-primary" />
              Designed for dermatology, ophthalmology, and plastic surgery teams
            </li>
          </ul>
        </aside>

        <Card className="auth-card">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <form className="space-y-4">
              <input type="hidden" name="next" value={next?.startsWith("/") ? next : "/dashboard"} />
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
                formAction={signIn}
                className="auth-submit w-full"
                idleLabel="Sign in"
                loadingLabel="Signing in..."
              />
            </form>
            <p className="text-sm text-muted-foreground">
              <Link href="/forgot-password" className="font-semibold text-primary underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create an account
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
