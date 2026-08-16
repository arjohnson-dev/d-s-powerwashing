import { useEffect } from "react";

const defaultImage = "/ds-powerwashing-logo.jpg";
const siteName = "D's Powerwashing";

function setMetaAttribute(selector, attribute, value) {
  if (!value) {
    return;
  }

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

function setLinkAttribute(selector, attribute, value) {
  if (!value) {
    return;
  }

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

function Seo({
  title,
  description,
  path = "/",
  image = defaultImage,
  structuredData,
}) {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = new URL(path, origin).href;
    const imageUrl = new URL(image, origin).href;
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    document.title = fullTitle;

    setMetaAttribute('meta[name="description"]', "name", "description");
    document.head
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);

    setLinkAttribute('link[rel="canonical"]', "rel", "canonical");
    document.head.querySelector('link[rel="canonical"]').setAttribute("href", canonicalUrl);

    const metaEntries = [
      ["og:title", fullTitle],
      ["og:description", description],
      ["og:type", "website"],
      ["og:url", canonicalUrl],
      ["og:image", imageUrl],
      ["og:site_name", siteName],
      ["twitter:card", "summary_large_image"],
      ["twitter:title", fullTitle],
      ["twitter:description", description],
      ["twitter:image", imageUrl],
    ];

    metaEntries.forEach(([property, content]) => {
      const attribute = property.startsWith("twitter:") ? "name" : "property";
      const selector = `meta[${attribute}="${property}"]`;
      setMetaAttribute(selector, attribute, property);
      document.head.querySelector(selector).setAttribute("content", content);
    });

    const existingSchema = document.head.querySelector("#local-business-schema");
    if (existingSchema) {
      existingSchema.remove();
    }

    const schema = document.createElement("script");
    schema.id = "local-business-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(
      structuredData ?? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: siteName,
        url: origin,
        telephone: "+15745006800",
        image: imageUrl,
        sameAs: ["https://www.facebook.com/profile.php?id=61590824333548"],
        areaServed: "Greater Michiana Area",
        description:
          "D's Powerwashing provides pressure washing, power washing, and exterior cleaning for homes, driveways, walkways, patios, siding, and outdoor surfaces in the Greater Michiana Area.",
      }
    );
    document.head.appendChild(schema);

    return () => {
      schema.remove();
    };
  }, [description, image, path, structuredData, title]);

  return null;
}

export default Seo;
