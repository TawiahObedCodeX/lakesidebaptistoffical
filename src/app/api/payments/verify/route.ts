import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

const schema = z.object({
  reference: z.string().min(1),
});

export async function POST(req: Request) {
  console.log("🔵 Verify API called"); // Debug log

  try {
    const json = await req.json();
    const { reference } = schema.parse(json);
    console.log("Reference:", reference);

    // Call Paystack verification API
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await res.json();
    console.log("Paystack response:", data);

    if (!res.ok || !data.status || data.data.status !== "success") {
      console.error("Paystack verification failed:", data);
      return NextResponse.json(
        { ok: false, error: "Payment not successful or invalid." },
        { status: 400 }
      );
    }

    const donationId = data.data.metadata?.donation_id;
    if (!donationId) {
      return NextResponse.json(
        { ok: false, error: "Donation ID not found in metadata." },
        { status: 400 }
      );
    }

    // Update donation status in Supabase
    const { error: updateError } = await supabaseAdmin
      .from("donations")
      .update({ status: "completed" })
      .eq("id", donationId);

    if (updateError) {
      console.error("Failed to update donation status:", updateError);
      return NextResponse.json(
        { ok: false, error: "Donation recorded but status update failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you! Your donation has been received.",
    });
  } catch (err: any) {
    console.error("[PAYMENTS_VERIFY] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error occurred." },
      { status: 500 }
    );
  }
}