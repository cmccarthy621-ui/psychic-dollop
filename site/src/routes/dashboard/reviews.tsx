import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

// ─── Server functions ───────────────────────────────────────────────────────

const getReviews = createServerFn({ method: "GET" })
  .validator((data: { search?: string; platform?: string; sentiment?: string; sort?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const params = new URLSearchParams();
      if (data.search) params.set("search", data.search);
      if (data.platform) params.set("platform", data.platform);
      if (data.sentiment) params.set("sentiment", data.sentiment);
      if (data.sort) params.set("sort", data.sort);
      const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/reviews?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Backend not ready — fall back to mock data
    }
    return getMockReviews(data);
  });

// ─── Mock data ──────────────────────────────────────────────────────────────

function getMockReviews(filters: { search?: string; platform?: string; sentiment?: string; sort?: string }) {
  const allReviews = [
    { id: "1", platform: "G2", rating: 2, title: "Poor customer support response times", snippet: "We've been waiting over 48 hours for a response to a critical issue. This is unacceptable for a B2B tool we rely on daily.", author: "Sarah M.", date: "2026-07-08", sentiment: "negative", tags: ["support", "response-time"] },
    { id: "2", platform: "App Store", rating: 5, title: "Game changer for our team", snippet: "This tool has completely transformed how we track customer feedback. The sentiment analysis is incredibly accurate.", author: "Mike R.", date: "2026-07-07", sentiment: "positive", tags: ["feedback", "sentiment"] },
    { id: "3", platform: "Capterra", rating: 4, title: "Powerful but has a learning curve", snippet: "Once you get past the initial setup, it's incredibly powerful. The weekly digests are a lifesaver.", author: "Lisa K.", date: "2026-07-06", sentiment: "positive", tags: ["onboarding", "usability"] },
    { id: "4", platform: "Reddit", rating: 1, title: "App crashes after latest update", snippet: "Updated to v3.2.1 and now the app crashes on every launch. Need a fix ASAP.", author: "tech_user_42", date: "2026-07-08", sentiment: "negative", tags: ["bug", "crash", "v3.2.1"] },
    { id: "5", platform: "G2", rating: 3, title: "Decent but missing integrations", snippet: "Works well for what it does but missing key integrations like Jira and Asana.", author: "Tom H.", date: "2026-07-05", sentiment: "neutral", tags: ["integrations", "jira", "asana"] },
    { id: "6", platform: "App Store", rating: 4, title: "Clean interface and useful alerts", snippet: "The real-time alerts for negative reviews have saved us from PR disasters multiple times.", author: "Jen P.", date: "2026-07-04", sentiment: "positive", tags: ["alerts", "ux"] },
    { id: "7", platform: "Capterra", rating: 2, title: "Pricing is too high for small teams", snippet: "We're a 5-person startup and $199/mo for Pro is hard to swallow. Need a smaller tier.", author: "Alex D.", date: "2026-07-03", sentiment: "negative", tags: ["pricing", "small-business"] },
    { id: "8", platform: "Reddit", rating: 4, title: "Great for competitive analysis", snippet: "Being able to monitor competitor reviews alongside our own is a killer feature.", author: "saas_founder", date: "2026-07-02", sentiment: "positive", tags: ["competitor", "analysis"] },
    { id: "9", platform: "G2", rating: 3, title: "Good data but reports could be better", snippet: "The data is comprehensive but the PDF export reports are basic. Would love custom dashboards.", author: "Maria S.", date: "2026-07-01", sentiment: "neutral", tags: ["reports", "export", "pdf"] },
    { id: "10", platform: "App Store", rating: 5, title: "Customer team is excellent", snippet: "The support team helped us set up custom alerts in minutes. Truly white-glove service.", author: "Dave W.", date: "2026-06-30", sentiment: "positive", tags: ["support", "onboarding"] },
    { id: "11", platform: "Capterra", rating: 1, title: "Data refresh too slow", snippet: "Reviews from some platforms take hours to appear. Real-time should mean real-time.", author: "Priya K.", date: "2026-06-29", sentiment: "negative", tags: ["performance", "latency"] },
    { id: "12", platform: "Reddit", rating: 4, title: "Love the weekly digest", snippet: "The AI summary of weekly trends saves me hours of manual reading. Highly recommend.", author: "pm_guru", date: "2026-06-28", sentiment: "positive", tags: ["digest", "ai"] },
  ];

  let filtered = [...allReviews];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
    );
  }
  if (filters.platform && filters.platform !== "all") {
    filtered = filtered.filter((r) => r.platform.toLowerCase() === filters.platform?.toLowerCase());
  }
  if (filters.sentiment && filters.sentiment !== "all") {
    filtered = filtered.filter((r) => r.sentiment === filters.sentiment);
  }
  if (filters.sort === "rating_asc") {
    filtered.sort((a, b) => a.rating - b.rating);
  } else if (filters.sort === "rating_desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // Default: newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return { reviews: filtered, total: filtered.length };
}

export const Route = createFileRoute("/dashboard/reviews")({
  component: ReviewsPage,
  validateSearch: (search: Record<string, string>) => ({
    search: search.search || "",
    platform: search.platform || "all",
    sentiment: search.sentiment || "all",
    sort: search.sort || "newest",
  }),
  loaderDeps: ({ search: { search, platform, sentiment, sort } }) => ({ search, platform, sentiment, sort }),
  loader: ({ deps }) => getReviews({ data: deps }),
});

// ─── Sub-components ─────────────────────────────────────────────────────────

const platformColors: Record<string, string> = {
  "G2": "bg-blue-100 text-blue-700",
  "App Store": "bg-gray-100 text-gray-700",
  "Capterra": "bg-green-100 text-green-700",
  "Reddit": "bg-orange-100 text-orange-700",
};

const sentimentColors: Record<string, string> = {
  positive: "bg-green-100 text-green-700",
  neutral: "bg-yellow-100 text-yellow-700",
  negative: "bg-red-100 text-red-700",
};

function ReviewsPage() {
  const { reviews, total } = Route.useLoaderData();
  const { search, platform, sentiment, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [localSearch, setLocalSearch] = useState(search);

  const updateFilter = (key: string, value: string) => {
    navigate({ search: (prev) => ({ ...prev, [key]: value }) });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", localSearch);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Reviews</h1>
        <p className="text-gray-500 mt-1">{total} reviews tracked across all platforms</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </form>

        <select
          value={platform}
          onChange={(e) => updateFilter("platform", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="all">All Platforms</option>
          <option value="G2">G2</option>
          <option value="Capterra">Capterra</option>
          <option value="App Store">App Store</option>
          <option value="Reddit">Reddit</option>
        </select>

        <select
          value={sentiment}
          onChange={(e) => updateFilter("sentiment", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="all">All Sentiment</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="rating_asc">Lowest Rated</option>
        </select>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-500 mt-3 font-medium">No reviews found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[review.platform] || "bg-gray-100 text-gray-700"}`}>
                    {review.platform}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sentimentColors[review.sentiment] || "bg-gray-100 text-gray-700"}`}>
                    {review.sentiment}
                  </span>
                  {review.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mt-2">{review.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{review.snippet}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>{review.author}</span>
                <span>·</span>
                <span>{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}