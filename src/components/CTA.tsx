import { BodyCopy, DisplayHeading } from "./primitives";
import { IntakeForm } from "./IntakeForm";

export function CTA() {
  return (
    <section
      id="cta"
      data-scene="cta"
      aria-labelledby="cta-headline"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-deep-stone via-amber-flame/35 to-horizon-gold px-6 py-24"
    >
      <div className="relative z-10 w-full max-w-[720px] text-center">
        <DisplayHeading as="h2" id="cta-headline" className="mb-6">
          Ready to set this up?
        </DisplayHeading>
        <BodyCopy size="lg" tone="primary" className="mx-auto mb-10 max-w-[560px]">
          Book a 30-minute call. We&rsquo;ll talk about your business, what you&rsquo;re using AI for now, and whether the Audit is the right next step.
        </BodyCopy>
        <div className="glass-cta p-4 text-left md:p-5">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
