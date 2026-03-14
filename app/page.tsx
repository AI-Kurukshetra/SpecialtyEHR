import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  Camera,
  ChartNoAxesCombined,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";

const specialties = [
  {
    title: "Dermatology",
    description: "Image-first workflows, lesion tracking, and outcome timelines designed for high-photo-volume practices.",
    icon: Camera
  },
  {
    title: "Ophthalmology",
    description: "Integrated imaging context and procedure-ready charting built around complex diagnostic pathways.",
    icon: Microscope
  },
  {
    title: "Plastic Surgery",
    description: "Before/after journey mapping, procedure planning support, and consent-centric clinical records.",
    icon: Sparkles
  }
];

const platformPillars = [
  {
    title: "Specialty Templates",
    copy: "Purpose-built clinical documentation and procedure notes for each specialty.",
    icon: Stethoscope
  },
  {
    title: "AI Diagnostic Assist",
    copy: "Decision support for risk detection, care recommendations, and workflow prioritization.",
    icon: BrainCircuit
  },
  {
    title: "Imaging + Procedure Hub",
    copy: "Store and compare photos/scans alongside encounters, procedures, and recovery milestones.",
    icon: Activity
  },
  {
    title: "Revenue + Claims Engine",
    copy: "Specialty CPT coding, authorization tracking, and billing visibility in one system.",
    icon: ChartNoAxesCombined
  }
];

const highlights = [
  "Multi-location access with role-based permissions",
  "Patient portal with secure messaging and appointments",
  "Built-in scheduling for providers, procedures, and equipment",
  "Quality reporting and practice analytics dashboards"
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main id="top" className="landing-page">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="landing-glow landing-glow-top" />
          <div className="landing-glow landing-glow-bottom" />
          <div className="relative z-10 max-w-5xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              <ShieldCheck className="h-4 w-4" />
              Specialty Clinical Operations Platform
            </div>
            <div className="space-y-5">
              <h1 className="landing-hero-title max-w-4xl text-balance">
                Next-generation EHR for high-performance specialty practices
              </h1>
              <p className="landing-hero-copy max-w-3xl text-balance">
                Built for dermatology, ophthalmology, and plastic surgery teams that need faster documentation, richer imaging,
                smarter decision support, and cleaner revenue workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Button asChild size="lg" className="landing-primary-btn">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="landing-primary-btn">
                  <Link href="/login">
                    Request early access
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="landing-secondary-btn">
                <Link href="#platform">Explore platform</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-4 text-sm text-white/90 sm:grid-cols-3">
              <div className="landing-stat-card">
                <p className="landing-stat-value">&lt; 3 min</p>
                <p className="landing-stat-label">Average patient intake flow</p>
              </div>
              <div className="landing-stat-card">
                <p className="landing-stat-value">98.9%</p>
                <p className="landing-stat-label">Claim-ready documentation accuracy</p>
              </div>
              <div className="landing-stat-card">
                <p className="landing-stat-value">24/7</p>
                <p className="landing-stat-label">Patient access through secure portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {specialties.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="landing-card animate-fade-in-up"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <Icon className="mb-4 h-6 w-6 text-primary" />
                <h2 className="landing-card-title">{item.title}</h2>
                <p className="landing-card-copy">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="platform" className="container mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <CalendarClock className="h-6 w-6 text-primary" />
          <h2 className="landing-section-title">Core Platform Pillars</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {platformPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="landing-panel animate-fade-in-up" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="flex items-start gap-4">
                  <span className="landing-icon-wrap">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <h3 className="landing-panel-title">{item.title}</h3>
                    <p className="landing-panel-copy">{item.copy}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="landing-split-panel">
          <div className="space-y-4">
            <h2 className="landing-section-title">What makes it different from legacy EHRs</h2>
            <p className="landing-muted">
              The blueprint emphasizes modern UX, AI capabilities, and seamless integrations. This product is designed to reduce
              friction for both clinical and operational teams.
            </p>
          </div>
          <ul className="grid gap-3">
            {highlights.map((item) => (
              <li key={item} className="landing-list-item">
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16 pt-10 md:pb-24">
        <div className="landing-cta animate-fade-in-up">
          <h2 className="landing-section-title">Start with dermatology MVP. Expand by specialty.</h2>
          <p className="landing-muted max-w-2xl">
            Launch fast with patient management, scheduling, clinical documentation, imaging, and billing. Add advanced AI
            modules, telehealth, and predictive analytics as your practice grows.
          </p>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <Button asChild size="lg" className="landing-primary-btn">
                <Link href="/dashboard">Continue to workspace</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="landing-primary-btn">
                <Link href="/login">Get started</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="landing-secondary-btn">
              <Link href="#top">Back to top</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
