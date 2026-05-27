

const Hero = ({ onBuildPackage }) => {
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/tk-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pt-20 text-center text-white sm:items-start sm:px-10 sm:text-left lg:px-20 xl:px-28">
        
        <h1 className="mb-4 max-w-full font-['Birthstone',cursive] text-5xl font-normal tracking-normal text-[#fff7e8] sm:text-7xl md:text-8xl">
          TK Moments
        </h1>

        <p className="mb-6 max-w-[22rem] text-base font-light sm:text-lg md:max-w-none md:text-xl">
          Stories of Love & Joy of Weddings
        </p>

        <div className="flex flex-col items-center gap-3 sm:items-start">
          <a
            href="#contact"
            className="inline-flex w-56 justify-center rounded-full border border-white px-6 py-3 text-sm tracking-wide transition hover:bg-white hover:text-black"
          >
            Get in Touch
          </a>

          <button
            type="button"
            onClick={onBuildPackage}
            className="inline-flex w-56 justify-center rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold tracking-wide text-black transition hover:bg-transparent hover:text-white"
          >
            Build Your Package
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
