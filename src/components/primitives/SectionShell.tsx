import type { ReactNode, HTMLAttributes } from "react";

type Width = "wide" | "text";

const WIDTH: Record<Width, string> = {
  wide: "max-w-[1280px]",
  text: "max-w-[720px]",
};

type Props = HTMLAttributes<HTMLElement> & {
  /** semantic id for #anchor + scrollIntoView */
  id?: string;
  /** scene name from DESIGN-LAYOUT (sets data-scene attr) */
  scene?: string;
  /** referenced by aria-labelledby */
  ariaLabelledBy?: string;
  ariaLabel?: string;
  /** vertical sizing */
  fullHeight?: boolean;
  /** content max-width */
  contentWidth?: Width;
  /**
   * Apply the architectural-warm radial overlays (top-left + bottom-right
   * corner amber + heading-halo). Default ON — opt out only if the section
   * already paints its own lamp-amber field (e.g. the hero canvas).
   */
  warmLight?: boolean;
  children: ReactNode;
};

export function SectionShell({
  id,
  scene,
  ariaLabelledBy,
  ariaLabel,
  fullHeight = false,
  contentWidth = "wide",
  warmLight = true,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <section
      id={id}
      data-scene={scene}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={`relative px-6 py-12 md:py-16 ${
        warmLight ? "warm-light" : ""
      } ${fullHeight ? "min-h-screen flex items-center" : ""} ${className}`}
      {...rest}
    >
      <div className={`mx-auto w-full ${WIDTH[contentWidth]}`}>{children}</div>
    </section>
  );
}
