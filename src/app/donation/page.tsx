import { BodyClass } from "@/components/BodyClass";
import { DonationForm } from "./donation-form";

export default function DonationPage() {
  return (
    <>
      <BodyClass className="donation-page-ui" />
      <style>{`
        .dp-card-glass {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .text-shimmer {
          background: linear-gradient(to right, #C9A66B 20%, #F0D69F 50%, #C9A66B 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
      `}</style>

      <main className="min-h-dvh relative overflow-hidden flex items-center justify-center py-16 px-4" 
            style={{ background: '#0F172A' }}>
        
        {/* Massive Background Aurora Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-brand-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-brand-secondary/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-[540px]">
          {/* Minimalist Header */}
          <div className="text-center mb-12 space-y-3">
            <span className="text-[10px] font-bold tracking-[0.4em] text-brand-accent uppercase">
              Impact the Future
            </span>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white">
              Support our <span className="text-shimmer italic font-serif">Mission</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xs mx-auto font-light leading-relaxed">
              Join us in creating lasting change through your generous contribution.
            </p>
          </div>

          {/* Massive Simple Card */}
          <div className="dp-card-glass rounded-[2.5rem] shadow-2xl p-8 md:p-12 transition-all">
            <DonationForm />
          </div>

          {/* Footer Branding */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-40 grayscale contrast-125">
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">Paystack Secure</span>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">Verified Merchant</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}