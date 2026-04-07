import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCheckoutDonationId,
  clearCheckoutDonationId,
} from "@/lib/checkout";
import { env } from "@/lib/env";
import { PaymentClient } from "./payment-client";

export default async function PaymentPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/payment")}`);
  }

  const donationId = await getCheckoutDonationId();

  if (!donationId) {
    redirect("/donation");
  }

  const { data: donation, error } = await supabaseAdmin
    .from("donations")
    .select("id, user_id, name, email, note, amount, currency, status")
    .eq("id", donationId)
    .single();

  if (error || !donation) {
    await clearCheckoutDonationId();
    redirect("/donation");
  }

  if (
    donation.status !== "pending" ||
    (donation.user_id &&
      Number(donation.user_id) !== Number(user.id))
  ) {
    await clearCheckoutDonationId();
    redirect("/donation");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50/40">
      <main className="w-full max-w-3xl px-5 py-10 md:py-14">
        <PaymentClient
          donationId={donation.id}
          donation={{
            amount: Number(donation.amount),
            currency: donation.currency || "GHS",
            name: donation.name || "",
            email: donation.email || "",
            note: donation.note ?? "",
          }}
          paystackPublicKey={env.PAYSTACK_PUBLIC_KEY || ""}
          userEmail={user.email}
          userName={user.name}
        />
      </main>
    </div>
  );
}