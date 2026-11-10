"use client";

import { useEffect } from "react";
import { trackChoosePlan, trackViewContent } from "@/lib/analytics/conversions";

// Conversion events for the Personal Sessions pages (owner's conversion brief).

/** ViewContent on every program page, with the program name. */
export function ProgramViewContent({ name }: { name: string }): null {
  useEffect(() => trackViewContent(name), [name]);
  return null;
}

/** "Choose this plan" on a program page: InitiateCheckout with the plan, then on to the enquiry form. */
export function ChoosePlanLink({ href, planName, feeInr, className, planId, children }: { href: string; planName: string; feeInr: number; className: string; planId: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <a href={href} onClick={() => trackChoosePlan(planName, feeInr)} className={className} data-choose-plan={planId}>
      {children}
    </a>
  );
}
