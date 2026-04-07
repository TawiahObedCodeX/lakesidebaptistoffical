import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  amount: z.number().positive().max(100000),
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().email().max(180),
  note: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { amount, firstName, lastName, email, note } = schema.parse(json);
    const fullName = `${firstName} ${lastName}`.trim();

    const { data: donation, error } = await supabaseAdmin
      .from("donations")
      .insert({
        user_id: null,
        name: fullName,
        email,
        note: note || null,
        amount,
        currency: "GHS",
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !donation) {
      console.error("Donation insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to start donation. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      donationId: donation.id,
    });
  } catch (err: any) {
    console.error("[DONATION_INITIATE] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid input or server error." },
      { status: 400 }
    );
  }
}