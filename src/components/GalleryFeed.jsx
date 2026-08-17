import { useEffect, useRef, useState } from "react";
import PrimaryButtonLink from "./PrimaryButtonLink";

const GALLERY_ENDPOINT = "/api/gallery";

function getImageAlt(filename) {
  const fallback = "Completed power washing project";

  if (!filename) {
    return fallback;
  }

  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  const cleanedName = nameWithoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\b(img|dsc|image|photo|screenshot)\b/gi, "")
    .replace(/\b\d{3,}\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedName) {
    return fallback;
  }

  return `Completed power washing project: ${cleanedName}`;
}

function GallerySkeleton() {
  return (
    <div className="gallery-grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="gallery-skeleton"
          key={index}
          style={{ aspectRatio: index % 3 === 1 ? "4 / 5" : "4 / 3" }}
        />
      ))}
    </div>
  );
}

function GalleryLightbox({ image, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("is-lightbox-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("is-lightbox-open");
    };
  }, [onClose]);

  return (
    <div
      aria-label="Project image viewer"
      aria-modal="true"
      className="gallery-lightbox"
      role="dialog"
    >
      <button
        aria-label="Close image viewer"
        className="gallery-lightbox-backdrop"
        onClick={onClose}
        type="button"
      />
      <div className="gallery-lightbox-frame">
        <button
          aria-label="Close image viewer"
          className="gallery-lightbox-close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          Close
        </button>
        <img
          alt={getImageAlt(image.filename)}
          className="gallery-lightbox-image"
          src={image.imageUrl}
        />
      </div>
    </div>
  );
}

function GalleryFeed({ ctaLabel, ctaTo = "/contact" }) {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeImage, setActiveImage] = useState(null);
  const lastFocusedElementRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        setStatus("loading");

        const response = await fetch(GALLERY_ENDPOINT, {
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gallery request failed.");
        }

        const data = await response.json();
        const nextImages = Array.isArray(data.images) ? data.images : [];

        setImages(nextImages);
        setStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setImages([]);
        setStatus("error");
      }
    }

    loadGallery();

    return () => {
      controller.abort();
    };
  }, []);

  const openLightbox = (image) => {
    lastFocusedElementRef.current = document.activeElement;
    setActiveImage(image);
  };

  const closeLightbox = () => {
    setActiveImage(null);
    lastFocusedElementRef.current?.focus?.();
  };

  return (
    <section className="gallery-section">
      <div className="gallery-wrap shell">
        {status === "loading" ? <GallerySkeleton /> : null}

        {status === "error" ? (
          <p className="gallery-message">
            The project gallery is taking a moment to load. Please check back shortly.
          </p>
        ) : null}

        {status === "ready" && images.length === 0 ? (
          <p className="gallery-message">
            New project photos are being prepared for this page.
          </p>
        ) : null}

        {status === "ready" && images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((image) => {
              const width = Number(image.width);
              const height = Number(image.height);
              const hasDimensions =
                Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0;

              return (
                <button
                  aria-label={`Open ${getImageAlt(image.filename)}`}
                  className="gallery-item"
                  key={image.id}
                  onClick={() => openLightbox(image)}
                  style={hasDimensions ? { aspectRatio: `${width} / ${height}` } : undefined}
                  type="button"
                >
                  <img
                    alt={getImageAlt(image.filename)}
                    className="gallery-image"
                    height={hasDimensions ? height : undefined}
                    loading="lazy"
                    src={image.thumbnailUrl || image.imageUrl}
                    width={hasDimensions ? width : undefined}
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {ctaLabel ? (
        <div className="gallery-actions shell">
          <PrimaryButtonLink to={ctaTo}>{ctaLabel}</PrimaryButtonLink>
        </div>
      ) : null}

      {activeImage ? <GalleryLightbox image={activeImage} onClose={closeLightbox} /> : null}
    </section>
  );
}

export default GalleryFeed;
