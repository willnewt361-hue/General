import { Check, Minus } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { Pricing } from "../components/sections/Pricing";
import { FAQ } from "../components/sections/FAQ";
import { CTA } from "../components/sections/CTA";
import { Container, Section, SectionHeading } from "../components/ui/Primitives";
import { Reveal } from "../components/ui/Reveal";

const rows: { f: string; a: boolean | string; b: boolean | string; c: boolean | string }[] = [
  { f: "UNEB past-paper bank", a: true, b: true, c: true },
  { f: "AI tutor", a: "50 / day", b: "Unlimited", c: "Unlimited" },
  { f: "Exam Predictor", a: false, b: true, c: true },
  { f: "Timed mock exams (auto-marked)", a: "2 / month", b: "Unlimited", c: "Unlimited" },
  { f: "Offline notes & audio", a: true, b: true, c: true },
  { f: "Verified certificates", a: false, b: true, c: true },
  { f: "Teacher dashboards & analytics", a: false, b: false, c: true },
  { f: "Report cards, SMS & automations", a: false, b: false, c: true },
  { f: "Fees & Mobile Money collection", a: false, b: false, c: true },
  { f: "Self-hosting option", a: false, b: false, c: true },
  { f: "Support", a: "Community", b: "WhatsApp priority", c: "Dedicated manager" },
];

const Cell = ({ v }: { v: boolean | string }) =>
  typeof v === "string" ? (
    <span className="text-sm font-medium text-slate-700">{v}</span>
  ) : v ? (
    <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-mint-500/15 text-mint-600">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  ) : (
    <Minus className="mx-auto h-4 w-4 text-slate-300" />
  );

const pricingFaqs = [
  { q: "Can students pay monthly with Mobile Money?", a: "Yes. Learner Plus is UGX 15,000/month or UGX 12,000/month billed yearly, payable via MTN MoMo or Airtel Money. You'll receive an SMS receipt instantly." },
  { q: "How is the School plan priced?", a: "Per school, based on enrolment band — never per student. That means adding more learners never increases your bill mid-year. Contact us for a quote." },
  { q: "Is there a discount for government-aided schools?", a: "Yes. We offer subsidised School plans for USE/UPOLET schools and bursary-funded Learner Plus seats. Ask us." },
  { q: "What happens if I cancel?", a: "You drop back to the free Learner plan. Your notes, progress and certificates remain accessible — certificates are permanently verifiable." },
];

export function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Simple plans, <span className="text-gradient">Ugandan prices</span>.
          </>
        }
        description="Free for every learner. Affordable premium for those who want the edge. Fair, per-school pricing for institutions."
      />
      <Pricing standalone />

      <Section className="bg-white">
        <Container>
          <SectionHeading eyebrow="Compare" title="What's in each plan" />
          <Reveal className="mt-12 overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-900">
                    Feature
                  </th>
                  {["Learner", "Learner Plus", "School"].map((p) => (
                    <th key={p} scope="col" className="px-6 py-4 text-center font-display text-sm font-semibold text-slate-900">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.f} className="transition hover:bg-brand-50/40">
                    <th scope="row" className="px-6 py-4 text-sm font-medium text-slate-700">
                      {r.f}
                    </th>
                    <td className="px-6 py-4 text-center">
                      <Cell v={r.a} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell v={r.b} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell v={r.c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </Section>

      <FAQ items={pricingFaqs} />
      <CTA />
    </>
  );
}
