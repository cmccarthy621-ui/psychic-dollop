import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

// ─── Server functions ───────────────────────────────────────────────────────

const getSubscription = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/billing/subscription`);
    if (res.ok) return await res.json();
  } catch {
    // Backend not ready — fall back to mock data
  }
  return {
    plan: "pro",
    status: "active",
    currentPeriodStart: "2026-07-01T00:00:00Z",
    currentPeriodEnd: "2026-08-01T00:00:00Z",
    nextBillingDate: "2026-08-01",
    amount: 199,
    currency: "USD",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
    },
    invoices: [
      { id: "inv_001", date: "2026-07-01", amount: 199, status: "paid", description: "Pro Plan - Monthly" },
      { id: "inv_002", date: "2026-06-01", amount: 199, status: "paid", description: "Pro Plan - Monthly" },
      { id: "inv_003", date: "2026-05-01", amount: 199, status: "paid", description: "Pro Plan - Monthly" },
      { id: "inv_004", date: "2026-04-01", amount: 79, status: "paid", description: "Starter Plan - Monthly" },
    ],
    usage: {
      reviewsTrackedThisMonth: 187,
      reviewLimit: null as number | null,
      sourcesActive: 3,
    },
  };
});

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
  loader: () => getSubscription(),
});

// ─── Billing Page ───────────────────────────────────────────────────────────

function BillingPage() {
  const data = Route.useLoaderData();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const planDetails: Record<string, { name: string; price: number; limit: string }> = {
    starter: { name: "Starter", price: 79, limit: "50 reviews/month" },
    pro: { name: "Pro", price: 199, limit: "Unlimited reviews" },
  };

  const currentPlan = planDetails[data.plan] || planDetails.starter;
  const isPro = data.plan === "pro";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your plan, payment method, and invoices</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {currentPlan.name}
              <span className="text-base font-normal text-gray-500 ml-2">
                ${currentPlan.price}/mo
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {data.status === "active" ? "Active" : data.status} · Next billing: {new Date(data.nextBillingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                {currentPlan.limit}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500 font-bold">✓</span>
                Weekly digests
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`${isPro ? "text-green-500 font-bold" : "text-gray-300"} font-bold`}>
                  {isPro ? "✓" : "○"}
                </span>
                Real-time alerts
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`${isPro ? "text-green-500 font-bold" : "text-gray-300"} font-bold`}>
                  {isPro ? "✓" : "○"}
                </span>
                API access
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`${isPro ? "text-green-500 font-bold" : "text-gray-300"} font-bold`}>
                  {isPro ? "✓" : "○"}
                </span>
                Slack integration
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`${isPro ? "text-green-500 font-bold" : "text-gray-300"} font-bold`}>
                  {isPro ? "✓" : "○"}
                </span>
                Trend analysis
              </div>
            </div>
          </div>
          <div className="text-right">
            {isPro ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                Pro
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Starter
              </span>
            )}
          </div>
        </div>

        {/* Plan switcher */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Change plan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Starter Card */}
            <div className={`border rounded-xl p-5 ${!isPro ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200 hover:border-gray-300"}`}>
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">$79<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ 50 reviews/month</li>
                <li>✓ Weekly digests</li>
                <li>✓ Email alerts</li>
              </ul>
              {!isPro && (
                <span className="mt-4 inline-block text-xs text-indigo-600 font-medium">Current plan</span>
              )}
            </div>

            {/* Pro Card */}
            <div className={`border rounded-xl p-5 ${isPro ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200 hover:border-gray-300"}`}>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">$199<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Unlimited reviews</li>
                <li>✓ Real-time alerts</li>
                <li>✓ API access & Slack</li>
                <li>✓ Trend analysis</li>
              </ul>
              {isPro && (
                <span className="mt-4 inline-block text-xs text-indigo-600 font-medium">Current plan</span>
              )}
              {!isPro && (
                <button
                  onClick={() => setLoadingPlan("pro")}
                  disabled={loadingPlan === "pro"}
                  className="mt-4 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loadingPlan === "pro" ? "Processing..." : "Upgrade to Pro"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Reviews Tracked</p>
            <p className="text-2xl font-bold text-gray-900">{data.usage.reviewsTrackedThisMonth}</p>
            <p className="text-xs text-gray-400">
              {data.usage.reviewLimit ? `of ${data.usage.reviewLimit} limit` : "Unlimited"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Sources</p>
            <p className="text-2xl font-bold text-gray-900">{data.usage.sourcesActive}</p>
            <p className="text-xs text-gray-400">of 4 available</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Plan Price</p>
            <p className="text-2xl font-bold text-gray-900">${data.amount}<span className="text-sm font-normal text-gray-500">/mo</span></p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Update</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
            {data.paymentMethod.brand === "visa" ? "VISA" : "MC"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">•••• {data.paymentMethod.last4}</p>
            <p className="text-xs text-gray-400">Expires {data.paymentMethod.expMonth}/{data.paymentMethod.expYear}</p>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Description</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((invoice: any) => (
                <tr key={invoice.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-700">
                    {new Date(invoice.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3 px-2 text-gray-700">{invoice.description}</td>
                  <td className="py-3 px-2 text-right text-gray-900 font-medium">${invoice.amount}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}