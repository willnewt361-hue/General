import { motion } from "framer-motion";
import { Container, ExternalButton, LinkButton } from "../ui/Primitives";
import { Reveal } from "../ui/Reveal";
import { GITHUB_URL } from "../layout/Navbar";
import { Github } from "../ui/GithubIcon";

export function CTA() {
  return (
    <section className="relative bg-white px-5 pb-24 pt-8 sm:px-8 sm:pb-32">
      <Container>
        <Reveal amount={0.3}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 px-6 py-20 text-center text-white shadow-2xl shadow-brand-900/30 noise sm:px-12 sm:py-28">
            <div
              aria-hidden
              className="absolute inset-0 animate-gradient bg-[linear-gradient(120deg,rgba(79,70,229,0.55),rgba(16,185,129,0.35),rgba(245,158,11,0.25),rgba(79,70,229,0.55))] bg-[length:300%_300%] opacity-70"
            />
            <div aria-hidden className="absolute inset-0 grid-pattern-dark [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10 [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />
            <motion.div
              aria-hidden
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full border border-white/10 [mask-image:linear-gradient(to_top,black,transparent)]"
            />

            <div className="relative mx-auto max-w-3xl">
              <Reveal delay={0.1}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Ready when you are</p>
              </Reveal>
              <Reveal delay={0.18}>
                <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  Give every learner at Mengo — and beyond — an unfair advantage.
                </h2>
              </Reveal>
              <Reveal delay={0.26}>
                <p className="mx-auto mt-6 max-w-xl text-lg text-slate-200">
                  Join thousands of students and teachers already learning smarter. Free to start, minutes to set up.
                </p>
              </Reveal>
              <Reveal delay={0.34} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <LinkButton to="signup" variant="white" size="lg" icon className="w-full sm:w-auto">
                  Get started free
                </LinkButton>
                <ExternalButton href={GITHUB_URL} variant="outline-dark" size="lg" className="w-full sm:w-auto">
                  <Github className="h-4 w-4" /> Star on GitHub
                </ExternalButton>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="mt-6 text-xs text-slate-400">No credit card · Cancel anytime · Apache-2.0 open source</p>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
