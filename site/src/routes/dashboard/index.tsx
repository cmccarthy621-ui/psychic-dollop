import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";

// ─── Server functions (proxy to backend API) ────────────────────────────────

const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/dashboard/overview`);
    if (res.ok) return await res.json();
  } catch {
    // Backend not ready yet — return mock data
  }
  return {
    metrics: {
      totalReviews: 248,
      newReviewsThisWeek: 18,
      avgSentiment: 4.2,
      sentimentChange: 0.3,
      alertsActive: 4,
      sources: 3,
    },
    sentimentTrend: [
      { date: "Mon", positive: 65, neutral: 20, negative: 15 },
      { date: "Tue", positive: 70, neutral: 15, negative: 15 },
      { date: "Wed", positive: 72, neutral: 12, negative: 16 },
      { date: "Thu", positive: 68, neutral: 18, negative: 14 },
      { date: "Fri", positive: 75, neutral: 10, negative: 15 },
      { date: "Sat", positive: 80, neutral: 8, negative: 12 },
      { date: "Sun", positive: 78, neutral: 12, negative: 10 },
    ],
    recentAlerts: [
      {
        id: "1",
        platform: "G2",
        rating: 2,
        title: "Poor customer support response times",
        snippet: "We've been waiting over 48 hours for a response...",
        time: "2h ago",
        urgent: true,
      },
      {
        id: "2",
        platform: "App Store",
        rating: 1,
        title: "App crashes on startup after latest update",
        snippet: "Updated to v3.2.1 and now the app won't open...",
        time: "6h ago",
        urgent: true,
      },
      {
        id: "3",
        platform: "Capterra",
        rating: 3,
        title: "Integration with Slack needs improvement",
        snippet: "The Slack integration is clunky and misses notifications...",
        time: "1d ago",
        urgent: false,
      },
      {
        id: "4",
        platform: "Reddit",
        rating: 4,
        title: "Great product but pricing is steep",
        snippet: "Love the features but the Pro tier is hard to justify...",
        time: "2d ago",
        urgent: false,
      },
    ],
    topFeatureRequests: [
      { feature: "Slack integration improvements", count: 12 },
      { feature: "Mobile app", count: 8 },
      { feature: "Custom report exports (PDF/CSV)", count: 7 },
      { feature: "API webhook support", count: 5 },
    ],
  };
});

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
  loader: () => getDashboardData(),
});

// ─── Sub-components ─────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: { direction: "up" | "down"; value: string } }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              trend.direction === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </span>
          )}
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function SentimentBar({ date, positive, neutral, negative }: { date: string; positive: number; neutral: number; negative: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-8 shrink-0">{date}</span>
      <div className="flex-1 h-6 rounded-full bg-gray-100 flex overflow-hidden">
        <div className="bg-green-400 h-full" style={{ width: `${positive}%` }} title={`Positive: ${positive}%`} />
        <div className="bg-yellow-400 h-full" style={{ width: `${neutral}%` }} title={`Neutral: ${neutral}%`} />
        <div className="bg-red-400 h-full" style={{ width: `${negative}%` }} title={`Negative: ${negative}%`} />
      </div>
      <div className="flex gap-2 text-[10px] text-gray-400 w-24 shrink-0">
        <span className="text-green-600">{positive}%</span>
        <span className="text-yellow-600">{neutral}%</span>
        <span className="text-red-600">{negative}%</span>
      </div>
    </div>
  );
}

function AlertCard({ alert }: {
  alert: { id: string; platform: string; rating: number; title: string; snippet: string; time: string; urgent: boolean };
}) {
  const platformColors: Record<string, string> = {
    "G2": "bg-blue-100 text-blue-700",
    "App Store": "bg-gray-100 text-gray-700",
    "Capterra": "bg-green-100 text-green-700",
    "Reddit": "bg-orange-100 text-orange-700",
  };
  return (
    <div className={`p-4 rounded-lg border ${alert.urgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[alert.platform] || "bg-gray-100 text-gray-700"}`}>
            {alert.platform}
          </span>
          <span className="text-xs text-gray-400">{alert.time}</span>
          {alert.urgent && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">Urgent</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < alert.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
          ))}
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900 mt-2">{alert.title}</p>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{alert.snippet}</p>
    </div>
  );
}

function FeatureRequestCard({ feature, count }: { feature: string; count: number }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{feature}</span>
      <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

function DashboardHome() {
  const data = Route.useLoaderData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Your product review intelligence at a glance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Reviews Tracked"
          value={data.metrics.totalReviews}
          trend={{ direction: "up", value: "+12%" }}
          sub="vs last month"
        />
        <MetricCard
          label="New This Week"
          value={data.metrics.newReviewsThisWeek}
          trend={{ direction: "up", value: "+8" }}
          sub="from 10 last week"
        />
        <MetricCard
          label="Avg. Sentiment"
          value={`★ ${data.metrics.avgSentiment}`}
          trend={{ direction: "up", value: `+${data.metrics.sentimentChange}` }}
          sub="out of 5"
        />
        <MetricCard
          label="Active Alerts"
          value={data.metrics.alertsActive}
          sub={`across ${data.metrics.sources} sources`}
        />
      </div>

      {/* Sentiment Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sentiment Trend (7 days)</h2>
          <span className="text-xs text-gray-400">Positive · Neutral · Negative</span>
        </div>
        <div className="space-y-2">
          {data.sentimentTrend.map((day) => (
            <SentimentBar key={day.date} {...day} />
          ))}
        </div>
      </div>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <Link to="/dashboard/reviews" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {data.recentAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>

        {/* Top Feature Requests */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Requests</h2>
              <span className="text-xs text-gray-400">This month</span>
            </div>
            <div>
              {data.topFeatureRequests.map((req) => (
                <FeatureRequestCard key={req.feature} {...req} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}