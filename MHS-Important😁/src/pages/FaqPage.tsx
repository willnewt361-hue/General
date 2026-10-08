import { MessageCircle, Mail } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { FAQ, faqs } from "../components/sections/FAQ";
import { CTA } from "../components/sections/CTA";
import { Container, LinkButton } from "../components/ui/Primitives";
import { Reveal } from "../components/ui/Reveal";

const more = [
  { q: "Which subjects are covered?", a: "All UCE and UACE subjects offered at Mengo SS and most Ugandan schools: Mathematics, Physics, Chemistry, Biology, English, Literature, History, Geography, CRE/IRE, Economics, Entrepreneurship, Agriculture, ICT, Kiswahili, Luganda and more. New subjects are added on request." },
  { q: "Can parents get access?", a: "Yes. Parents receive a guardian login that shows attendance, results and weekly progress summaries — read-only, and only for their own children." },
  { q: "Does MHS replace teachers?", a: "Never. MHS handles the repetitive work (marking, tracking, reminders) so teachers spend more time on what only they can do: explaining, mentoring and inspiring." },
  { q: "What devices are supported?", a: "Any modern browser on desktop or mobile, plus an Android app (PWA) that works offline. iOS is supported through the web app." },
];

export function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title={
          <>
            Frequently asked <span className="text-gradient">questions</span>.
          </>
        }
        description="Straight answers for learners, parents, teachers and school leaders."
      />
      <FAQ items={[...faqs, ...more]} standalone />
      <section className="bg-slate-50/70 py-20">
        <Container>
          <Reveal className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Still have a question?</h2>
            <p className="mt-3 text-slate-600">Our team (and a few very helpful S.6 ambassadors) answer within a school day.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton to="about" anchor="contact" icon>
                <MessageCircle className="h-4 w-4" /> Contact us
              </LinkButton>
              <a href="mailto:hello@mengohub.ug" className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                <Mail className="h-4 w-4" /> hello@mengohub.ug
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
      <CTA />
    </>
  );
}
