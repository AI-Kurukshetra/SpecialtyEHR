"use client";

import Link from "next/link";
import { CircleUserRound, UserRound, UserRoundPen } from "lucide-react";
import { SignOutForm } from "@/components/dashboard/signout-form";

export function ProfileMenu({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center justify-center rounded-full border bg-white px-3 py-2 text-foreground hover:bg-muted [&::-webkit-details-marker]:hidden">
        <CircleUserRound className="h-6 w-6" />
      </summary>
      <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border bg-white p-2 shadow-lg">
        <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
          <UserRound className="h-4 w-4" />
          Profile view
        </Link>
        <Link href="/dashboard/profile/edit" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
          <UserRoundPen className="h-4 w-4" />
          Edit profile
        </Link>
        <div className="mt-1 border-t pt-2">
          <SignOutForm action={action} compact />
        </div>
      </div>
    </details>
  );
}
