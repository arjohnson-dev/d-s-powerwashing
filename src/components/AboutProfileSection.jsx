import { siteImages } from "../assets/siteImages";

const valueItems = [
  {
    title: "Do The Job Right",
    description:
      "D's Powerwashing believes quality matters whether the job is driveway cleaning, walkway cleaning, patio power washing, siding washing, or a full exterior refresh. The standard stays the same: careful cleaning that makes the property look its best.",
  },
  {
    title: "Treat People Fairly",
    description:
      "Clear communication, honest expectations, and respect for the homeowner are part of every exterior cleaning. The goal is to make the process feel straightforward from start to finish.",
  },
  {
    title: "Stand Behind The Work",
    description:
      "Customer satisfaction is not an extra. It is part of the job. D's Powerwashing takes pride in leaving concrete, siding, patios, decks, and outdoor surfaces cleaner, brighter, and ready to enjoy.",
  },
];

function AboutProfileSection() {
  return (
    <section className="about-section">
      <div className="about-section-inner shell">
        <div className="about-values">
          <p className="about-section-eyebrow">What Drives D&apos;s Powerwashing</p>
          <div className="about-values-grid">
            {valueItems.map((item) => (
              <article key={item.title} className="about-value-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="about-profile">
          <div className="about-profile-grid">
            <div className="about-profile-image-wrap">
              <img
                className="about-profile-image"
                src={siteImages.about}
                alt="D's Powerwashing owner at an exterior cleaning job"
                decoding="async"
                loading="lazy"
              />
            </div>

            <div className="about-profile-copy-wrap">
              <h2>Dylan Pittenger</h2>
              <p className="about-profile-role">Owner, D&apos;s Powerwashing</p>
              <p className="about-profile-copy">
                D&apos;s Powerwashing was built around the kind of service
                homeowners want to feel confident calling again: dependable
                scheduling, honest communication, and real pride in the finished
                pressure washing result.
              </p>
              <p className="about-profile-copy">
                From small touch-ups to larger exterior cleaning projects, every
                job gets the same mindset. No driveway, walkway, patio, deck, or
                siding wash is too small to deserve attention, and no larger job
                moves forward without care, planning, and respect for the
                customer&apos;s home.
              </p>
              <p className="about-profile-copy">
                That approach is what shapes the D&apos;s Powerwashing reputation.
                Customers know they are getting someone who values showing up,
                communicating clearly, and leaving behind a property they can
                feel good about long after the power washing is finished.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutProfileSection;
