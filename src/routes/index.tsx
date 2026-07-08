import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

// Read business name for personalization
const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

function Home() {
  const businessName = Route.useLoaderData();
  const displayName = businessName || "ReviewDigest";

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            RD
          </div>
          <span className="text-lg font-bold text-gray-900">{displayName}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sign in
          </a>
          <a
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white pt-28 sm:pt-36">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 sm:pb-32 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              AI-powered review monitoring
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Stop hunting for feedback.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Let AI find it for you.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              ReviewDigest monitors your product reviews everywhere — G2,
              Capterra, App Store, Reddit, social media — and distills them into
              a single actionable weekly briefing. Surface urgent issues in real
              time and never miss what your users are saying.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="/dashboard"
                className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
              >
                Start monitoring free
              </a>
              <a
                href="#features"
                className="rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Start your 14-day free trial.
            </p>
          </div>

          {/* Dashboard Preview Mock */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-indigo-200/20">
              <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-sm text-gray-400">Weekly Digest</span>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                {[
                  { label: "Reviews Tracked", value: "1,247", change: "+12%", positive: true },
                  { label: "Sentiment Score", value: "4.2", change: "+0.3", positive: true },
                  { label: "Urgent Alerts", value: "3", change: "New", positive: false },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-5"
                  >
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        stat.positive
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-400">
                <span className="font-medium text-indigo-600">3 urgent alerts</span>{" "}
                requiring attention
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -bottom-6 left-1/2 -z-10 h-32 w-[80%] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-300/40 to-purple-300/40 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One dashboard for all your reviews
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Stop switching between tabs. ReviewDigest brings every platform
              into a single, AI-powered view.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Multi-Platform Monitoring",
                desc: "Track reviews from G2, Capterra, App Store, Reddit, and social media in one place.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "Real-Time Alerts",
                desc: "Get instant notifications when critical negative reviews come in — respond before the damage spreads.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                ),
              },
              {
                title: "AI Sentiment Analysis",
                desc: "Our AI classifies sentiment, extracts feature requests, and tracks trends after every product update.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                ),
              },
              {
                title: "Weekly Digests",
                desc: "Receive a crisp weekly briefing summarizing all review activity, sentiment trends, and actionable insights.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                title: "Feature Request Aggregation",
                desc: "Automatically extract and rank feature requests from reviews so your roadmap is always data-driven.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                ),
              },
              {
                title: "Slack Integration",
                desc: "Get alerts and digests sent directly to Slack. Keep your team in the loop without leaving your workflow.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Simple setup
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get started in minutes
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Connect sources",
                desc: "Link your product pages on G2, Capterra, App Store, Reddit — or let us discover them for you.",
              },
              {
                step: "2",
                title: "Sit back & relax",
                desc: "Our AI monitors every review, classifies sentiment, and surfaces what matters — 24/7.",
              },
              {
                step: "3",
                title: "Act on insights",
                desc: "Respond to critical reviews in real time, and let weekly digests inform your roadmap.",
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
                  {step.step}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Pricing
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Plans that grow with you
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Start small and upgrade as your review volume grows.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Starter */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                <p className="mt-1 text-sm text-gray-500">
                  For small teams getting started
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  $79
                </span>
                <span className="text-base text-gray-500">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-4">
                {[
                  "Up to 50 reviews/month tracked",
                  "Weekly summary digests",
                  "Real-time critical negative alerts",
                  "Email notifications",
                  "Multi-platform monitoring",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                Start free trial
              </a>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg shadow-indigo-200/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Most popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <p className="mt-1 text-sm text-gray-500">
                  For growing product teams
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  $199
                </span>
                <span className="text-base text-gray-500">/month</span>
              </div>
              <ul className="mb-8 flex-1 space-y-4">
                {[
                  "Unlimited reviews tracked",
                  "Weekly summary digests",
                  "Real-time critical negative alerts",
                  "AI sentiment & trend analysis",
                  "API access",
                  "Slack integration",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
              >
                Start free trial
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop missing what your users are saying
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-indigo-100">
            Join forward-thinking product teams who use ReviewDigest to stay on
            top of every review, every platform, every day.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
            >
              Start your free trial
            </a>
            <a
              href="#features"
              className="rounded-xl border border-indigo-400 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-500/30"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                RD
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {displayName}
              </span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="hover:text-gray-900">
                Pricing
              </a>
              <a href="/dashboard" className="hover:text-gray-900">
                Sign in
              </a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {displayName}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}