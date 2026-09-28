import { organisationsWorkedWith } from "@/config/site.config";
import { Eyebrow } from "../ui";
import SiteTodo from "./SiteTodo";

// Companies, schools and institutions from site.config only — never typed
// on a page. Renders nothing on production while the list is empty.
export default function OrganisationsWorkedWith({ eyebrow }: { eyebrow: string }): React.JSX.Element | null {
  if (organisationsWorkedWith.length === 0) {
    return (
      <div className="mx-auto max-w-content px-4 py-6 sm:px-8">
        <SiteTodo>organisations / schools / companies list is empty in site.config (organisationsWorkedWith) — section hidden on production.</SiteTodo>
      </div>
    );
  }

  return (
    <section className="border-b border-line px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-content">
        <Eyebrow>{eyebrow}</Eyebrow>
        <ul className="mt-6 flex flex-wrap gap-3">
          {organisationsWorkedWith.map((name) => (
            <li key={name} className="rounded-sm border border-line-strong bg-panel2 px-4 py-2 text-[14px] font-semibold text-ink">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
