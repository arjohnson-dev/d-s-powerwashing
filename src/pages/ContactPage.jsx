import { siteImages } from "../assets/siteImages";
import ContactFormSection from "../components/ContactFormSection";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact D's Powerwashing"
        description="Contact D's Powerwashing to request an estimate for pressure washing, driveway cleaning, siding washing, patio cleaning, or exterior cleaning in the Greater Michiana Area."
        path="/contact"
      />
      <PageHero
        title="Contact"
        image={siteImages.trailer}
        imageAlt="D's Powerwashing trailer and equipment"
        body="Request a power washing estimate for your driveway, siding, patio, walkway, deck, or other outdoor surface."
        size="compact"
      />

      <ContactFormSection />
    </>
  );
}

export default ContactPage;
