"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export function SignOutForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action}>
      <SubmitButton />
    </form>
  );
}
