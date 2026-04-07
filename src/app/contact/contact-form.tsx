"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";

/**
 * Contact form UI — backend integration preserved.
 * Posts to `/api/contact`.
 */
export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ── Backend (untouched) ──────────────────────────────────────── */
  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName  = String(formData.get("lastName")  ?? "").trim();
    const email     = String(formData.get("email")     ?? "").trim();
    const phone     = String(formData.get("phone")     ?? "").trim();
    const message   = String(formData.get("message")   ?? "").trim();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, message }),
    });

    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data?.ok) {
      setLoading(false);
      setError(data?.error || "We could not send your message right now. Please try again.");
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

  /* ── Success state ────────────────────────────────────────────── */
  if (success) {
    return (
      <>
        <CfStyles />
        <div className="cf-success">
          <div className="cf-success-icon">
            <span>✓</span>
          </div>
          <h4>Message Sent!</h4>
          <p>Thanks for reaching out. We'll respond to your message within 24 hours.</p>
          <button
            onClick={() => setSuccess(false)}
            className="cf-success-back"
          >
            Send Another Message
          </button>
        </div>
      </>
    );
  }

  /* ── Form ─────────────────────────────────────────────────────── */
  return (
    <>
      <CfStyles />
      <form action={onSubmit} className="cf-form" noValidate>
        {error   && <Alert kind="error">{error}</Alert>}

        {/* Name row */}
        <div className="cf-row">
          <FloatField name="firstName" label="First name"    type="text"  required />
          <FloatField name="lastName"  label="Last name"     type="text"  required />
        </div>

        <FloatField name="email"   label="Email address"   type="email"  required />
        <FloatField name="phone"   label="Phone (optional)" type="tel"   inputMode="tel" />
        <FloatArea  name="message" label="Your message"     required minLength={10} rows={5} />

        <p className="cf-hint">Please include enough detail so we can respond effectively.</p>

        <button
          type="submit"
          disabled={loading}
          className={`cf-submit${loading ? ' cf-submit-loading' : ''}`}
        >
          {loading ? (
            <span className="cf-submit-inner">
              <span className="cf-spinner" />
              Sending…
            </span>
          ) : (
            <span className="cf-submit-inner">
              <span>Send Message</span>
              <span className="cf-submit-arrow">→</span>
            </span>
          )}
        </button>
      </form>
    </>
  );
}

/* ─── Floating-label input ───────────────────────────────────────────────── */
interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  inputMode?: "tel" | "email" | "text";
}

function FloatField({ name, label, type = "text", required, inputMode }: FieldProps) {
  const [filled, setFilled] = useState(false);
  return (
    <div className={`cf-field${filled ? ' cf-filled' : ''}`}>
      <input
        name={name}
        id={`cf-${name}`}
        type={type}
        required={required}
        inputMode={inputMode}
        placeholder=" "
        onChange={e => setFilled(e.target.value.length > 0)}
        className="cf-input"
        aria-label={label}
      />
      <label htmlFor={`cf-${name}`} className="cf-label">{label}</label>
      <span className="cf-focus-bar" />
    </div>
  );
}

interface AreaProps {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  rows?: number;
}

function FloatArea({ name, label, required, minLength, rows = 5 }: AreaProps) {
  const [filled, setFilled] = useState(false);
  return (
    <div className={`cf-field cf-field-area${filled ? ' cf-filled' : ''}`}>
      <textarea
        name={name}
        id={`cf-${name}`}
        required={required}
        minLength={minLength}
        rows={rows}
        placeholder=" "
        onChange={e => setFilled(e.target.value.length > 0)}
        className="cf-input cf-textarea"
        aria-label={label}
      />
      <label htmlFor={`cf-${name}`} className="cf-label">{label}</label>
      <span className="cf-focus-bar" />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
function CfStyles() {
  return (
    <style>{`
      @keyframes cf-in    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cf-spin  { to{transform:rotate(360deg)} }
      @keyframes cf-bar   { 0%{background-position:0 50%} 100%{background-position:200% 50%} }
      @keyframes cf-check { from{transform:scale(0);opacity:0} 60%{transform:scale(1.15)} to{transform:scale(1);opacity:1} }
      @keyframes cf-slide { from{opacity:0;transform:translateY(24px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }

      .cf-form { display:flex; flex-direction:column; gap:1.1rem; }
      .cf-row  { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
      @media(max-width:480px) { .cf-row { grid-template-columns:1fr; } }

      /* ── Floating label field ─────────────────────────────────── */
      .cf-field {
        position: relative;
        animation: cf-in 0.5s cubic-bezier(.16,1,.3,1) both;
      }

      .cf-input {
        width: 100%;
        padding: 1.25rem 1.1rem 0.55rem;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem; font-weight: 500;
        color: #1F2937;
        background: #F7F6F3;
        border: 1.5px solid rgba(44,62,80,0.12);
        border-radius: 1rem;
        outline: none;
        transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        resize: none;
        box-sizing: border-box;
        -webkit-appearance: none;
      }
      .cf-textarea { padding-top: 1.4rem; }

      .cf-label {
        position: absolute;
        left: 1.1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.875rem;
        font-weight: 500;
        color: #9CA3AF;
        pointer-events: none;
        transition: all 0.22s cubic-bezier(.16,1,.3,1);
        white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
      }
      .cf-field-area .cf-label { top: 1.3rem; transform: none; }

      /* Float label on focus or when filled */
      .cf-input:focus ~ .cf-label,
      .cf-input:not(:placeholder-shown) ~ .cf-label,
      .cf-filled .cf-label {
        top: 0.55rem;
        transform: none;
        font-size: 0.6rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8C6A4F;
      }
      .cf-field-area .cf-input:focus ~ .cf-label,
      .cf-field-area .cf-input:not(:placeholder-shown) ~ .cf-label {
        top: 0.55rem;
      }

      .cf-input:focus {
        background: white;
        border-color: rgba(140,106,79,0.5);
        box-shadow: 0 0 0 4px rgba(140,106,79,0.08);
      }
      .cf-input:focus ~ .cf-focus-bar { transform: scaleX(1); }

      .cf-focus-bar {
        position: absolute; bottom: 0; left: 1rem; right: 1rem;
        height: 2px; border-radius: 1px;
        background: linear-gradient(90deg, #2C3E50, #8C6A4F, #C9A66B);
        background-size: 200% auto;
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(.16,1,.3,1);
        animation: cf-bar 3s linear infinite;
        pointer-events: none;
      }

      .cf-hint { font-size: 0.75rem; color: #9CA3AF; margin: 0; }

      /* ── Submit button ────────────────────────────────────────── */
      .cf-submit {
        position: relative; overflow: hidden;
        width: 100%; padding: 1rem;
        border-radius: 1rem; border: none; cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem; font-weight: 800;
        color: white; letter-spacing: 0.04em;
        background: linear-gradient(135deg, #2C3E50 0%, #8C6A4F 100%);
        box-shadow: 0 8px 24px rgba(44,62,80,0.25);
        transition: all 0.3s cubic-bezier(.16,1,.3,1);
        margin-top: 0.25rem;
      }
      .cf-submit:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(44,62,80,0.32);
      }
      .cf-submit:active:not(:disabled) { transform: translateY(0); }
      .cf-submit:disabled { opacity: 0.7; cursor: not-allowed; }
      .cf-submit-inner { display:flex; align-items:center; justify-content:center; gap:0.6rem; }
      .cf-submit-arrow { font-size: 1.1rem; transition: transform 0.25s; }
      .cf-submit:hover .cf-submit-arrow { transform: translateX(3px); }

      .cf-spinner {
        display: inline-block; width: 16px; height: 16px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25); border-top-color: white;
        animation: cf-spin 0.8s linear infinite;
        flex-shrink: 0;
      }

      /* ── Shimmer ripple on submit button ─────────────────────── */
      .cf-submit::before {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
        background-size: 200% 100%;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .cf-submit:hover::before { opacity: 1; animation: cf-bar 1.5s linear infinite; }

      /* ── Success state ────────────────────────────────────────── */
      .cf-success {
        display: flex; flex-direction: column; align-items: center;
        text-align: center; padding: 2.5rem 1rem;
        animation: cf-slide 0.7s cubic-bezier(.16,1,.3,1) both;
      }
      .cf-success-icon {
        width: 72px; height: 72px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 1.25rem;
        background: linear-gradient(135deg, #e6f9f0, #d0f5e4);
        border: 3px solid rgba(16,185,129,0.25);
        font-size: 1.8rem; font-weight: 800; color: #157347;
        animation: cf-check 0.6s cubic-bezier(.16,1,.3,1) 0.1s both;
      }
      .cf-success h4 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.8rem; font-weight: 700; color: #2C3E50; margin: 0 0 0.5rem;
      }
      .cf-success p  { font-size: 0.9rem; color: #6B7280; line-height: 1.6; margin: 0 0 1.5rem; }
      .cf-success-back {
        padding: 0.7rem 1.75rem; border-radius: 9999px;
        background: rgba(44,62,80,0.06); border: 1.5px solid rgba(44,62,80,0.14);
        font-size: 0.82rem; font-weight: 700; color: #2C3E50; cursor: pointer;
        transition: all 0.2s;
        font-family: 'DM Sans', sans-serif;
      }
      .cf-success-back:hover { background: rgba(44,62,80,0.1); }
    `}</style>
  );
}