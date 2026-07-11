/**
 * app/(routes)/unsubscribe/page.tsx
 * ──────────────────────────────────────────────────────────────
 * The page users land on when they click the unsubscribe link in
 * a newsletter email. The link looks like:
 *   https://yourchurch.org/unsubscribe?token=abc123...
 *
 * This page extracts the token from the URL, calls the unsubscribe
 * proxy, and shows a confirmation message.
 * ──────────────────────────────────────────────────────────────
 */

import { Suspense } from "react";
import { UnsubscribeContent } from "./unsubscribe-content";

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh flex items-center justify-center bg-neutral-50">
          <p className="text-slate-500">Loading...</p>
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}