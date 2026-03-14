"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) {
    redirect("/dashboard/profile/edit?error=Full name is required");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Please sign in");
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) {
    redirect(`/dashboard/profile/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/profile?message=Profile updated");
}
