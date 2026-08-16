import { powerwashingServices } from "../data/dayRateServices";
import PrimaryButtonLink from "./PrimaryButtonLink";

function DayRateCardSection() {
  return (
    <section className="day-rate-section">
      <div className="shell">
        <div className="day-rate-card">
          <p className="day-rate-eyebrow">Powerwashing Services</p>
          <h2>Exterior Cleaning Priced By The Surface</h2>
          <p className="day-rate-price">Starting at 25¢/sq. ft.</p>

          <div className="day-rate-list">
            {powerwashingServices.map((item) => (
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
