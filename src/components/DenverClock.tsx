"use client";

import { useEffect, useState } from "react";

const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const tzFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver",
  timeZoneName: "short",
});

function getDisplay() {
  const now = new Date();
  const time = timeFmt.format(now);
  const tz =
    tzFmt.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ??
    "MT";
  return `DENVER · ONLINE · ${time} ${tz}`;
}

export function DenverClock() {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    setDisplay(getDisplay());
    const id = setInterval(() => setDisplay(getDisplay()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!display) return null;

  return (
    <span
      aria-hidden="true"
      className="hidden lg:inline-block font-mono text-[0.75rem] tracking-[0.15em] text-bone/60 select-none"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </span>
  );
}
