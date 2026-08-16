import { Link } from "react-router-dom";

function ImageLinkPanel({
  title,
  image,
  imageAlt,
  imagePosition = "center",
  imageScale = 1,
  className = "",
  to,
}) {
  const panelClassName = ["image-link-panel", className].filter(Boolean).join(" ");

  return (
    <Link className={panelClassName} to={to} aria-label={`Go to ${title} page`}>
      <img
        className="image-link-panel-media"
        src={image}
        alt={imageAlt}
        style={{ objectPosition: imagePosition, transform: `scale(${imageScale})` }}
      />
      <div className="image-link-panel-overlay" />
      <div className="image-link-panel-content shell">
        <h2>{title}</h2>
      </div>
    </Link>
  );
}

export default ImageLinkPanel;
