import { motion } from "framer-motion";
import { Fragment } from "react";
import { BarChart3, ClipboardCheck, FileSpreadsheet, LibraryBig, MessageSquare, Send, Sparkles, Timer } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { FeatureRow, Frame, IconGrid, Steps } from "../components/ui/Blocks";
import { Container, LinkButton, Section } from "../components/ui/Primitives";
import { CTA } from "../components/sections/CTA";

function Heatmap() {
  const topics = ["Vectors", "Matrices", "Probability", "Calculus", "Trig", "Statistics"];
  const streams = ["S.4 East", "S.4 West", "S.4 North"];
  const data = [
    [88, 62, 74, 41, 79, 90],
    [92, 58, 66, 38, 83, 87],
    [85, 71, 80, 52, 70, 93],
  ];
  const color = (v: number) => (v >= 80 ? "bg-mint-500" : v >= 65 ? "bg-mint-300" : v >= 50 ? "bg-gold-300" : "bg-rose-400");
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold text-slate-900">Topic mastery · Mathematics</p>
        <span className="text-xs text-slate-500">Term 2</span>
      </div>
      <div className="mt-5 grid grid-cols-[auto_repeat(6,1fr)] gap-1.5 text-[11px]">
        <span />
        {topics.map((t) => (
          <span key={t} className="truncate text-center text-slate-500">
            {t}
          </span>
        ))}
        {streams.map((s, r) => (
          <Fragment key={s}>
            <span className="pr-2 text-right font-medium text-slate-700">
              {s}
            </span>
            {data[r].map((v, c) => (
              <motion.span
                key={`${r}-${c}`}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (r * 6 + c) * 0.04 }}
                className={`grid aspect-square place-items-center rounded-md font-semibold text-white ${color(v)}`}
              >
                {v}
              </motion.span>
            ))}
          </Fragment>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
        className="mt-5 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-800"
      >
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          <b>Insight:</b> All three streams are below 55% on <b>Calculus</b>. Suggested: re-teach differentiation rules before the mid-term test. Tap to generate a 40-min lesson plan.
        </span>
      </motion.div>
    </div>
  );
}

function AutoMark() {
  const rows = [
    { n: "Kizza Emmanuel", s: 78, g: "B" },
    { n: "Nakato Priscilla", s: 91, g: "A" },
    { n: "Achan Deborah", s: 64, g: "C" },
    { n: "Mugisha Alex", s: 85, g: "A" },
  ];
  return (
    <div className="glass-dark rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Auto-marked</p>
          <p className="font-display text-xl font-bold">UCE Maths P1 · Mock 3</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-400/15 px-3 py-1 text-xs font-semibold text-mint-300">
          <Timer className="h-3.5 w-3.5" /> Marked in 4s
        </span>
      </div>
      <ul className="mt-5 divide-y divide-white/10 text-sm">
        {rows.map((r, i) => (
          <motion.li key={r.n} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 py-3">
            <span className="flex-1">{r.n}</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.s}%` }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }} className="h-full bg-gradient-to-r from-brand-400 to-mint-400" />
            </div>
            <span className="w-8 text-right tabular-nums">{r.s}</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-xs font-bold">{r.g}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs">
          <Send className="h-3 w-3" /> SMS parents
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs">
          <FileSpreadsheet className="h-3 w-3" /> Export CSV
        </span>
      </div>
    </div>
  );
}

export function Teachers() {
  return (
    <>
      <PageHero
        eyebrow="For teachers & heads of department"
        title={
          <>
            Spend your time teaching, <span className="text-gradient">not administrating</span>.
          </>
        }
        description="MHS marks the objective work, spots the gaps, drafts the report cards and messages the parents — so you can do the part only a teacher can."
        actions={
          <>
            <LinkButton to="about" anchor="contact" size="lg" icon>
              Book a school demo
            </LinkButton>
            <LinkButton to="features" variant="ghost" size="lg">
              See all features
            </LinkButton>
          </>
        }
        aside={
          <div className="relative">
            <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-mint-500/20 to-brand-500/20 blur-3xl" />
            <Heatmap />
          </div>
        }
      />

      <IconGrid
        eyebrow="Teacher toolkit"
        title={
          <>
            Built by teachers who were <span className="text-gradient">tired of Saturdays lost to marking</span>.
          </>
        }
        cols={4}
        items={[
          { icon: ClipboardCheck, title: "Auto-marking", desc: "Objective & structured questions marked instantly with UNEB scales. You review only the essays." },
          { icon: BarChart3, title: "Class analytics", desc: "Topic heatmaps per stream, at-risk learner alerts, and term-on-term trends." },
          { icon: LibraryBig, title: "Lesson library", desc: "NCDC-aligned lesson plans, slides and worksheets — share yours, adapt others'." },
          { icon: MessageSquare, title: "Parent messaging", desc: "One-click SMS/email for attendance, results and reminders via automations." },
        ]}
      />

      <Section className="bg-slate-50/70">
        <Container className="space-y-28">
          <FeatureRow
            eyebrow="Assessment"
            title="Set it in 3 minutes. Marked in 4 seconds."
            description="Pull questions from the bank by topic and difficulty, schedule the paper, and let MHS handle the marking, moderation and grade boundaries."
            bullets={["Question bank with 38k+ items", "Randomised versions to curb copying", "UNEB grading scales built-in", "Moderation & scaling tools"]}
            visual={<AutoMark />}
          />
          <FeatureRow
            reverse
            eyebrow="Insight"
            title="Know which stream is struggling — before the end-of-term shock."
            description="Real-time mastery data turns every lesson into a feedback loop. Re-teach the right topic to the right class at the right time."
            bullets={["At-risk learner alerts", "Topic mastery per class & stream", "AI lesson suggestions from data", "HoD dashboards across subjects"]}
            visual={<Frame src="images/teacher.jpg" alt="Teacher reviewing analytics on a tablet" className="aspect-[4/3]" />}
          />
        </Container>
      </Section>

      <Steps
        dark
        eyebrow="Rollout"
        title="Live in your staffroom in a day."
        steps={[
          { title: "Import classes", desc: "Upload your CSV of learners and streams. Accounts generated automatically." },
          { title: "Invite staff", desc: "Teachers join by link and are scoped to their own subjects and classes." },
          { title: "Set first assessment", desc: "Pick a paper from the bank or upload your own. Schedule it." },
          { title: "Read the insights", desc: "Results, heatmaps and parent messages — automatically." },
        ]}
      />

      <CTA />
    </>
  );
}
