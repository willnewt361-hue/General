import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, CalendarCheck, Flame, Headphones, Trophy, Users, WifiOff } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { FeatureRow, Frame, IconGrid, Steps } from "../components/ui/Blocks";
import { Container, LinkButton, Section } from "../components/ui/Primitives";
import { CTA } from "../components/sections/CTA";
import { Testimonials } from "../components/sections/Testimonials";

function PlannerCard() {
  const items = [
    { t: "Chemistry · Esterification", d: "25 min", done: true },
    { t: "Maths · Quadratic inequalities", d: "30 min", done: true },
    { t: "History · Buganda Agreement", d: "20 min", done: false },
    { t: "Mock UCE Physics P1", d: "1 hr 30", done: false },
  ];
  return (
    <div className="glass-dark rounded-3xl border border-white/10 p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Today's plan</p>
          <p className="font-display text-xl font-bold">Thursday · 4 tasks</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-300">
          <Flame className="h-3.5 w-3.5" /> 21-day streak
        </span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((it, i) => (
          <motion.li
            key={it.t}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3 text-sm"
          >
            <span className={`grid h-5 w-5 place-items-center rounded-full border ${it.done ? "border-mint-400 bg-mint-400 text-ink-900" : "border-white/30"}`}>
              {it.done && (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 6l3 3 5-6" />
                </svg>
              )}
            </span>
            <span className={`flex-1 ${it.done ? "text-slate-400 line-through" : ""}`}>{it.t}</span>
            <span className="text-xs text-slate-400">{it.d}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 1, duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400" />
      </div>
      <p className="mt-2 text-xs text-slate-400">50% done · UNEB readiness 91%</p>
    </div>
  );
}

function TutorChat() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-mint-500 text-white">
          <BrainCircuit className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-900">MHS Tutor</p>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-mint-600">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-500" /> Online
        </span>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-white">
          Why does the Buganda Agreement of 1900 matter for UCE?
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-slate-700">
          Great question. Examiners usually test three angles: <b>land</b> (mailo vs crown), <b>taxation</b> (hut &amp; gun tax) and <b>governance</b> (Kabaka's reduced powers). Want a 6-point essay skeleton you can adapt in 5 minutes?
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex gap-2">
          {["Yes, skeleton", "Quiz me", "Explain in Luganda"].map((c) => (
            <span key={c} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {c}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function Learners() {
  return (
    <>
      <PageHero
        eyebrow="For learners · S.1 – S.6"
        title={
          <>
            Study smarter. Score higher. <span className="text-gradient">Own your results.</span>
          </>
        }
        description="Mengo Hub gives you a personal tutor, a revision coach and every UNEB past paper — in your pocket, even offline. Built with students at Mengo Senior School who wanted more than notes."
        actions={
          <>
            <LinkButton to="signup" size="lg" icon>
              Create free account
            </LinkButton>
            <LinkButton to="home" anchor="showcase" variant="ghost" size="lg">
              Watch the tour
            </LinkButton>
          </>
        }
        aside={
          <div className="relative">
            <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/20 to-mint-500/20 blur-3xl" />
            <PlannerCard />
          </div>
        }
      />

      <IconGrid
        eyebrow="Your toolkit"
        title={
          <>
            Everything a serious student needs — <span className="text-gradient">nothing you don't</span>.
          </>
        }
        cols={4}
        items={[
          { icon: BrainCircuit, title: "AI tutor 24/7", desc: "Ask anything, any subject. Step-by-step explanations in English or Luganda." },
          { icon: BookOpen, title: "38k+ past papers", desc: "Every UCE & UACE paper, sorted by topic, with examiner-style marking guides." },
          { icon: CalendarCheck, title: "Revision planner", desc: "A daily plan that adapts to your weak topics and your exam calendar." },
          { icon: Trophy, title: "Streaks & leagues", desc: "Compete with your house, class or the whole school. Consistency wins." },
          { icon: Headphones, title: "Audio lessons", desc: "Listen to summarised notes on the way to school or in the dorm." },
          { icon: WifiOff, title: "Offline mode", desc: "Download on Wi-Fi, revise anywhere. Sync when you're back online." },
          { icon: Users, title: "Study groups", desc: "Subject rooms moderated by teachers. Ask peers, share resources." },
          { icon: Flame, title: "Exam predictor", desc: "See which topics are most likely this year and prioritise your time." },
        ]}
      />

      <Section className="bg-slate-50/70">
        <Container className="space-y-28">
          <FeatureRow
            eyebrow="AI tutor"
            title="Like having the best teacher in school on speed-dial."
            description="Stuck on a Physics derivation at 10pm? The MHS tutor explains it, quizzes you, and links the exact past-paper questions where it appeared."
            bullets={["Explains in English or Luganda", "Cites the syllabus & past papers", "Voice mode for hands-free revision", "Never gives you the answer to graded work"]}
            visual={<TutorChat />}
          />
          <FeatureRow
            reverse
            eyebrow="Mock exams"
            title="Sit the exam before the exam."
            description="Timed papers that look and feel like the real thing, auto-marked with UNEB grading scales. Get your Division estimate the moment you submit."
            bullets={["Real exam timing & layout", "Instant scores with worked solutions", "Division & grade forecasts", "Weak-topic drill decks generated automatically"]}
            visual={<Frame src="images/dashboard.png" alt="Progress dashboard with subject scores" className="aspect-[16/10]" />}
          />
          <FeatureRow
            eyebrow="Community"
            title="Learn together — even from different dorms."
            description="Moderated subject rooms, house leaderboards and study challenges keep motivation high all term long."
            bullets={["Teacher-moderated rooms", "House & class leaderboards", "Weekly study challenges", "Safe, school-only community"]}
            visual={<Frame src="images/students.jpg" alt="Students studying together" className="aspect-[4/3]" />}
          />
        </Container>
      </Section>

      <Steps
        dark
        eyebrow="Getting started"
        title="From sign-up to Division 1 in four steps."
        steps={[
          { title: "Create your account", desc: "Use your school ID or a phone number. Takes under a minute." },
          { title: "Pick your subjects", desc: "Choose your combination and exam year — MHS builds your plan." },
          { title: "Revise daily", desc: "Follow the planner, ask the tutor, keep the streak alive." },
          { title: "Sit mocks & improve", desc: "Watch your UNEB readiness climb week after week." },
        ]}
      />

      <Testimonials />
      <CTA />
    </>
  );
}
