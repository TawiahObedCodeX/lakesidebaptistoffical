import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const schema = z.object({
  donationId: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { donationId } = schema.parse(json);

    const { data: donation, error: fetchError } = await supabaseAdmin
      .from("donations")
      .select("id, amount, email, name")
      .eq("id", donationId)
      .single();

    if (fetchError || !donation) {
      console.error("Donation fetch error:", fetchError);
      return NextResponse.json(
        { ok: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    if (donation.amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const reference = `don_${donation.id}_${Date.now()}`;
    const baseUrl = env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const payload = {
      email: donation.email,
      amount: Math.round(donation.amount * 100),
      currency: "GHS",
      reference,
      metadata: {
        donation_id: donation.id,
        donor_name: donation.name,
      },
      callback_url: `${baseUrl}/thank-you?ref=${reference}`,
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      console.error("Paystack initialize failed:", data);
      return NextResponse.json(
        { ok: false, error: data.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("donations")
      .update({ status: "processing" })
      .eq("id", donation.id);

    return NextResponse.json({
      ok: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err: any) {
    console.error("[PAYMENTS_INITIALIZE] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}