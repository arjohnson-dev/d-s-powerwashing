import { siteImages } from "../assets/siteImages";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you were looking for is not available. Return to D's Powerwashing for pressure washing and exterior cleaning in the Greater Michiana Area."
        path="/404"
      />
      <PageHero
        title="Page Not Found"
        image={siteImages.deck}
        imageAlt="Powerwashing work area"
        eyebrow="Wrong Turn"
        body="The page you were looking for is not here, but we can get you back to D's Powerwashing."
        ctaLabel="Return Home"
        ctaTo="/"
      />
    </>
  );
}

export default NotFoundPage;
