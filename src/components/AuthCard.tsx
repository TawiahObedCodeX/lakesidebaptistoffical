import Image from "next/image";

export function AuthCardVisual(props: { title: string; subtitle: string }) {
  return (
    <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(44,62,80,0.92),rgba(44,62,80,0.62)),url('/images/join-worship-img-1.jpg')] bg-cover bg-center shadow-[0_28px_70px_rgba(15,23,42,0.16)] lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_85%_15%,rgba(201,166,107,0.18),transparent_60%)]" />

      <div className="relative z-10 pt-8">
        <Image
          src="/images/church_logo_blue-removebg-preview%20(1).png"
          alt="Welcome"
          width={520}
          height={520}
          className="mx-auto w-[72%] max-w-[320px] opacity-90 drop-shadow-[0_18px_26px_rgba(0,0,0,0.22)]"
          priority
        />
      </div>

      <div className="relative z-10 px-7 pb-7">
        <h3 className="text-xl font-extrabold tracking-tight text-white">{props.title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/75">{props.subtitle}</p>
      </div>
    </div>
  );
}

