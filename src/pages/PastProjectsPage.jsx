import deckImage from "../assets/deck.jpg";
import GalleryFeed from "../components/GalleryFeed";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function PastProjectsPage() {
  return (
    <>
      <Seo
        title="Power Washing Projects"
        description="See recent power washing and exterior cleaning projects from D's Powerwashing, serving homes and outdoor surfaces across the Greater Michiana Area."
        path="/our-work"
      />
      <PageHero
        title="Past Projects"
        image={deckImage}
        imageAlt="Recently cleaned deck"
        body="Browse recent exterior cleaning work, pressure washing results, and refreshed outdoor surfaces completed by D's Powerwashing."
        size="compact"
      />

      <GalleryFeed ctaLabel="Book A Cleaning" />
    </>
  );
}

export default PastProjectsPage;
