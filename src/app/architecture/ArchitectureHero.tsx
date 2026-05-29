/**
 * ArchitectureHero — page-specific hero variant for /architecture.
 *
 * Reuses the brand wordmark gradient + sunset stripe pattern from the home
 * Hero, but skips the time-machine canvas and scroll mechanic. Single static
 * intro framing the 8-tier diagram below.
 */
import { DisplayHeading, BodyCopy, Caption } from "@/components/primitives";

type Props = {
  lastUpdated: string;
  phasesShipped: string;
  phasesPending: string;
};

export function ArchitectureHero({
  lastUpdated,
  phasesShipped,
  phasesPending,
}: Props) {
  return (
    <section
      id="architecture-hero"
      aria-labelledby="arch-headline"
      className="relative px-6 pt-32 pb-12 md:pt-40 md:pb-16"
    >
      <div className="mx-auto max-w-[920px] text-center">
        <Caption tone="trust" className="mb-6">
          Reference Architecture
        </Caption>

        <DisplayHeading as="h1" size="xl" id="arch-headline" className="mb-6">
          A
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-yellow">
            i
          </span>
          OS Architecture
        </DisplayHeading>

        {/* sunset signature stripe under the wordmark */}
        <div
          aria-hidden="true"
          className="mx-auto h-[3px] w-[280px] max-w-[60%] rounded-full opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_78%,transparent_100%)]"
          style={{
            background:
              "linear-gradient(90deg, var(--color-sunset-red), var(--color-sunset-orange), var(--color-sunset-yellow), var(--color-sunset-gold))",
          }}
        />

        <BodyCopy size="lg" tone="primary" className="mx-auto mt-8 max-w-[680px]">
          The 8-tier reference architecture behind every JFly.ai install.
          Foundation rules, persistent memory, knowledge files, behavior layer,
          external memory — eight tiers, one operating system.
        </BodyCopy>

        <p className="mt-6 font-body text-[0.75rem] uppercase tracking-[0.05em] text-bone/50">
          Last updated {lastUpdated} · Phases {phasesShipped} shipped · Phases{" "}
          {phasesPending} pending
        </p>
      </div>
    </section>
  );
}
