import { siteImages } from "../assets/siteImages";
import AboutProfileSection from "../components/AboutProfileSection";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function AboutPage() {
  return (
    <>
      <Seo
        title="About D's Powerwashing"
        description="Learn about Dylan Pittenger and D's Powerwashing, an owner-operated pressure washing and exterior cleaning service in the Greater Michiana Area."
        path="/about"
      />
      <PageHero
        title="About Us"
        image={siteImages.aboutHero}
        imageAlt="Dylan Pittenger with D's Powerwashing equipment"
        imagePosition="center 28%"
        body="Owner-operated exterior cleaning with dependable communication, careful surface care, and pride in every finished power washing job."
        size="compact"
      />

      <AboutProfileSection />
    </>
  );
}

export default AboutPage;
