import Link from "next/link";
import { BodyClass } from "@/components/BodyClass";

export default function DonationBankPage() {
  return (
    <>
      <BodyClass className="donation-page-ui" />
      <main className="min-h-dvh relative overflow-hidden py-16 px-4 bg-[#0F172A] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] bg-brand-primary/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] bg-brand-secondary/15 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="text-center mb-12 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.4em] text-brand-accent uppercase">
              Bank Transfer Donation
            </span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white">
              Give by Bank Transfer
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-300 font-light leading-relaxed">
              Use our bank account to make a direct donation. Once your transfer is complete, send us a confirmation receipt so we can credit your gift and say thank you.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-white/95 p-8 md:p-12 shadow-2xl border border-white/20 text-slate-900">
            <div className="space-y-8">
              <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Bank Details
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 border border-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Bank</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">Fidelity Bank Ghana</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 border border-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Account Name</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">Lakeside Baptist Church</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 border border-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Account Number</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">12345678910</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 border border-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Branch</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">Abeka Junction</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">How to complete your gift</h2>
                <ol className="mt-4 space-y-4 text-sm text-slate-700 list-decimal list-inside">
                  <li>Transfer your chosen donation amount using the details above.</li>
                  <li>Use your name or email as the transfer reference.</li>
                  <li>Save the transaction receipt or screenshot.</li>
                  <li>Send the confirmation to our office so we can acknowledge your gift.</li>
                </ol>
                <p className="mt-4 text-sm text-slate-600">
                  If you need exact bank account details, please contact us at <strong>donations@lakeside.org</strong> or call <strong>+233 24 000 0000</strong>.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Need help?</h2>
                <p className="mt-3 text-sm text-slate-700">
                  Our team is ready to assist with bank transfer donations. Please include the transfer date and amount in your message.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <Link
              href="/donation"
              className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-8 py-4 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-slate-900"
            >
              Return to Giving Options
            </Link>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Secure giving through church banking partners.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
