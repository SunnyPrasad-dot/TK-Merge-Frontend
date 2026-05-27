import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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

const pathToPage = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/wedding-stories": "wedding-stories",
  "/wedding-films": "wedding-films",
};

function UserShell({ page = "home" }) {
  const [showPackageBuilder, setShowPackageBuilder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowPackageBuilder(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleNavigate = (target) => {
    setShowPackageBuilder(false);

    if (target === "wedding-stories") return navigate("/wedding-stories");
    if (target === "wedding-films") return navigate("/wedding-films");
    if (target === "about") return navigate("/about");
    if (target === "contact") return navigate("/contact");

    if (target === "home") {
      navigate("/");
      return;
    }

    navigate("/");
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  if (showPackageBuilder) {
    return (
      <UserLayout>
        <PackageBuilder onBack={() => setShowPackageBuilder(false)} />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Header
        alwaysDark={page !== "home"}
        onNavigate={handleNavigate}
      />
      {page === "wedding-stories" ? (
        <WeddingStories />
      ) : page === "wedding-films" ? (
        <WeddingFilms />
      ) : page === "about" ? (
        <AboutPage />
      ) : page === "contact" ? (
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
    </UserLayout>
  );
}

function RoutedUserShell() {
  const location = useLocation();
  return <UserShell page={pathToPage[location.pathname] || "home"} />;
}

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoutedUserShell />} />
      <Route path="/about" element={<UserShell page="about" />} />
      <Route path="/contact" element={<UserShell page="contact" />} />
      <Route path="/wedding-stories" element={<UserShell page="wedding-stories" />} />
      <Route path="/wedding-films" element={<UserShell page="wedding-films" />} />
      <Route path="*" element={<RoutedUserShell />} />
    </Routes>
  );
}
