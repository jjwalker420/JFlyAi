"use client";

import { useEffect } from "react";

/**
 * TermlyEmbed — renders a Termly-hosted policy as an iframe embed.
 *
 * Termly requires a <div name="termly-embed"> which is non-standard HTML,
 * so we use a client component + useEffect to inject both the div's name
 * attribute and the embed script after mount.
 *
 * Website UUID: f3b42b48-c745-4a76-85ca-90c7f0c26ce4 (JFly.ai on Termly)
 * Privacy Policy UUID: c792f35b-47be-4b09-9c03-a484d5365cfe
 */
export function TermlyEmbed({
  policyId,
  websiteId,
}: {
  policyId: string;
  websiteId: string;
}) {
  useEffect(() => {
    // Inject the Termly embed script once
    if (!document.getElementById("termly-jssdk")) {
      const script = document.createElement("script");
      script.id = "termly-jssdk";
      script.src = "https://app.termly.io/embed.min.js";
      script.setAttribute("data-auto-block", "off");
      script.setAttribute("data-website-uuid", websiteId);
      document.head.appendChild(script);
    }
  }, [websiteId]);

  return (
    <div
      // Termly's embed script queries for this non-standard attribute
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error name is required by Termly's embed script
      name="termly-embed"
      data-id={policyId}
      data-type="iframe"
    />
  );
}
