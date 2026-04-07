import Link from "next/link";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <>
      <ContactStyles />

      {/* ── Legacy page header ─────────────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
             
                <nav className="wow fadeInUp" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero strip ─────────────────────────────────────────────── */}
      <section className="ct-hero">
        <div className="ct-hero-bg" aria-hidden="true">
          <div className="ct-orb-a" />
          <div className="ct-orb-b" />
          <div className="ct-grid" />
        </div>
        <div className="ct-hero-inner">
          <span className="ct-eyebrow">✦ Get In Touch ✦</span>
          <h2 className="ct-hero-title">
            We'd Love to<br />
            <em>Hear from You</em>
          </h2>
          <p className="ct-hero-sub">
            Whether you're new, planning a visit, or seeking prayer and support — our doors and inboxes are always open.
          </p>
        </div>
      </section>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <main className="ct-main">

        {/* Left — contact info ─────────────────────────────────────── */}
        <aside className="ct-info-panel ct-anim-1">
          <div className="ct-panel-head">
            <span className="ct-eyebrow-sm">Contact Information</span>
            <h3>Let's Start a Conversation</h3>
            <p>We respond to every message. Our team is here to help you connect with our church community.</p>
          </div>

          <div className="ct-info-cards">
            {[
              {
                icon: '📞',
                label: 'Call Us',
                value: '(+01) 789 859 654',
                sub: 'Mon – Sat, 9am – 6pm',
                color: '#2C3E50',
              },
              {
                icon: '✉',
                label: 'Email Us',
                value: 'edjayden2@gmail.com',
                sub: 'We reply within 24 hours',
                color: '#8C6A4F',
              },
              {
                icon: '📍',
                label: 'Visit Us',
                value: 'Lakeside Estate, Com. 6',
                sub: 'Sunday services at 9am & 11am',
                color: '#C9A66B',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="ct-info-card"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                <div
                  className="ct-info-icon"
                  style={{ background: `${item.color}12`, border: `1.5px solid ${item.color}22` }}
                >
                  <span>{item.icon}</span>
                </div>
                <div className="ct-info-content">
                  <div className="ct-info-label" style={{ color: item.color }}>{item.label}</div>
                  <div className="ct-info-value">{item.value}</div>
                  <div className="ct-info-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider with cross */}
          <div className="ct-divider">
            <span />
            <span className="ct-cross">✝</span>
            <span />
          </div>

          {/* Action buttons */}
          <div className="ct-actions">
            <Link href="/services" className="ct-btn ct-btn-outline">
              <span>🗓</span>
              View Service Times
            </Link>
            <Link href="/donation" className="ct-btn ct-btn-solid">
              <span>🙏</span>
              Donate Now
            </Link>
          </div>

          {/* Social strip */}
          <div className="ct-social">
            <span className="ct-social-label">Follow us</span>
            {['Facebook', 'Instagram', 'YouTube'].map(s => (
              <a key={s} href="#" className="ct-social-chip">{s}</a>
            ))}
          </div>

          {/* Decorative card bottom art */}
          <div className="ct-panel-art" aria-hidden="true">
            <div className="ct-art-cross">✝</div>
          </div>
        </aside>

        {/* Right — form ────────────────────────────────────────────── */}
        <div className="ct-form-panel ct-anim-2">
          <div className="ct-panel-head">
            <span className="ct-eyebrow-sm">Send a Message</span>
            <h3>We'll Respond Soon</h3>
            <p>Fill out the form below and a member of our team will get back to you as soon as possible.</p>
          </div>

          <ContactForm />
        </div>

      </main>

      {/* ── Map / location banner ───────────────────────────────────── */}
      <section className="ct-location">
        <div className="ct-location-inner">
          <div className="ct-location-text">
            <span className="ct-eyebrow-sm">Find Us</span>
            <h3>Come Worship With Us</h3>
            <p>
              We meet every Sunday at Lakeside Estate, Community 6. All are welcome — bring your family, bring your questions, bring your heart.
            </p>
            <div className="ct-service-times">
              {[
                { day: 'Sunday', time: '9:00 AM · First Service' },
                { day: 'Sunday', time: '11:00 AM · Second Service' },
                { day: 'Wednesday', time: '7:00 PM · Midweek Service' },
              ].map((s, i) => (
                <div key={i} className="ct-service-row">
                  <span className="ct-service-day">{s.day}</span>
                  <span className="ct-service-time">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ct-location-map">
            <div className="ct-map-placeholder">
              <span>Lakeside Estate, Com. 6</span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-map-link"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

      .ct-hero, .ct-main, .ct-location {
        font-family: 'DM Sans', sans-serif;
        --pri: #2C3E50;
        --sec: #8C6A4F;
        --acc: #C9A66B;
        --bg:  #F7F6F3;
        --surface: #FFFFFF;
        --text: #1F2937;
        --muted: #6B7280;
      }

      /* ── Keyframes ──────────────────────────────────────────────── */
      @keyframes ct-up   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
      @keyframes ct-rgt  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
      @keyframes ct-card { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes ct-aur  { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.4);opacity:.8} }
      @keyframes ct-aur2 { 0%,100%{transform:scale(1.1);opacity:.35} 50%{transform:scale(.8);opacity:.6} }
      @keyframes ct-bar  { 0%{background-position:0 50%} 100%{background-position:200% 50%} }
      @keyframes ct-spin { to{transform:rotate(360deg)} }

      .ct-anim-1 { animation: ct-up  0.9s cubic-bezier(.16,1,.3,1) 0.1s both; }
      .ct-anim-2 { animation: ct-rgt 0.9s cubic-bezier(.16,1,.3,1) 0.25s both; }
      .ct-info-card { animation: ct-card 0.7s cubic-bezier(.16,1,.3,1) both; }

      /* ── Shared tokens ──────────────────────────────────────────── */
      .ct-eyebrow {
        display: inline-block; font-size: 0.62rem; font-weight: 800;
        letter-spacing: 0.22em; text-transform: uppercase; color: var(--sec);
      }
      .ct-eyebrow-sm {
        display: block; font-size: 0.6rem; font-weight: 800;
        letter-spacing: 0.2em; text-transform: uppercase; color: var(--sec);
        margin-bottom: 0.5rem;
      }

      /* ── Hero strip ─────────────────────────────────────────────── */
      .ct-hero {
        position: relative; overflow: hidden;
        background: linear-gradient(150deg, #06101C 0%, #0D1B2A 60%, #0A1520 100%);
        padding: 5rem 1.5rem 4rem;
        text-align: center;
      }
      .ct-hero-bg { position: absolute; inset: 0; pointer-events: none; }
      .ct-orb-a {
        position: absolute; border-radius: 50%; filter: blur(70px);
        width: 50vw; height: 50vw; top:-15%; left:-5%;
        background: radial-gradient(circle, rgba(44,62,80,0.55) 0%, transparent 70%);
        animation: ct-aur 22s ease-in-out infinite;
      }
      .ct-orb-b {
        position: absolute; border-radius: 50%; filter: blur(60px);
        width: 40vw; height: 40vw; bottom:-15%; right:-5%;
        background: radial-gradient(circle, rgba(140,106,79,0.35) 0%, transparent 70%);
        animation: ct-aur2 28s ease-in-out infinite;
      }
      .ct-grid {
        position: absolute; inset: 0;
        background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 60px 60px;
      }
      .ct-hero-inner { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; animation: ct-up 0.9s cubic-bezier(.16,1,.3,1) 0.05s both; }
      .ct-hero-inner .ct-eyebrow { color: rgba(201,166,107,0.7); margin-bottom: 1rem; display: block; }
      .ct-hero-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(2.8rem, 6vw, 5rem); font-weight: 700;
        line-height: 1.0; letter-spacing: -0.03em; color: #EAE1D6;
        margin: 0.5rem 0 1.25rem;
      }
      .ct-hero-title em { font-style: italic; color: #C9A66B; }
      .ct-hero-sub { font-size: 1.05rem; line-height: 1.7; color: rgba(234,225,214,0.5); max-width: 480px; margin: 0 auto; }

      /* ── Main grid ──────────────────────────────────────────────── */
      .ct-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 1200px; margin: 0 auto;
        padding: 3rem 1.5rem 4rem;
      }
      @media(max-width: 900px) { .ct-main { grid-template-columns: 1fr; } }

      /* ── Shared panel styles ────────────────────────────────────── */
      .ct-info-panel, .ct-form-panel {
        background: white;
        border-radius: 2rem;
        border: 1px solid rgba(44,62,80,0.08);
        box-shadow: 0 24px 64px rgba(44,62,80,0.09);
        padding: 2.5rem;
        position: relative; overflow: hidden;
      }
      @media(min-width:900px) { .ct-info-panel, .ct-form-panel { padding: 3rem; } }

      .ct-panel-head { margin-bottom: 2rem; }
      .ct-panel-head h3 {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700;
        color: var(--pri); line-height: 1.1; letter-spacing: -0.02em;
        margin: 0 0 0.75rem;
      }
      .ct-panel-head p { font-size: 0.9rem; color: var(--muted); line-height: 1.7; }

      /* ── Info cards ─────────────────────────────────────────────── */
      .ct-info-cards { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }

      .ct-info-card {
        display: flex; align-items: flex-start; gap: 1rem;
        padding: 1.25rem 1.5rem;
        border-radius: 1.25rem;
        background: var(--bg);
        border: 1px solid rgba(44,62,80,0.07);
        transition: all 0.3s cubic-bezier(.16,1,.3,1);
      }
      .ct-info-card:hover {
        transform: translateX(6px);
        box-shadow: 0 8px 24px rgba(44,62,80,0.08);
        border-color: rgba(201,166,107,0.2);
      }

      .ct-info-icon {
        width: 48px; height: 48px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem; flex-shrink: 0;
      }
      .ct-info-label {
        font-size: 0.62rem; font-weight: 800; letter-spacing: 0.16em;
        text-transform: uppercase; margin-bottom: 0.2rem;
      }
      .ct-info-value {
        font-size: 0.95rem; font-weight: 700; color: var(--pri); line-height: 1.3;
        font-family: 'Cormorant Garamond', serif; font-size: 1.05rem;
      }
      .ct-info-sub { font-size: 0.72rem; color: var(--muted); margin-top: 0.15rem; }

      /* Divider */
      .ct-divider {
        display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0;
      }
      .ct-divider span:first-child, .ct-divider span:last-child {
        flex: 1; height: 1px; background: rgba(44,62,80,0.1);
      }
      .ct-cross { color: var(--acc); font-size: 1rem; }

      /* Action buttons */
      .ct-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
      .ct-btn {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.7rem 1.4rem; border-radius: 9999px;
        font-size: 0.82rem; font-weight: 700; text-decoration: none;
        transition: all 0.25s cubic-bezier(.16,1,.3,1);
      }
      .ct-btn-outline {
        border: 1.5px solid rgba(44,62,80,0.15);
        color: var(--pri); background: rgba(44,62,80,0.04);
      }
      .ct-btn-outline:hover { background: rgba(44,62,80,0.09); transform: translateY(-2px); }
      .ct-btn-solid {
        background: linear-gradient(135deg, var(--pri), var(--sec));
        color: white; border: none;
        box-shadow: 0 6px 18px rgba(44,62,80,0.25);
      }
      .ct-btn-solid:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(44,62,80,0.3); }

      /* Social */
      .ct-social { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
      .ct-social-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; }
      .ct-social-chip {
        padding: 0.3rem 0.85rem; border-radius: 9999px;
        font-size: 0.72rem; font-weight: 600; color: var(--sec);
        background: rgba(140,106,79,0.08); border: 1px solid rgba(140,106,79,0.18);
        text-decoration: none; transition: all 0.2s;
      }
      .ct-social-chip:hover { background: rgba(140,106,79,0.14); transform: translateY(-1px); }

      /* Panel art */
      .ct-panel-art {
        position: absolute; bottom: -30px; right: -20px; pointer-events: none;
      }
      .ct-art-cross {
        font-size: 8rem; color: var(--acc); opacity: 0.04;
        line-height: 1; user-select: none;
      }

      /* ── Location section ───────────────────────────────────────── */
      .ct-location {
        background: linear-gradient(150deg, #06101C 0%, #0D1B2A 60%, #0A1520 100%);
        padding: 5rem 1.5rem;
        color: white;
      }
      .ct-location-inner {
        max-width: 1200px; margin: 0 auto;
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 3rem; align-items: center;
      }
      @media(max-width:900px) { .ct-location-inner { grid-template-columns: 1fr; } }

      .ct-location-text .ct-eyebrow-sm { color: rgba(201,166,107,0.7); }
      .ct-location-text h3 {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2rem, 4vw, 3rem); font-weight: 700;
        color: #EAE1D6; line-height: 1.1; letter-spacing: -0.02em;
        margin: 0.5rem 0 1rem;
      }
      .ct-location-text p { font-size: 0.95rem; color: rgba(234,225,214,0.5); line-height: 1.7; margin-bottom: 1.75rem; }

      .ct-service-times { display: flex; flex-direction: column; gap: 0.75rem; }
      .ct-service-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 0.9rem 1.25rem; border-radius: 1rem;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(201,166,107,0.12);
      }
      .ct-service-day  { font-size: 0.8rem; font-weight: 700; color: #C9A66B; text-transform: uppercase; letter-spacing: 0.1em; }
      .ct-service-time { font-size: 0.85rem; color: rgba(234,225,214,0.7); }

      .ct-location-map { }
      .ct-map-placeholder {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 0.75rem; padding: 4rem 2rem;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(201,166,107,0.15);
        border-radius: 2rem;
        text-align: center;
        min-height: 280px;
      }
      .ct-map-pin { font-size: 3rem; }
      .ct-map-placeholder span:nth-child(2) { font-size: 1.05rem; color: rgba(234,225,214,0.6); font-weight: 500; }
      .ct-map-link {
        display: inline-block; margin-top: 0.5rem;
        padding: 0.6rem 1.5rem; border-radius: 9999px;
        background: rgba(201,166,107,0.15); border: 1px solid rgba(201,166,107,0.3);
        color: #C9A66B; font-size: 0.82rem; font-weight: 700;
        text-decoration: none; letter-spacing: 0.05em;
        transition: all 0.25s;
      }
      .ct-map-link:hover { background: rgba(201,166,107,0.25); transform: translateY(-2px); }
    `}</style>
  );
}