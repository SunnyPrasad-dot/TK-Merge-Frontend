import React, { useState } from 'react';

const COUPLE_IMAGE =
  'https://tse4.mm.bing.net/th/id/OIP.IEpYBZOWw-CitrpFOKJIwAHaLH?pid=ImgDet&w=187&h=280&c=7&dpr=1.3&o=7&rm=3';

const QUOTE =
  'Every love story is beautiful, but yours should be unforgettable.';

const LOCATION_QUERY =
  'TK Moments Capture, B-250, 2nd floor, above Burger King, City Centre, near Bharuch Railway Station, Bharuch 392001';

const MAP_COORDS = '21.70320001,72.9970001';

const MAP_SRC =
  `https://maps.google.com/maps?q=${MAP_COORDS}&t=m&z=17&ie=UTF8&iwloc=near&output=embed`;

const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  LOCATION_QUERY
)}`;

const inputCls =
  'w-full rounded-[6px] border border-[#e2d5c6] bg-white/85 px-4 py-3.5 ' +
  'font-jost text-[0.96rem] text-[#201b17] outline-none transition-all duration-300 ' +
  'placeholder:text-[#aa9d91] focus:border-[#b89157] focus:bg-white ' +
  'focus:shadow-[0_0_0_4px_rgba(184,145,87,0.12)]';

const fieldWrapCls = 'flex flex-col gap-2';
const labelCls =
  'text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7f7167]';

const ContectUs = () => {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [mapAddressOpen, setMapAddressOpen] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f3ec] font-jost text-[#211b17]">
      <section className="relative overflow-hidden border-b border-[#e8ded2] bg-[#d5b477]">
        <div className="absolute inset-0">
          <img
            src={COUPLE_IMAGE}
            alt="Luxury wedding couple portrait"
            className="h-full w-full scale-110 object-cover opacity-25 blur-[1px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(213,180,119,0.98)_0%,rgba(213,180,119,0.9)_42%,rgba(213,180,119,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(255,244,222,0.46),transparent_28%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[92vh] max-w-[1440px] grid-cols-[1fr_1.02fr] gap-12 px-6 py-8 lg:px-16 xl:px-20 max-lg:grid-cols-1 max-lg:py-12 max-sm:min-h-0 max-sm:gap-6 max-sm:px-4 max-sm:py-6">
          <div className="flex max-w-[620px] flex-col justify-between gap-12 py-10 text-[#201b17] max-lg:py-0 max-sm:gap-5 max-sm:text-center">
            <div>
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.36em] text-[#6f3d48] max-sm:mb-3 max-sm:text-[0.62rem] max-sm:tracking-[0.28em]">
                {/* TK Moments Capture */}
              </p>
              <h1 className="font-playfair text-[clamp(3rem,7vw,6.7rem)] font-medium leading-[0.96] max-sm:text-[2.55rem]">
                Let us frame your finest day.
              </h1>
              <p className="mt-8 max-w-[520px] text-[1.02rem] font-light leading-8 text-[#4c4038] max-sm:mx-auto max-sm:mt-4 max-sm:max-w-[340px] max-sm:text-[0.92rem] max-sm:leading-6">
                Share the details of your celebration and our studio will help
                shape a refined photography experience around your story,
                venue, rituals, and schedule.
              </p>

              <figure className="mt-10 grid max-w-[590px] grid-cols-[168px_1fr] overflow-hidden border border-[#8f2f4b]/20 bg-white/30 shadow-[0_22px_70px_rgba(90,54,35,0.18)] backdrop-blur max-sm:hidden">
                <div className="relative min-h-[230px] overflow-hidden max-sm:min-h-[280px]">
                  <img
                    src={COUPLE_IMAGE}
                    alt="Elegant couple wedding portrait"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(31,26,22,0.28)_100%)]" />
                </div>
                <figcaption className="flex flex-col justify-between gap-8 p-7">
                  <span className="font-playfair text-[4.5rem] leading-none text-[#8f2f4b]/80">
                    &ldquo;
                  </span>
                  <blockquote className="font-playfair text-[1.65rem] font-medium italic leading-snug text-[#201b17] max-sm:text-[1.45rem]">
                    {QUOTE}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-12 bg-[#8f2f4b]" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#6f3d48]">
                      Studio Note
                    </span>
                  </div>
                </figcaption>
              </figure>
            </div>

            <div className="grid max-w-[590px] grid-cols-3 border-y border-[#8f2f4b]/25 text-center max-sm:mx-auto max-sm:w-full max-sm:max-w-[380px]">
              <div className="px-4 py-5 max-sm:px-2 max-sm:py-3 max-sm:text-center">
                <strong className="block font-playfair text-3xl font-medium text-[#6f3d48] max-sm:text-2xl">
                  500+
                </strong>
                <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.22em] text-[#4c4038] max-sm:text-[0.58rem] max-sm:tracking-[0.16em]">
                  Weddings
                </span>
              </div>
              <div className="border-x border-[#8f2f4b]/25 px-4 py-5 max-sm:px-2 max-sm:py-3 max-sm:text-center">
                <strong className="block font-playfair text-3xl font-medium text-[#6f3d48] max-sm:text-2xl">
                  12
                </strong>
                <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.22em] text-[#4c4038] max-sm:text-[0.58rem] max-sm:tracking-[0.16em]">
                  YEARS
                </span>
              </div>
              <div className="px-4 py-5 max-sm:px-2 max-sm:py-3 max-sm:text-center">
                <strong className="block font-playfair text-3xl font-medium text-[#6f3d48] max-sm:text-2xl">
                  24h
                </strong>
                <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.22em] text-[#4c4038] max-sm:text-[0.58rem] max-sm:tracking-[0.16em]">
                  Reply
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end max-lg:justify-start max-sm:items-start">
            <div className="w-full max-w-[680px] overflow-hidden rounded-[8px] border border-[#eadfce] bg-[#fffaf4]/95 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="h-1.5 bg-[linear-gradient(90deg,#201b17_0%,#b89157_52%,#ead7b7_100%)]" />
              <div className="p-8 md:p-10 xl:p-12 max-sm:p-6">
              <div className="mb-8 flex items-start justify-between gap-6 border-b border-[#e5d9c9] pb-7 max-sm:mb-6 max-sm:flex-col max-sm:items-center max-sm:gap-4 max-sm:pb-5 max-sm:text-center">
                <div className="max-sm:w-full">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#b89157]">
                    Private Enquiry
                  </p>
                  <h2 className="mt-3 font-playfair text-[2.4rem] font-medium leading-tight text-[#201b17] max-sm:text-[2rem]">
                    Begin your booking
                  </h2>
                </div>
                <div className="min-w-[138px] border border-[#d8c4a4] px-4 py-3 text-right max-sm:mx-auto max-sm:text-center">
                  <span className="block text-[0.68rem] uppercase tracking-[0.2em] text-[#8e7f72]">
                    Studio
                  </span>
                  <strong className="mt-1 block font-playfair text-xl font-medium text-[#201b17]">
                    Bharuch
                  </strong>
                </div>
              </div>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#201b17] text-2xl text-[#d5b477]">
                    OK
                  </div>
                  <h3 className="font-playfair text-3xl font-medium text-[#201b17]">
                    Message received
                  </h3>
                  <p className="mx-auto mt-4 max-w-[360px] text-[0.98rem] font-light leading-7 text-[#6f6258]">
                    Thank you for reaching out. Our studio will get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-[8px] border border-[#eadfce] bg-[#fbf4ec] px-5 py-4">
                    <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-center max-sm:text-center">
                      <div className="max-sm:w-full">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#b89157]">
                          Contact Details
                        </p>
                        <p className="mt-2 text-[0.94rem] font-light leading-6 text-[#6f6258]">
                          One contact name is enough. We will use these details
                          to confirm availability and next steps.
                        </p>
                      </div>
                      <div className="shrink-0 rounded-full border border-[#d8c4a4] bg-white px-4 py-2 text-center max-sm:mx-auto">
                        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#8e7f72]">
                          Reply
                        </span>
                        <strong className="block font-playfair text-xl font-medium leading-tight text-[#201b17]">
                          24h
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-sm:grid-cols-1">
                    <div className={fieldWrapCls}>
                      <label htmlFor="cu-first" className={labelCls}>
                        FULL NAME
                      </label>
                      <input
                        id="cu-first"
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div className={fieldWrapCls}>
                      <label htmlFor="cu-email" className={labelCls}>
                        Email
                      </label>
                      <input
                        id="cu-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="youremail@example.com"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div className={fieldWrapCls}>
                      <label htmlFor="cu-phone" className={labelCls}>
                        Phone
                      </label>
                      <input
                        id="cu-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 1234567890"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div className="rounded-[6px] border border-[#e7dacb] bg-white/70 px-4 py-3.5 max-sm:text-center">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#7f7167]">
                        Studio
                      </span>
                      <strong className="mt-2 block font-playfair text-[1.45rem] font-medium leading-none text-[#201b17]">
                        Bharuch
                      </strong>
                      <p className="mt-2 text-[0.78rem] leading-5 text-[#75685e]">
                        Available for weddings, pre-weddings, and events.
                      </p>
                    </div>
                  </div>

                  <div className={fieldWrapCls}>
                    <label htmlFor="cu-msg" className={labelCls}>
                      MESSAGE
                    </label>
                    <textarea
                      id="cu-msg"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="5"
                      required
                      placeholder="Tell us the date, venue, city, guest count, and what you want the film to feel like."
                      className={`${inputCls} min-h-[150px] resize-y leading-7`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-6 rounded-[8px] border border-[#eadfce] bg-[#201b17] p-4 pl-5 text-[#f8f1e8] max-sm:flex-col max-sm:items-center max-sm:p-5 max-sm:text-center">
                    <div className="max-sm:w-full">
                      <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d5b477]">
                        Next Step
                      </span>
                      <p className="mt-1 max-w-[330px] text-[0.86rem] font-light leading-6 text-[#e7dbce] max-sm:mx-auto">
                        We respond with availability, collections, and a
                        consultation time.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="group inline-flex items-center justify-center gap-3 rounded-[6px] bg-[#FFFFFF] px-7 py-4 text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[#000000] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
                    >
                      Send Enquiry
                      <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </button>
                  </div>
                </form>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3ec] px-6 py-20 lg:px-16 xl:px-20">
        <div className="mx-auto grid max-w-[1240px] grid-cols-[0.78fr_1.22fr] gap-10 max-lg:grid-cols-1">
          <div className="flex flex-col justify-between border-l border-[#b89157] pl-7">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#b89157]">
                Find Our Studio
              </p>
              <h2 className="mt-4 font-playfair text-[clamp(2.2rem,4vw,4rem)] font-medium leading-tight text-[#201b17]">
                Visit us in person.
              </h2>
              <p className="mt-5 max-w-[420px] text-[0.98rem] font-light leading-8 text-[#6f6258]">
                B-250, 2nd floor, above Burger King, City Centre, near Bharuch
                Railway Station, Bharuch 392001.
              </p>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-[#4c4038]">
              <div>
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#9a8d84]">
                  Email
                </span>
                <strong className="mt-1 block font-medium">
                  Tanvir786786786@gmail.com
                </strong>
              </div>
              <div>
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#9a8d84]">
                  Phone
                </span>
                <strong className="mt-1 block font-medium">
                  +91 82004 37072
                </strong>
              </div>
              <div>
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#9a8d84]">
                  Contact Person
                </span>
                <strong className="mt-1 block font-medium">
                  Tanveer Khwaja
                </strong>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden border border-[#e2d7ca] bg-white shadow-[0_24px_70px_rgba(58,46,39,0.14)] max-sm:min-h-[340px]">
            <iframe
              title="Studio Location Map"
              src={MAP_SRC}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[420px] w-full border-0 max-sm:min-h-[340px]"
            />

            <a
              href={MAP_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="Open TK Moments Capture address in Google Maps"
              className="absolute left-4 top-4 block w-[315px] max-w-[calc(100%-32px)] border border-[#eadfce] bg-white/95 px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur transition-all duration-300 hover:border-[#b89157] hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-4 focus:ring-[#b89157]/20 max-sm:hidden"
            >
              <h3 className="text-[0.98rem] font-semibold text-[#201b17]">
                TK Moments Capture
              </h3>
              <p className="mt-1.5 text-[0.78rem] leading-5 text-[#6f6258]">
                B-250, 2nd floor, above Burger King, City Centre, near Bharuch
                Railway Station, Bharuch 392001
              </p>
              <span className="mt-3 inline-flex text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#b89157]">
                Open in Google Maps
              </span>
            </a>

            <div className="absolute left-4 top-4 z-10 sm:hidden">
              {mapAddressOpen ? (
                <div className="w-[286px] max-w-[calc(100vw-32px)] border border-[#eadfce] bg-white/96 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[0.9rem] font-semibold text-[#201b17]">
                        TK Moments Capture
                      </h3>
                      <p className="mt-1.5 text-[0.74rem] leading-5 text-[#6f6258]">
                        B-250, 2nd floor, above Burger King, City Centre, near
                        Bharuch Railway Station, Bharuch 392001
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Hide map address"
                      onClick={() => setMapAddressOpen(false)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e2d5c6] text-sm font-semibold text-[#6f6258]"
                    >
                      x
                    </button>
                  </div>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#201b17] px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f8f1e8]"
                  >
                    Open in Google Maps
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Show studio address"
                  onClick={() => setMapAddressOpen(true)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#eadfce] bg-white/95 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#201b17] shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur"
                >
                  Map
                </button>
              )}
            </div>

            <div className="absolute right-4 top-4 flex max-w-[310px] items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur max-sm:top-auto max-sm:bottom-4 max-sm:max-w-[calc(100%-32px)]">
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span className="absolute h-5 w-5 rounded-full bg-[#d92d68]/15" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#d92d68]" />
              </span>
              <div>
                <strong className="block text-[0.9rem] font-semibold text-[#201b17]">
                  Our Studio
                </strong>
                <p className="text-[0.74rem] text-[#8e7f72]">
                  TK Moments Capture, Bharuch
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContectUs;