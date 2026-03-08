/**
 * HelixFlow Homepage
 * ─────────────────────────────────────────────────────────────
 * Root page composition — assembles all 9 sections in order.
 *
 * Section order:
 *   1.  Hero              — #hero
 *   2.  LifecycleRibbon   — #lifecycle
 *   3.  ModuleGrid        — #modules
 *   4.  StickyStoryboard  — #storyboard
 *   5.  AudienceFit       — #audience-fit
 *   6.  ArticlePreviews   — #insights
 *   7.  FAQ               — #faq
 *   8.  RoadmapStatus     — #roadmap-status
 *   9.  CTABanner         — #cta
 *
 * Layout rules:
 *   - <main> is the scroll container — no overflow-hidden on body
 *   - bg-[#060D1A] is set globally via globals.css on html/body
 *   - Each section owns its own vertical padding and bottom fade
 *   - Navbar is sticky top-0 z-50 — sections scroll beneath it
 *   - SiteFooter closes the page with legal + nav links
 *
 * Server component — no "use client" needed at this level.
 * All interactivity is encapsulated inside each section file.
 */

import Hero from "@/components/sections/Hero";
import LifecycleRibbon from "@/components/sections/LifecycleRibbon";
import ModuleGrid from "@/components/sections/ModuleGrid";
import StickyStoryboard from "@/components/sections/StickyStoryboard";
import AudienceFit from "@/components/sections/AudienceFit";
import ArticlePreviews from "@/components/sections/ArticlePreviews";
import FAQ from "@/components/sections/FAQ";
import RoadmapStatus from "@/components/sections/RoadmapStatus";
import CTABanner from "@/components/sections/CTABanner";
import Navbar from "@/components/sections/Navbar";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LifecycleRibbon />
        <ModuleGrid />
        <StickyStoryboard />
        <AudienceFit />
        <ArticlePreviews />
        <FAQ />
        <RoadmapStatus />
        <CTABanner />
      </main>
      <SiteFooter />
    </>
  );
}
