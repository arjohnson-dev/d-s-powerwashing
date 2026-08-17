import PrimaryButtonLink from "./PrimaryButtonLink";

function PageHero({
  title,
  image,
  imageAlt,
  eyebrow,
  body,
  ctaLabel,
  ctaTo = "/contact",
  align = "left",
  size = "default",
  imagePosition = "center",
  imageLoading = "eager",
  imageFetchPriority = "high",
  className = "",
}) {
  const contentClassName =
    align === "center" ? "page-hero-content is-centered shell" : "page-hero-content shell";
  const sectionClassName =
    size === "compact" ? "page-hero page-hero-compact" : "page-hero";
  const heroClassName = [sectionClassName, className].filter(Boolean).join(" ");

  return (
    <section className={heroClassName} aria-label={title}>
      <img
        className="page-hero-media"
        src={image}
        alt={imageAlt}
        decoding="async"
        fetchPriority={imageFetchPriority}
        loading={imageLoading}
        style={{ objectPosition: imagePosition }}
      />
      <div className="page-hero-overlay" />

      <div className={contentClassName}>
        {eyebrow ? <p className="page-hero-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {body ? <p className="page-hero-copy">{body}</p> : null}
        {ctaLabel ? <PrimaryButtonLink to={ctaTo}>{ctaLabel}</PrimaryButtonLink> : null}
      </div>
    </section>
  );
}

export default PageHero;
