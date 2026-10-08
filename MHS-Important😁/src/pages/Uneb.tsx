import { motion } from "framer-motion";
import { Activity, Database, FileCheck2, Fingerprint, Lock, QrCode, ScanSearch, ShieldCheck } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { FeatureRow, IconGrid, Steps } from "../components/ui/Blocks";
import { Container, LinkButton, Section, SectionHeading } from "../components/ui/Primitives";
import { Item, Stagger, scaleIn } from "../components/ui/Reveal";
import { CTA } from "../components/sections/CTA";

function Certificate() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-7 text-white shadow-2xl"
    >
      <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300">Verified certificate</p>
          <p className="mt-2 font-display text-2xl font-bold">Uganda Certificate of Education</p>
          <p className="mt-1 text-sm text-slate-300">Nakato Priscilla · Mengo Senior School</p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ink-900">
          <QrCode className="h-7 w-7" />
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-slate-400">Result</dt>
          <dd className="font-semibold">Division 1 · Agg. 12</dd>
        </div>
        <div>
          <dt className="text-slate-400">Issued</dt>
          <dd className="font-semibold">Jan 2026</dd>
        </div>
        <div>
          <dt className="text-slate-400">Hash</dt>
          <dd className="font-mono text-xs">9f3a…c21e</dd>
        </div>
      </dl>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint-400/15 px-3.5 py-1.5 text-xs font-semibold text-mint-300"
      >
        <ShieldCheck className="h-4 w-4" /> Verified in 1.8s · Signature valid
      </motion.div>
    </motion.div>
  );
}

function ItemAnalysis() {
  const items = [
    { id: "Q7", diff: 0.42, disc: 0.61, flag: "Good" },
    { id: "Q12", diff: 0.91, disc: 0.12, flag: "Too easy" },
    { id: "Q18", diff: 0.23, disc: 0.55, flag: "Hard, fair" },
    { id: "Q23", diff: 0.48, disc: -0.08, flag: "Review" },
  ];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold text-slate-900">Item analysis · UACE Chemistry P2</p>
        <span className="rounded-full bg-mint-500/10 px-2.5 py-1 text-xs font-semibold text-mint-700">KR-20 · 0.87</span>
      </div>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="pb-2 font-medium">Item</th>
            <th className="pb-2 font-medium">Difficulty</th>
            <th className="pb-2 font-medium">Discrimination</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((it, i) => (
            <motion.tr key={it.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 * i }}>
              <td className="py-2.5 font-semibold text-slate-900">{it.id}</td>
              <td className="py-2.5 text-slate-700">{it.diff.toFixed(2)}</td>
              <td className={`py-2.5 ${it.disc < 0.2 ? "text-rose-600" : "text-slate-700"}`}>{it.disc.toFixed(2)}</td>
              <td className="py-2.5">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${it.flag === "Review" ? "bg-rose-50 text-rose-700" : it.flag === "Too easy" ? "bg-gold-400/15 text-amber-700" : "bg-mint-500/10 text-mint-700"}`}>{it.flag}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Uneb() {
  return (
    <>
      <PageHero
        dark
        eyebrow="For UNEB, examiners & assessment bodies"
        title={
          <>
            Assessment integrity <span className="shimmer-text animate-shimmer">at national scale</span>.
          </>
        }
        description="Secure exam delivery, rigorous psychometrics and tamper-proof certification — infrastructure for continuous assessment under Uganda's competency-based curriculum."
        actions={
          <>
            <LinkButton to="about" anchor="contact" size="lg" icon>
              Request a briefing
            </LinkButton>
            <LinkButton to="features" variant="outline-dark" size="lg">
              Technical overview
            </LinkButton>
          </>
        }
        aside={<Certificate />}
      />

      <Section className="bg-white">
        <Container>
          <SectionHeading
            eyebrow="Pillars"
            title={
              <>
                Three guarantees every <span className="text-gradient">national exam</span> needs.
              </>
            }
          />
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3" delay={0.1}>
            {[
              { icon: Lock, t: "Security", d: "End-to-end encrypted sessions, device attestation, randomised item order and proctoring signals (focus loss, paste events, timing anomalies)." },
              { icon: ScanSearch, t: "Validity", d: "Classical test theory and IRT-ready item statistics, reliability coefficients and distractor analysis — on every paper, automatically." },
              { icon: Fingerprint, t: "Verifiability", d: "Cryptographically signed results and QR-verifiable certificates that any university, employer or embassy can check in seconds." },
            ].map((p) => (
              <Item key={p.t} variants={scaleIn}>
                <motion.div whileHover={{ y: -5 }} className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-500/10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-900 text-white">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-900">{p.t}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{p.d}</p>
                </motion.div>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section className="bg-slate-50/70">
        <Container className="space-y-28">
          <FeatureRow
            eyebrow="Psychometrics"
            title="Every item, statistically accountable."
            description="Difficulty, discrimination, reliability and distractor performance are computed the moment scripts are marked — flagging weak items before they distort a cohort's results."
            bullets={["Difficulty & discrimination indices", "KR-20 / Cronbach's α reliability", "Distractor analysis for MCQs", "Exportable to CSV & SPSS"]}
            visual={<ItemAnalysis />}
          />
          <FeatureRow
            reverse
            eyebrow="Continuous assessment"
            title="A CA pipeline schools can actually run."
            description="Capture project work, practicals and generic-skills rubrics term by term. Scores flow securely to the examining body with full audit trails — no spreadsheets emailed around."
            bullets={["Rubric-based scoring for CBC", "Term-by-term score locking & audit logs", "Moderation workflows across schools", "Secure API submission to UNEB systems"]}
            visual={
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Database, k: "Item bank", v: "38,412 items" },
                  { icon: Activity, k: "Uptime (12 mo)", v: "99.96%" },
                  { icon: FileCheck2, k: "Scripts auto-marked", v: "2.1M" },
                  { icon: QrCode, k: "Certs verified", v: "310k" },
                ].map((s, i) => (
                  <motion.div
                    key={s.k}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <s.icon className="h-5 w-5 text-brand-600" />
                    <p className="mt-3 font-display text-2xl font-bold text-slate-900">{s.v}</p>
                    <p className="text-xs text-slate-500">{s.k}</p>
                  </motion.div>
                ))}
              </div>
            }
          />
        </Container>
      </Section>

      <IconGrid
        eyebrow="Compliance"
        title="Designed for public trust."
        cols={4}
        items={[
          { icon: Lock, title: "Encryption", desc: "TLS in transit, AES-256 at rest, hashed credentials." },
          { icon: Fingerprint, title: "Audit trails", desc: "Immutable logs for every score change and access." },
          { icon: ShieldCheck, title: "Data residency", desc: "Deployable in Uganda-based data centres or on-premise." },
          { icon: Database, title: "Open standards", desc: "QTI item import, CSV/JSON export, documented REST APIs." },
        ]}
      />

      <Steps
        dark
        eyebrow="Engagement"
        title="From pilot to national rollout."
        steps={[
          { title: "Discovery", desc: "Map your assessment workflows and integration points." },
          { title: "Pilot", desc: "Run a controlled CA or mock cycle with selected schools." },
          { title: "Validate", desc: "Review psychometrics, security audits and stakeholder feedback." },
          { title: "Scale", desc: "Roll out region by region with training and support." },
        ]}
      />

      <CTA />
    </>
  );
}
