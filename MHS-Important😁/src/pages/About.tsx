import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { Container, ExternalButton, Section, SectionHeading } from "../components/ui/Primitives";
import { Item, Reveal, Stagger } from "../components/ui/Reveal";
import { GITHUB_URL } from "../components/layout/Navbar";
import { Github } from "../components/ui/GithubIcon";
import { cn } from "../utils/cn";

const roadmap = [
  { q: "Shipped", items: ["AI tutor & WebSocket chat", "Assessment & auto-marking", "Exam predictor (ML)", "Analytics dashboards", "Certification service", "Mobile Money payments", "n8n automations", "Mobile scaffold & PWA"], state: "done" },
  { q: "In progress", items: ["Luganda voice tutor", "Offline-first Android app", "Parent portal v2", "CBC rubric builder"], state: "now" },
  { q: "Next", items: ["UNEB item-bank API", "Cross-school moderation", "Timetabling & attendance (biometric)", "Marketplace for lesson plans"], state: "next" },
];

const values = [
  { t: "Learners first", d: "If a feature doesn't help a student learn or a teacher teach, it doesn't ship." },
  { t: "Built for Uganda", d: "Low bandwidth, Mobile Money, UNEB alignment, local languages — not afterthoughts, but requirements." },
  { t: "Open by default", d: "Apache-2.0 on GitHub. Schools should own their software as much as their data." },
  { t: "Rigour over hype", d: "AI where it's useful, psychometrics where it matters, and honest numbers everywhere." },
];

export function About() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("sent"), 1200);
  };

  return (
    <>
      <PageHero
        dark
        eyebrow="About Mengo Hub System"
        title={
          <>
            Started in a Mengo classroom. <span className="shimmer-text animate-shimmer">Built for every school.</span>
          </>
        }
        description="MHS began as a student project to fix a simple problem: brilliant learners at Mengo Senior School were losing marks not for lack of ability, but for lack of tools. Today it's an open-source platform for the whole country."
        actions={
          <ExternalButton href={GITHUB_URL} variant="outline-dark" size="lg">
            <Github className="h-4 w-4" /> Read the source on GitHub
          </ExternalButton>
        }
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Our mission</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The best web school system in Uganda — for learners, teachers and UNEB alike.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                We believe the distance between a Division 3 and a Division 1 is often just feedback, focus and access. MHS closes that gap with an AI tutor that
                never sleeps, assessment that marks itself, and analytics that tell teachers exactly where to look.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                And because it's open source, no school is ever locked out by price or locked in by a vendor.
              </p>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2" delay={0.1}>
              {values.map((v) => (
                <Item key={v.t}>
                  <div className="h-full rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
                    <h3 className="font-display text-lg font-semibold text-slate-900">{v.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v.d}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      <Section id="roadmap" className="bg-slate-50/70">
        <div aria-hidden className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Roadmap" title="Where we're headed." description="Transparent by design. Track progress or contribute on GitHub." />
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3" delay={0.12}>
            {roadmap.map((col) => (
              <Item key={col.q}>
                <div className={cn("h-full rounded-3xl border p-7", col.state === "now" ? "border-brand-300 bg-white shadow-xl shadow-brand-500/10" : "border-slate-200 bg-white shadow-sm")}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-slate-900">{col.q}</h3>
                    {col.state === "now" && <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">2026</span>}
                  </div>
                  <ul className="mt-5 space-y-3">
                    {col.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                        {col.state === "done" ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
                        ) : col.state === "now" ? (
                          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-brand-500 [animation-duration:3s]" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                        )}
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section id="contact" className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading align="left" eyebrow="Contact" title="Bring MHS to your school." description="Tell us about your school and we'll set up a demo, a pilot, or just answer your questions." />
              <div className="mt-8 space-y-3 text-sm text-slate-600">
                <p>📍 Mengo Senior School Road, Kampala</p>
                <p>✉️ hello@mengohub.ug</p>
                <p>💬 WhatsApp: +256 700 000 000</p>
              </div>
            </div>
            <Reveal className="lg:col-span-7">
              <form onSubmit={submit} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="name" placeholder="Ssemakula Ronald" required />
                  <Field label="Email or phone" id="email" placeholder="you@school.ac.ug" required />
                  <Field label="School" id="school" placeholder="Mengo Senior School" />
                  <div>
                    <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">
                      I am a…
                    </label>
                    <select id="role" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10">
                      <option>Learner</option>
                      <option>Teacher</option>
                      <option>Head teacher / Administrator</option>
                      <option>Parent</option>
                      <option>Examination body / UNEB</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="msg" className="mb-1.5 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea id="msg" rows={4} placeholder="We'd like a demo for our S.4 and S.6 classes…" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">We reply within one school day.</p>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={state !== "idle"}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition disabled:opacity-80"
                  >
                    {state === "idle" && (
                      <>
                        Send message <Send className="h-4 w-4" />
                      </>
                    )}
                    {state === "sending" && (
                      <>
                        Sending <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    )}
                    {state === "sent" && (
                      <>
                        Sent! We'll be in touch <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Field({ label, id, placeholder, required }: { label: string; id: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
      />
    </div>
  );
}
