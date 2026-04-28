"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export type IntakeState = {
  status: "idle" | "ok" | "error";
  message: string;
};

export async function submitIntake(
  _prev: IntakeState,
  formData: FormData,
): Promise<IntakeState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const currentStack = String(formData.get("current_stack") ?? "").trim() || null;
  const missionBrief = String(formData.get("mission_brief") ?? "").trim();

  if (!name || !email || !missionBrief) {
    return {
      status: "error",
      message:
        "Name, email, and a sentence about what you want AI to do for your business are required.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const h = await headers();
  const userAgent = h.get("user-agent") ?? null;

  const { error } = await supabase.from("jflyai_intake").insert({
    name,
    email,
    company,
    current_stack: currentStack,
    mission_brief: missionBrief,
    user_agent: userAgent,
  });

  if (error) {
    console.error("intake insert error", error);
    return {
      status: "error",
      message: "Submission failed. Try again, or email hello@jfly.ai directly.",
    };
  }

  return {
    status: "ok",
    message: "I'll be in touch within 1 business day to set up the call.",
  };
}
