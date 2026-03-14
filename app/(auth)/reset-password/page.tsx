import Link from "next/link";
import { updatePassword } from "@/app/(auth)/login/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="auth-shell">
      <section className="container mx-auto flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="auth-card w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Set a new password</CardTitle>
            <CardDescription>Use a strong password with at least 6 characters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <Input id="confirm_password" name="confirm_password" type="password" required minLength={6} />
              </div>
              <FormSubmitButton
                type="submit"
                formAction={updatePassword}
                className="auth-submit w-full"
                idleLabel="Update password"
                loadingLabel="Updating..."
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
