/**
 * lib/auth/session.ts
 * ──────────────────────────────────────────────────────────────
 * Session helper. Previously used Supabase. Now it simply returns
 * null (no user auth in this version — the donation flow is
 * public, no login required).
 *
 * When you add member login later, update this to use the
 * Church Backend API's auth endpoints instead of Supabase.
 * ──────────────────────────────────────────────────────────────
 */

type User = {
  id: number;
  email: string;
  name: string;
};

export async function getSessionUser(): Promise<User | null> {
  // No user authentication for the public donation flow.
  // When member login is added, call GET /api/v1/auth/me on the
  // Church Backend API to validate the session.
  return null;
}