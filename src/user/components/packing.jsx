


import { useState } from "react";

const BOOKING = {
  id: "AKP-2026-04-8821",
  client: {
    name: "Fghj",
    phone: "+91 99999 99999",
    email: "ab@gmail.com",
    venue: "Sds Dv122",
    notes: "nm,",
  },
  package: "Wedding Photography",
  startTime: "8:00 AM",
  dates: ["Wed, 15 Apr 2026", "Fri, 17 Apr 2026", "Sat, 25 Apr 2026"],
  addons: ["Photo Album Creation", "Drone Coverage"],
  pricing: [
    { label: "Wedding Photography × 3 days", amount: "₹75,000" },
    { label: "Photo Album Creation", amount: "₹3,500" },
    { label: "Drone Coverage", amount: "₹5,000" },
    { label: "GST (18%)", amount: "₹15,030" },
  ],
  total: "₹98,530",
  advance: "₹29,559",
  timeline: [
    { date: "Wednesday, 15 Apr 2026", detail: "8:00 AM · Wedding Photography + Drone Coverage" },
    { date: "Friday, 17 Apr 2026", detail: "8:00 AM · Wedding Photography" },
    { date: "Saturday, 25 Apr 2026", detail: "8:00 AM · Wedding Photography · Photo Album delivery post-edit" },
  ],
};

export default function BookingConfirmation() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(BOOKING.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Booking Confirmation</h1>
          <button
            onClick={handleCopy}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-600 transition-colors"
          >
            <span className="font-mono tracking-wide">{BOOKING.id}</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copied && <span className="text-green-600">Copied!</span>}
          </button>
        </div>

        {/* Step bar */}
        <div className="flex rounded-xl overflow-hidden border border-amber-100 mb-8 text-xs font-medium">
          {["Package", "Details", "Confirm"].map((s) => (
            <div key={s} className="flex-1 py-2.5 text-center bg-amber-400 text-amber-900">
              ✓ {s}
            </div>
          ))}
        </div>

        {/* Success banner */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l5 5 7-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-900">Booking confirmed!</p>
            <p className="text-xs text-green-700 mt-0.5">
              A confirmation email has been sent to <span className="font-medium">{BOOKING.client.email}</span>
            </p>
          </div>
        </div>

        {/* Client details */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 pb-2.5 border-b border-stone-100">
            Client details
          </p>
          {[
            { label: "Name", value: BOOKING.client.name },
            { label: "Phone", value: BOOKING.client.phone },
            { label: "Email", value: BOOKING.client.email },
            { label: "Venue", value: BOOKING.client.venue },
            { label: "Notes", value: BOOKING.client.notes },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start py-2 border-b border-stone-50 last:border-0">
              <span className="text-sm text-stone-400">{label}</span>
              <span className="text-sm font-medium text-stone-800 text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Package & services */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 pb-2.5 border-b border-stone-100">
            Package &amp; services
          </p>
          <div className="flex justify-between items-start py-2 border-b border-stone-50">
            <span className="text-sm text-stone-400">Package</span>
            <span className="text-sm font-medium text-stone-800">{BOOKING.package}</span>
          </div>
          <div className="flex justify-between items-start py-2 border-b border-stone-50">
            <span className="text-sm text-stone-400">Start time</span>
            <span className="text-sm font-medium text-stone-800">{BOOKING.startTime} (each day)</span>
          </div>
          <div className="flex justify-between items-start py-2 border-b border-stone-50">
            <span className="text-sm text-stone-400">Dates</span>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
              {BOOKING.dates.map((d) => (
                <span key={d} className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-start py-2">
            <span className="text-sm text-stone-400">Add-ons</span>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
              {BOOKING.addons.map((a) => (
                <span key={a} className="inline-block bg-stone-100 text-stone-700 text-xs px-3 py-1 rounded-full border border-stone-200">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Event schedule */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 pb-2.5 border-b border-stone-100">
            Event schedule
          </p>
          <div className="flex flex-col">
            {BOOKING.timeline.map((item, i) => (
              <div key={i} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-amber-400 mt-1 shrink-0" />
                  {i < BOOKING.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-stone-100 mt-1" />
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-semibold text-stone-800">{item.date}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 pb-2.5 border-b border-stone-100">
            Payment summary
          </p>
          {BOOKING.pricing.map((row, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-stone-50 last:border-0">
              <span className="text-sm text-stone-500">{row.label}</span>
              <span className="text-sm text-stone-800">{row.amount}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 mt-1 border-t border-stone-200">
            <span className="text-sm font-semibold text-stone-800">Total payable</span>
            <span className="text-xl font-bold text-amber-700">{BOOKING.total}</span>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed mb-5">
          Our team will reach out within 24 hours to confirm the schedule and share payment instructions.
          A 30% advance (<span className="font-semibold">{BOOKING.advance}</span>) is required to secure your dates.
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 font-medium hover:bg-stone-100 transition-colors">
            Modify booking
          </button>
          <button className="flex-1 py-3 rounded-xl bg-amber-400 text-amber-900 text-sm font-semibold hover:bg-amber-500 transition-colors shadow-sm">
            Pay advance {BOOKING.advance} ↗
          </button>
        </div>

      </div>
    </div>
  );
}