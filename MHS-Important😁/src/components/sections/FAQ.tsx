import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Container, Section, SectionHeading } from "../ui/Primitives";
import { Item, Stagger } from "../ui/Reveal";

export const faqs = [
  {
    q: "Is Mengo Hub System only for Mengo Senior School?",
    a: "No. MHS was born at Mengo SS, but it's built for any secondary school in Uganda (and beyond). Schools can sign up independently, and individual learners anywhere can use the free Learner plan.",
  },
  {
    q: "Is it really free for students?",
    a: "Yes. The Learner plan is free forever and includes the full past-paper bank, daily AI tutor allowance, revision planner and offline notes. Learner Plus adds unlimited AI, the Exam Predictor and unlimited mock exams.",
  },
  {
    q: "How does the Exam Predictor work? Is it cheating?",
    a: "The predictor is a machine-learning model trained on decades of UNEB past papers. It analyses topic frequency, cycles and syllabus weighting to suggest which topics deserve the most revision time. It does not leak exam content — it simply helps you prioritise, exactly like an experienced teacher would.",
  },
  {
    q: "Does it work without internet?",
    a: "Mostly, yes. Notes, past papers and downloaded audio lessons work fully offline on the mobile app. The AI tutor, live chat and syncing need a connection — and we've optimised heavily for slow networks.",
  },
  {
    q: "How do schools pay?",
    a: "Schools can pay by MTN Mobile Money, Airtel Money, bank transfer or invoice. Learner Plus subscriptions are paid via Mobile Money with automatic receipts. Pricing is per school, not per student, so class size never penalises you.",
  },
  {
    q: "Is MHS aligned with UNEB and the new lower-secondary curriculum?",
    a: "Yes. Assessments use UNEB grading scales and the platform supports continuous assessment (CA) scoring, project-based tasks and generic-skills rubrics required by the NCDC competency-based curriculum.",
  },
  {
    q: "Can we self-host it? Who owns the data?",
    a: "Absolutely. MHS is open source under Apache-2.0 on GitHub — you can self-host on your own server or use our managed cloud. Either way, your school owns its data and can export it at any time.",
  },
  {
    q: "How is student data protected?",
    a: "Role-based access control, encrypted records, hashed credentials, audit logs, and hosting that follows Uganda's Data Protection and Privacy Act principles. Teachers only see their classes; parents only see their children.",
  },
];

export function FAQ({ items = faqs, standalone }: { items?: typeof faqs; standalone?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="bg-white">
      <Container>
        <div className={cn("grid gap-12", !standalone && "lg:grid-cols-12")}>
          <div className={cn(!standalone && "lg:col-span-5")}>
            <SectionHeading
              align={standalone ? "center" : "left"}
              eyebrow="FAQ"
              title={
                <>
                  Questions? <span className="text-gradient">Answered.</span>
                </>
              }
              description="Everything learners, parents and school leaders ask before switching to MHS. Still curious? Reach us on WhatsApp or email."
            />
          </div>
          <Stagger className={cn("divide-y divide-slate-200 border-y border-slate-200", !standalone && "lg:col-span-7", standalone && "mx-auto w-full max-w-3xl")} delay={0.05}>
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <Item key={f.q}>
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className={cn("font-display text-base font-semibold tracking-tight transition-colors sm:text-lg", isOpen ? "text-brand-600" : "text-slate-900 group-hover:text-brand-600")}>
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen ? "rotate-45 border-brand-500 bg-brand-500 text-white" : "border-slate-200 text-slate-500 group-hover:border-brand-300",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Item>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
