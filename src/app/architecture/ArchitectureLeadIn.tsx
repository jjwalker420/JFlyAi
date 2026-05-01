/**
 * ArchitectureLeadIn — 3-block consumer framing above the diagram.
 *
 * Frames the architecture in plain language before showing the complex grid.
 * Sunset-stripe dividers between blocks echo the hero stripe.
 */
import { DisplayHeading } from "@/components/primitives";

function SunsetStripe({ width = 280 }: { width?: number }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-[3px] rounded-full opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_78%,transparent_100%)]"
      style={{
        width: `${width}px`,
        maxWidth: "60%",
        background:
          "linear-gradient(90deg, var(--color-sunset-red), var(--color-sunset-orange), var(--color-sunset-yellow), var(--color-sunset-gold))",
      }}
    />
  );
}

export function ArchitectureLeadIn() {
  return (
    <section
      id="architecture-leadin"
      aria-labelledby="arch-leadin-headline"
      className="px-6 py-24 md:py-28"
    >
      <div className="mx-auto max-w-[820px] text-center">
        {/* Block 1 — large headline */}
        <DisplayHeading
          as="h2"
          size="lg"
          tone="primary"
          id="arch-leadin-headline"
        >
          An AI Operating System has 8 layers.
        </DisplayHeading>

        <div className="mt-10 mb-10">
          <SunsetStripe />
        </div>

        {/* Block 2 — body, three paragraphs */}
        <div className="mx-auto max-w-[720px] space-y-5">
          <p className="font-body text-[1.125rem] leading-[1.55] text-mid-gray md:text-[1.25rem]">
            Most people stack tools. AiOS stacks LAYERS — each one does one
            job, and they load in the right order, every session.
          </p>
          <p className="font-body text-[1.125rem] leading-[1.55] text-bone md:text-[1.25rem]">
            Foundation rules. Persistent memory. Project context. Knowledge
            files. Agents. Behavior. External memory.
          </p>
          <p className="font-body text-[1.125rem] font-semibold leading-[1.55] text-bone md:text-[1.25rem]">
            Built once. Runs your life.
          </p>
        </div>

        <div className="mt-12 mb-8">
          <SunsetStripe width={200} />
        </div>

        {/* Block 3 — transition */}
        <p className="font-body text-[0.95rem] uppercase tracking-[0.18em] text-bone/60">
          Here&rsquo;s the full architecture.
        </p>
      </div>
    </section>
  );
}
