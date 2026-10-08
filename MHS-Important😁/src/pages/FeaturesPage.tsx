import { Bell, Building2, CreditCard, Server, ShieldCheck, UsersRound, Workflow, Gauge } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { IconGrid } from "../components/ui/Blocks";
import { Features } from "../components/sections/Features";
import { Container, LinkButton, Section, SectionHeading } from "../components/ui/Primitives";
import { Item, Stagger } from "../components/ui/Reveal";
import { CTA } from "../components/sections/CTA";

const stack = [
  { k: "Backend", v: "Python · Flask · WebSockets" },
  { k: "AI", v: "LLM tutor + scikit-learn exam predictor" },
  { k: "Data", v: "PostgreSQL / SQLite · CSV import" },
  { k: "Automations", v: "n8n workflows · Email · SMS" },
  { k: "Payments", v: "MTN MoMo · Airtel Money" },
  { k: "Deploy", v: "Nginx · systemd · Docker-ready" },
  { k: "Mobile", v: "PWA + native scaffold" },
  { k: "License", v: "Apache-2.0 · Open source" },
];

export function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform features"
        title={
          <>
            Every module. <span className="text-gradient">One connected hub.</span>
          </>
        }
        description="A complete tour of what ships in Mengo Hub System today — for learners, teachers, administrators and examination bodies."
        actions={
          <>
            <LinkButton to="pricing" size="lg" icon>
              See pricing
            </LinkButton>
            <LinkButton to="home" anchor="showcase" variant="ghost" size="lg">
              Product tour
            </LinkButton>
          </>
        }
      />

      <Features compact={false} />

      <IconGrid
        id="admin"
        eyebrow="For school administrators"
        title={
          <>
            Run the whole school from <span className="text-gradient">one dashboard</span>.
          </>
        }
        description="The admin service ties everything together — people, fees, communication and compliance."
        cols={4}
        items={[
          { icon: UsersRound, title: "People & roles", desc: "Learners, staff, parents and guardians with granular role-based permissions." },
          { icon: CreditCard, title: "Fees & payments", desc: "Invoices, Mobile Money collection, receipts and arrears reports." },
          { icon: Bell, title: "Communication", desc: "Announcements, SMS/email blasts, and automated parent updates." },
          { icon: Gauge, title: "School analytics", desc: "Attendance, performance and finance KPIs at a glance." },
          { icon: Workflow, title: "Automations", desc: "n8n-powered workflows: report cards, reminders, escalations." },
          { icon: ShieldCheck, title: "Security & audit", desc: "Password policies, audit logs and data export on demand." },
          { icon: Server, title: "Self-host or cloud", desc: "Run on your own server with Nginx & systemd, or let us host it." },
          { icon: Building2, title: "Multi-campus", desc: "Scalability service supports multiple campuses and streams." },
        ]}
      />

      <Section className="bg-ink-900 text-white noise">
        <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <Container className="relative">
          <SectionHeading
            dark
            eyebrow="Under the hood"
            title="Open, inspectable, extensible."
            description="MHS is built on boring, reliable technology — and every line is on GitHub."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" delay={0.06}>
            {stack.map((s) => (
              <Item key={s.k}>
                <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">{s.k}</p>
                  <p className="mt-2 font-display text-lg font-semibold">{s.v}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTA />
    </>
  );
}
