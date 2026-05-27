import React from "react";
import { ArrowUpRight, Camera, Mail, MapPin, Phone, Share2, Video } from "lucide-react";

const footerLinks = [
  { label: "Home", target: "home" },
  { label: "Packages", target: "packages" },
  { label: "Portfolio", target: "wedding-stories" },
  { label: "Contact", target: "contact" },
];

const contactItems = [
  { icon: Mail, label: "tkmoments@gmail.com", href: "mailto:tkmoments@gmail.com" },
  { icon: Phone, label: "+91 8200437072", href: "tel:+918200437072" },
  {
    icon: MapPin,
    label: "Bharuch, Gujarat, India",
    href: "https://www.google.com/maps/search/?api=1&query=Bharuch%2C%20Gujarat%2C%20India",
  },
];

const socialLinks = [
  { icon: Camera, label: "Gallery", target: "wedding-stories" },
  { icon: Share2, label: "Packages", target: "packages" },
  { icon: Video, label: "Films", target: "wedding-films" },
];

const MinimalFooter = ({ onNavigate }) => {
  const handleFooterNavigate = (event, target) => {
    event.preventDefault();
    onNavigate?.(target);
  };

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-neutral-200 bg-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-900/30 to-transparent" />
      <div className="absolute -top-24 left-1/2 h-44 w-[min(24rem,90vw)] -translate-x-1/2 rounded-full bg-neutral-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid min-w-0 gap-9 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:items-start">
          <div className="min-w-0 max-w-md sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-neutral-200 bg-neutral-950 text-white shadow-sm">
                <Camera size={20} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-wide text-neutral-950 sm:text-2xl">
                  TK MOMENTS
                </h2>
                <p className="text-sm text-neutral-500">Wedding . Pre-wedding . Events</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-neutral-600">
              Clean frames, warm colors, and timeless stories captured with a calm,
              cinematic eye.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm" aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Explore
            </p>
            {footerLinks.map(({ label, target }) => (
              <a
                key={target}
                href={`#${target}`}
                onClick={(event) => handleFooterNavigate(event, target)}
                className="group flex w-fit items-center gap-2 text-neutral-600 transition hover:text-neutral-950"
              >
                <span className="relative">
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-neutral-950 transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowUpRight
                  size={14}
                  className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
            ))}
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Contact
            </p>
            <div className="mt-4 space-y-3">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex min-w-0 items-center gap-3 text-sm text-neutral-600 transition hover:text-neutral-950"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 break-words">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-neutral-200 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm leading-6 text-neutral-500">
            &copy; 2026 TK MOMENTS - Capturing timeless memories.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map(({ icon: Icon, label, target }) => (
              <a
                key={label}
                href={`#${target}`}
                onClick={(event) => handleFooterNavigate(event, target)}
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white hover:shadow-md"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
