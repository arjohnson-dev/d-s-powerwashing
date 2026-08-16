import { useEffect, useRef } from "react";
import { ValidationError, useForm } from "@formspree/react";

const subjectPlaceholders = [
  "Driveway cleaning",
  "House wash",
  "Patio powerwashing",
  "Walkway cleaning",
  "Deck cleaning",
  "Siding wash",
];

function ContactFormSection() {
  const [state, handleSubmit] = useForm("xreorvjd");
  const subjectInputRef = useRef(null);

  useEffect(() => {
    if (!subjectInputRef.current) {
      return;
    }

    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const placeholderIndex = randomBuffer[0] % subjectPlaceholders.length;

    subjectInputRef.current.placeholder = subjectPlaceholders[placeholderIndex];
  }, []);

  if (state.succeeded) {
    return (
      <section className="contact-section" id="contact-form">
        <div className="contact-section-inner shell">
          <div className="contact-success">
            <p className="contact-success-eyebrow">Message Sent</p>
            <h2>Thanks for reaching out.</h2>
            <p>
              D&apos;s Powerwashing has your message and will follow up as soon as
              possible.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-section" id="contact-form">
      <div className="contact-section-inner shell">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="form-field form-field-full" htmlFor="contact-name">
            <span>
              Name <span className="form-required">*</span>
            </span>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your Name"
              required
            />
            <ValidationError
              className="form-error"
              prefix="Name"
              field="name"
              errors={state.errors}
            />
          </label>

          <label className="form-field form-field-half" htmlFor="contact-phone">
            <span>
              Phone <span className="form-required">*</span>
            </span>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern="^\\+?[0-9()\\-\\.\\s]{10,}$"
              title="Please enter a valid phone number."
              placeholder="(123) 456-7890"
              required
            />
            <ValidationError
              className="form-error"
              prefix="Phone"
              field="phone"
              errors={state.errors}
            />
          </label>

          <label className="form-field form-field-half" htmlFor="contact-email">
            <span>Email</span>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
            />
            <ValidationError
              className="form-error"
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </label>

          <label
            className="form-field form-field-full"
            htmlFor="contact-subject"
          >
            <span>Subject</span>
            <input
              id="contact-subject"
              name="subject"
              placeholder="Driveway cleaning"
              ref={subjectInputRef}
              type="text"
            />
            <ValidationError
              className="form-error"
              prefix="Subject"
              field="subject"
              errors={state.errors}
            />
          </label>

          <label
            className="form-field form-field-full"
            htmlFor="contact-message"
          >
            <span>
              Message <span className="form-required">*</span>
            </span>
            <textarea
              id="contact-message"
              name="message"
              rows="6"
              placeholder="Tell us what you need..."
              required
            />
            <ValidationError
              className="form-error"
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </label>

          <button
            className="button button-primary contact-form-submit"
            type="submit"
            disabled={state.submitting}
          >
            {state.submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactFormSection;
