import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requestPasswordReset } from "@/app/(auth)/login/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="auth-shell">
      <section className="container mx-auto flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="auth-card w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <KeyRound className="h-5 w-5 text-primary" />
              Reset your password
            </CardTitle>
            <CardDescription>Enter your work email and we will send a reset link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@clinic.com" />
              </div>
              <FormSubmitButton
                type="submit"
                formAction={requestPasswordReset}
                className="auth-submit w-full"
                idleLabel="Send reset link"
                loadingLabel="Sending..."
              />
            </form>
            <p className="text-sm text-muted-foreground">
              Back to{" "}
              <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
