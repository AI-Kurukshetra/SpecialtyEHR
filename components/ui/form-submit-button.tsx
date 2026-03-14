"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type FormSubmitButtonProps = ButtonProps & {
  idleLabel: string;
  loadingLabel?: string;
};

export function FormSubmitButton({ idleLabel, loadingLabel = "Please wait...", ...props }: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending || props.disabled}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? loadingLabel : idleLabel}
    </Button>
  );
}
