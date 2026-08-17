import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PrimaryButtonLink from "./PrimaryButtonLink";

const GALLERY_ENDPOINT = "/api/gallery";
const SWIPE_DISTANCE_THRESHOLD = 50;
const SWIPE_AXIS_RATIO = 1.4;

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

function GalleryLightbox({ image, hasMultipleImages, onClose, onNext, onPrevious }) {
  const closeButtonRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("is-lightbox-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("is-lightbox-open");
    };
  }, [onClose, onNext, onPrevious]);

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1 || event.target.closest("button")) {
      touchStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event) => {
    const touchStart = touchStartRef.current;
    touchStartRef.current = null;

    if (!touchStart || event.changedTouches.length !== 1 || event.target.closest("button")) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const isIntentionalHorizontalSwipe =
      Math.abs(deltaX) >= SWIPE_DISTANCE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_AXIS_RATIO;

    if (!isIntentionalHorizontalSwipe) {
      return;
    }

    if (deltaX < 0) {
      onNext();
    } else {
      onPrevious();
    }
  };

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
        <div className="gallery-lightbox-stage">
          {hasMultipleImages ? (
            <button
              aria-label="Previous project image"
              className="gallery-lightbox-nav gallery-lightbox-nav-previous"
              onClick={onPrevious}
              type="button"
            >
              <FiChevronLeft aria-hidden="true" focusable="false" />
            </button>
          ) : null}
          <img
            alt={getImageAlt(image.filename)}
            className="gallery-lightbox-image"
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
            src={image.imageUrl}
          />
          {hasMultipleImages ? (
            <button
              aria-label="Next project image"
              className="gallery-lightbox-nav gallery-lightbox-nav-next"
              onClick={onNext}
              type="button"
            >
              <FiChevronRight aria-hidden="true" focusable="false" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GalleryFeed({ ctaLabel, ctaTo = "/contact" }) {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const lastFocusedElementRef = useRef(null);
  const activeImage = activeImageIndex === null ? null : images[activeImageIndex];
  const hasMultipleImages = images.length > 1;

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

  useEffect(() => {
    if (activeImageIndex !== null && !images[activeImageIndex]) {
      setActiveImageIndex(null);
    }
  }, [activeImageIndex, images]);

  const getWrappedImageIndex = useCallback(
    (index) => {
      if (images.length === 0) {
        return null;
      }

      return (index + images.length) % images.length;
    },
    [images.length],
  );

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return getWrappedImageIndex(currentIndex - 1);
    });
  }, [getWrappedImageIndex]);

  const showNextImage = useCallback(() => {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return getWrappedImageIndex(currentIndex + 1);
    });
  }, [getWrappedImageIndex]);

  useEffect(() => {
    if (activeImageIndex === null || images.length < 2) {
      return;
    }

    const previousImage = images[getWrappedImageIndex(activeImageIndex - 1)];
    const nextImage = images[getWrappedImageIndex(activeImageIndex + 1)];

    [previousImage, nextImage].forEach((galleryImage) => {
      if (galleryImage?.imageUrl) {
        const preloadedImage = new Image();
        preloadedImage.src = galleryImage.imageUrl;
      }
    });
  }, [activeImageIndex, getWrappedImageIndex, images]);

  const openLightbox = (index) => {
    lastFocusedElementRef.current = document.activeElement;
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
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
            {images.map((image, index) => {
              const width = Number(image.width);
              const height = Number(image.height);
              const hasDimensions =
                Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0;

              return (
                <button
                  aria-label={`Open ${getImageAlt(image.filename)}`}
                  className="gallery-item"
                  key={image.id}
                  onClick={() => openLightbox(index)}
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

      {activeImage ? (
        <GalleryLightbox
          hasMultipleImages={hasMultipleImages}
          image={activeImage}
          onClose={closeLightbox}
          onNext={showNextImage}
          onPrevious={showPreviousImage}
        />
      ) : null}
    </section>
  );
}

export default GalleryFeed;
