import { dayRateServices } from "../data/dayRateServices";
import PrimaryButtonLink from "./PrimaryButtonLink";

function DayRateCardSection() {
  return (
    <section className="day-rate-section">
      <div className="shell">
        <div className="day-rate-card">
          <p className="day-rate-eyebrow">Flexible Service Option</p>
          <h2>Rent A Handyman For A Day</h2>
          <p className="day-rate-price">$400</p>
          <p className="day-rate-subtitle">8 HRS of Service for one flat price</p>

          <div className="day-rate-list">
            {dayRateServices.map((item) => (
              <p key={item} className="day-rate-item">
                {item}
              </p>
            ))}
          </div>

          <div className="day-rate-actions">
            <PrimaryButtonLink to="/contact#contact-form">Book Now</PrimaryButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DayRateCardSection;
