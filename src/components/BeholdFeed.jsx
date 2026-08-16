import { useEffect } from "react";
import PrimaryButtonLink from "./PrimaryButtonLink";

const BEHOLD_WIDGET_SCRIPT_SRC = "https://w.behold.so/widget.js";

function BeholdFeed({ ctaLabel, ctaTo = "/contact", feedId }) {
  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src="${BEHOLD_WIDGET_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = BEHOLD_WIDGET_SCRIPT_SRC;
    document.head.append(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="feed-section">
      <div className="feed-widget-wrap shell">
        <behold-widget feed-id={feedId} />
      </div>

      {ctaLabel ? (
        <div className="feed-actions shell">
          <PrimaryButtonLink to={ctaTo}>{ctaLabel}</PrimaryButtonLink>
        </div>
      ) : null}
    </section>
  );
}

export default BeholdFeed;
