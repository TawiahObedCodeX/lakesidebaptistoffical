import { cookies } from "next/headers";

const KEY = "checkout_donation_id";

export async function getCheckoutDonationId(): Promise<number | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(KEY)?.value;
  if (!value) return null;
  return Number(value);
}

export async function setCheckoutDonationId(id: number) {
  const cookieStore = await cookies();
  cookieStore.set(KEY, String(id), {
    httpOnly: true,
    path: "/",
  });
}

export async function clearCheckoutDonationId() {
  const cookieStore = await cookies();
  cookieStore.delete(KEY);
}