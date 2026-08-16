import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function HashScroller() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const element = document.getElementById(location.hash.slice(1));

    if (!element) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export default HashScroller;
