import { say } from "../common";
import { PLAN_COPY, getPlan, type Plan, type SessionPlanId } from "../plans";
import type { ProgramLang } from "../types";
import { Tick } from "./SharedBlocks";

// Plan cards (owner's plans brief, Nov 2026): name, fee, per-session fee,
// what's included and "Choose this plan". Core is marked "Most chosen"
// wherever it appears.

export const chooseButtonClass = (highlight: boolean): string =>
  `inline-flex min-h-12 w-full items-center justify-center rounded-[10px] px-5 py-3 text-[17px] font-extrabold ${
    highlight ? "bg-[#F2A93B] text-[#0E1B2C] hover:bg-[#E39A2A]" : "bg-[#0E1B2C] text-white hover:bg-[#1c2d45]"
  }`;

function PlanCard({ plan, lang, choose }: { plan: Plan; lang: ProgramLang; choose: React.ReactNode }): React.JSX.Element {
  const hl = plan.mostChosen;
  return (
    <div className={`relative flex flex-col gap-4 rounded-[18px] bg-white p-6 ${hl ? "border-[3px] border-[#F2A93B] shadow-[0_18px_40px_-22px_rgba(14,27,44,0.5)]" : "border-[1.5px] border-[#E3E6EC]"}`} data-plan-card={plan.id}>
      {hl && (
        <span className="absolute -top-3.5 left-6 rounded-full bg-[#F2A93B] px-3 py-1 text-[13px] font-extrabold text-[#0E1B2C]" data-most-chosen>
          {say(PLAN_COPY.mostChosen, lang)}
        </span>
      )}
      <p className="text-[21px] font-extrabold leading-[1.25] text-[#0E1B2C]">{say(plan.name, lang)}</p>
      <div>
        <p className="text-[36px] font-extrabold leading-none text-[#0E1B2C]" data-plan-fee>
          {plan.fee}
        </p>
        <p className="mt-1.5 text-[15px] font-semibold text-[#4A5568]" data-plan-per-session>
          {say(PLAN_COPY.perSession(plan.perSession), lang)}
        </p>
      </div>
      <ul className="flex flex-col gap-2 border-t border-[#E3E6EC] pt-4">
        {plan.includes.map((item) => (
          <li key={item.en} className="flex gap-2.5 text-[17px] text-[#0E1B2C]">
            <Tick color="#1F3A8A" />
            {say(item, lang)}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2">{choose}</div>
    </div>
  );
}

/** A row of plan cards; `choose` renders each card's button (hub: pre-selects in the form; program page: link to it). */
export function PlanCards({ plans, lang, choose }: { plans: readonly SessionPlanId[]; lang: ProgramLang; choose: (plan: Plan) => React.ReactNode }): React.JSX.Element {
  const cols = plans.length === 2 ? "md:grid-cols-2 md:max-w-[780px]" : plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 items-stretch gap-x-5 gap-y-7 pt-3.5 ${cols}`} data-plan-cards>
      {plans.map((id) => {
        const plan = getPlan(id);
        return <PlanCard key={id} plan={plan} lang={lang} choose={choose(plan)} />;
      })}
    </div>
  );
}
