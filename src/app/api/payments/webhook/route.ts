// app/api/payments/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    // 1. Get the raw request body and the signature from the headers
    const body = await request.text();
    const signature = (await headers()).get("x-paystack-signature");

    // 2. Verify the event is genuinely from Paystack
    const hash = crypto
      .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
      .update(body, "utf-8")
      .digest("hex");

    if (signature !== hash) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Parse the event data
    const event = JSON.parse(body);
    const { event: eventType, data } = event;

    // 4. Process only successful charge events
    if (eventType === "charge.success") {
      const donationId = data.metadata?.donation_id;
      if (!donationId) {
        console.error("Donation ID not found in webhook metadata");
        return NextResponse.json({ message: "OK" }, { status: 200 });
      }

      // 5. Update the donation status in your database
      const { error } = await supabaseAdmin
        .from("donations")
        .update({ status: "completed" })
        .eq("id", donationId);

      if (error) {
        console.error("Failed to update donation status from webhook:", error);
      }
    }

    // 6. Always acknowledge receipt of the webhook
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}