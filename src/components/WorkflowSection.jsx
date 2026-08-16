const workflowSteps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "D's Powerwashing looks over the exterior surfaces you want cleaned, talks through problem areas, and confirms the right pressure washing approach for your home or property.",
  },
  {
    step: "02",
    title: "Get An Estimate",
    description:
      "Once the cleaning needs are reviewed, the plan is formalized into a clear power washing estimate so you know what the work involves before anything begins.",
  },
  {
    step: "03",
    title: "Clean With Confidence",
    description:
      "The job gets done with a focus on surface care, consistent pressure washing results, and a customer satisfaction guarantee, because every property deserves careful attention.",
  },
];

function WorkflowSection() {
  return (
    <section className="workflow-section">
      <div className="workflow-section-header shell">
        <p className="workflow-section-eyebrow">How We Work</p>
        <h2>Power washing built around trust and quality.</h2>
        <p className="workflow-section-intro">
          D&apos;s Powerwashing handles exterior cleaning for homes, driveways,
          walkways, patios, decks, siding, and outdoor surfaces across the
          Greater Michiana Area with clear planning, careful work, and customer
          satisfaction at the end.
        </p>
      </div>

      <div className="workflow-grid shell">
        {workflowSteps.map((item) => (
          <article key={item.step} className="workflow-card">
            <p className="workflow-step">{item.step}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WorkflowSection;
