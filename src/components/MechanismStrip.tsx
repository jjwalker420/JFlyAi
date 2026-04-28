const PHASES: Array<{ id: string; label: string; desktopOnly?: boolean }> = [
  { id: "phase-audit", label: "AUDIT" },
  { id: "phase-setup", label: "SETUP" },
  { id: "phase-optimize", label: "OPTIMIZE" },
  { id: "phase-maintain", label: "MAINTAIN", desktopOnly: true },
];

export function MechanismStrip() {
  return (
    <nav
      aria-label="JFly.ai four-phase delivery process"
      data-component="mechanism-strip"
    >
      <ol className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 font-display text-[0.875rem] md:gap-x-5 md:text-base">
        {PHASES.map((p, i) => {
          const next = PHASES[i + 1];
          return (
            <li
              key={p.id}
              className={`flex items-center gap-x-1 md:gap-x-5 ${
                p.desktopOnly ? "hidden md:flex" : ""
              }`}
            >
              <a
                href={`#${p.id}`}
                className="inline-flex min-h-[36px] items-center whitespace-nowrap px-2 py-1 font-medium tracking-[0.18em] text-bone transition-colors duration-200 hover:text-lamp-amber md:min-h-[44px] md:px-3 md:py-2"
              >
                {p.label}
              </a>
              {next && (
                <span
                  aria-hidden="true"
                  className={`text-lamp-amber/70 ${
                    next.desktopOnly ? "hidden md:inline" : ""
                  }`}
                >
                  ·
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
