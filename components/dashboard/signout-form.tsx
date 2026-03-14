"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitButton({ compact }: { compact?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={compact ? "secondary" : "outline"} size={compact ? "sm" : "default"} className={compact ? "w-full" : ""} disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export function SignOutForm({ action, compact }: { action: (formData: FormData) => void | Promise<void>; compact?: boolean }) {
  return (
    <form action={action}>
      <SubmitButton compact={compact} />
    </form>
  );
}
