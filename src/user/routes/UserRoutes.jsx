import { useEffect, useState } from "react";
import UserLayout from "@user/layouts/UserLayout";
import Header from "@user/components/Header";
import Hero from "@user/components/Hero";
import TKMoments from "@user/components/AboutSection";
import WeddingCarousel from "@user/components/story";
import WeddingStories from "@user/components/WeddingStories";
import WeddingFilms from "@user/components/WeddingFilms";
import AboutPage from "@user/components/AboutPage";
import { PackageBuilder } from "@user/components/package-builder";
import Packageposter from "@user/components/packageposter";
import ContactUs from "@user/components/contact";
import MinimalFooter from "@user/components/fotter";

const hashToPage = {
  "#wedding-stories": "wedding-stories",
  "#wedding-films": "wedding-films",
  "#about": "about",
  "#contact": "contact",
};

const pathToPage = {
  "/wedding-stories": "wedding-stories",
  "/wedding-films": "wedding-films",
  "/about": "about",
  "/contact": "contact",
};

function getPageFromLocation() {
  return hashToPage[window.location.hash] || pathToPage[window.location.pathname] || "home";
}

export default function UserRoutes() {
  const [showPackageBuilder, setShowPackageBuilder] = useState(false);
  const [currentPage, setCurrentPage] = useState(getPageFromLocation);

  useEffect(() => {
    const syncPageWithLocation = () => {
      setCurrentPage(getPageFromLocation());
    };

    window.addEventListener("hashchange", syncPageWithLocation);
    window.addEventListener("popstate", syncPageWithLocation);
    return () => {
      window.removeEventListener("hashchange", syncPageWithLocation);
      window.removeEventListener("popstate", syncPageWithLocation);
    };
  }, []);

  const handleNavigate = (target) => {
    setShowPackageBuilder(false);

    if (
      target === "wedding-stories" ||
      target === "wedding-films" ||
      target === "about" ||
      target === "contact"
    ) {
      setCurrentPage(target);
      window.history.pushState(null, "", `#${target}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentPage("home");
    window.history.pushState(null, "", `#${target}`);
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <UserLayout>
      {showPackageBuilder ? (
        <PackageBuilder onBack={() => setShowPackageBuilder(false)} />
      ) : (
        <>
          <Header
            alwaysDark={
              currentPage === "wedding-stories" ||
              currentPage === "wedding-films" ||
              currentPage === "about" ||
              currentPage === "contact"
            }
            onNavigate={handleNavigate}
          />
          {currentPage === "wedding-stories" ? (
            <WeddingStories />
          ) : currentPage === "wedding-films" ? (
            <WeddingFilms />
          ) : currentPage === "about" ? (
            <AboutPage />
          ) : currentPage === "contact" ? (
            <ContactUs />
          ) : (
            <>
              <Hero onBuildPackage={() => setShowPackageBuilder(true)} />
              <TKMoments />
              <WeddingCarousel />
              <Packageposter onBuildPackage={() => setShowPackageBuilder(true)} />
            </>
          )}
          <MinimalFooter onNavigate={handleNavigate} />
        </>
      )}
    </UserLayout>
  );
}
