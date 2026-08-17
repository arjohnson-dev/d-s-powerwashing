import DayRateCardSection from "../components/DayRateCardSection";
import { siteImages } from "../assets/siteImages";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";
import WorkflowSection from "../components/WorkflowSection";

function ServicesPage() {
  return (
    <>
      <Seo
        title="Power Washing Services"
        description="Explore D's Powerwashing services for driveway cleaning, siding washing, walkway cleaning, patio cleaning, deck cleaning, and exterior surface care in the Greater Michiana Area."
        path="/services"
      />
      <PageHero
        title="Power Washing Services"
        image={siteImages.house}
        imageAlt="Freshly cleaned home exterior"
        body="Professional pressure washing and exterior cleaning for homes, concrete, siding, patios, decks, walkways, and other outdoor surfaces."
        size="compact"
      />

      <WorkflowSection />
      <DayRateCardSection />
    </>
  );
}

export default ServicesPage;
