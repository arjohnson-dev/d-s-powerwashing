import { siteImages } from "../assets/siteImages";
import ImageLinkPanel from "../components/ImageLinkPanel";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function HomePage() {
  return (
    <>
      <Seo
        title="Pressure Washing in the Greater Michiana Area"
        description="D's Powerwashing provides pressure washing, power washing, and exterior cleaning for homes, driveways, walkways, patios, siding, and outdoor surfaces in the Greater Michiana Area."
        path="/"
      />
      <PageHero
        title="We Can Clean It"
        image={siteImages.hero}
        imageAlt="Powerwashing equipment ready for exterior cleaning"
        imagePosition="center 42%"
        className="home-hero"
        eyebrow="Serving the Greater Michiana Area"
        body="D's Powerwashing provides dependable exterior cleaning for driveways, walkways, siding, patios, decks, and outdoor surfaces across the Greater Michiana Area. Every power washing project is handled with careful prep, surface care, and a commitment to customer satisfaction."
        ctaLabel="Book A Cleaning Now"
      />

      <ImageLinkPanel
        title="Services"
        image={siteImages.house}
        imageAlt="Freshly cleaned home exterior"
        to="/services"
      />
      <ImageLinkPanel
        title="Past Projects"
        image={siteImages.deck}
        imageAlt="Recently cleaned deck"
        to="/our-work"
      />
      <ImageLinkPanel
        title="About Us"
        image={siteImages.aboutHero}
        imageAlt="Dylan Pittenger with D's Powerwashing equipment"
        imagePosition="center 34%"
        className="about-link-panel"
        to="/about"
      />
      <ImageLinkPanel
        title="Contact"
        image={siteImages.trailer}
        imageAlt="D's Powerwashing trailer and equipment"
        to="/contact"
      />
    </>
  );
}

export default HomePage;
