import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Container, Section, SectionHeading } from "../ui/Primitives";
import { Item, Stagger, scaleIn } from "../ui/Reveal";
import { cn } from "../../utils/cn";

const testimonials = [
  {
    name: "Nakato Priscilla",
    role: "S.6 Sciences · Mengo Senior School",
    quote: "The exam predictor flagged titration calculations two weeks before mocks. It came up. I walked into that Chemistry paper smiling.",
    initials: "NP",
    color: "from-brand-500 to-indigo-700",
    featured: true,
  },
  {
    name: "Mr. Ssemakula Ronald",
    role: "Head of Mathematics",
    quote: "I used to spend Saturdays marking. Now MHS marks the objective sections and shows me exactly which stream is struggling with vectors. My Saturdays are back.",
    initials: "SR",
    color: "from-mint-500 to-emerald-700",
  },
  {
    name: "Kizza Emmanuel",
    role: "S.4 · Boarding student",
    quote: "Wi-Fi in the dorm is bad. I download the week's notes at the lab and revise offline. Streaks keep me honest.",
    initials: "KE",
    color: "from-gold-400 to-orange-600",
  },
  {
    name: "Mrs. Namuli Grace",
    role: "Parent of two MHS learners",
    quote: "I get an SMS every Friday with their progress. No more waiting for end-of-term report cards to find out something's wrong.",
    initials: "NG",
    color: "from-fuchsia-500 to-purple-700",
  },
  {
    name: "Dr. Okello Peter",
    role: "Assessment specialist",
    quote: "The item analysis is genuinely rigorous — difficulty indices, discrimination, reliability. This is the CA tooling the new curriculum needs.",
    initials: "OP",
    color: "from-sky-500 to-blue-700",
  },
  {
    name: "Achan Deborah",
    role: "S.5 Arts · Debate captain",
    quote: "The AI tutor explains History essays like a patient teacher, not a search engine. My structure went from a C to an A in one term.",
    initials: "AD",
    color: "from-rose-500 to-red-700",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-white">
      <Container>
        <SectionHeading
          eyebrow="Loved in the classroom"
          title={
            <>
              Real stories from <span className="text-gradient">Mengo and beyond</span>.
            </>
          }
          description="Learners, teachers and parents on what changed when their school switched to MHS."
        />

        <Stagger className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5" delay={0.08}>
          {testimonials.map((t) => (
            <Item key={t.name} variants={scaleIn} className="break-inside-avoid">
              <motion.figure
                whileHover={{ y: -4 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border p-7 shadow-sm transition-shadow hover:shadow-xl",
                  t.featured
                    ? "border-transparent bg-gradient-to-br from-ink-900 via-ink-800 to-brand-700 text-white hover:shadow-brand-500/30"
                    : "border-slate-200/80 bg-white hover:shadow-slate-900/10",
                )}
              >
                <Quote className={cn("absolute right-6 top-6 h-10 w-10", t.featured ? "text-white/10" : "text-slate-100")} aria-hidden />
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <blockquote className={cn("mt-4 text-[15px] leading-relaxed", t.featured ? "text-slate-100 sm:text-lg" : "text-slate-700")}>
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md", t.color)}>
                    {t.initials}
                  </span>
                  <div>
                    <p className={cn("text-sm font-semibold", t.featured ? "text-white" : "text-slate-900")}>{t.name}</p>
                    <p className={cn("text-xs", t.featured ? "text-slate-300" : "text-slate-500")}>{t.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </Item>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
