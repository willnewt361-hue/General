import { Hero } from "../components/sections/Hero";
import { SocialProof } from "../components/sections/SocialProof";
import { Features } from "../components/sections/Features";
import { Showcase } from "../components/sections/Showcase";
import { Benefits } from "../components/sections/Benefits";
import { Testimonials } from "../components/sections/Testimonials";
import { Pricing } from "../components/sections/Pricing";
import { FAQ, faqs } from "../components/sections/FAQ";
import { CTA } from "../components/sections/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <Showcase />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ items={faqs.slice(0, 5)} />
      <CTA />
    </>
  );
}
