import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

// ─── Server functions ───────────────────────────────────────────────────────

const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/settings`);
    if (res.ok) return await res.json();
  } catch {
    // Backend not ready — fall back to mock data
  }
  return {
    sources: [
      { id: "g2", name: "G2", enabled: true, lastSync: "2026-07-08T10:00:00Z" },
      { id: "capterra", name: "Capterra", enabled: true, lastSync: "2026-07-08T09:30:00Z" },
      { id: "appstore", name: "App Store", enabled: true, lastSync: "2026-07-08T09:00:00Z" },
      { id: "reddit", name: "Reddit", enabled: false, lastSync: null },
      { id: "twitter", name: "X / Twitter", enabled: false, lastSync: null },
    ],
    notifications: {
      email: true,
      slack: false,
      urgentOnly: true,
      weeklyDigest: true,
      digestDay: "monday",
    },
    keywords: ["crash", "bug", "broken", "terrible", "refund"],
  };
});

const updateSettings = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend not ready
    }
    return { success: true };
  });

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  loader: () => getSettings(),
});

// ─── Settings Page ──────────────────────────────────────────────────────────

function SettingsPage() {
  const initialSettings = Route.useLoaderData();
  const [sources, setSources] = useState(initialSettings.sources);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [keywords, setKeywords] = useState(initialSettings.keywords.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSource = (id: string) => {
    setSources(sources.map((s: any) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await updateSettings({
      data: {
        sources,
        notifications,
        keywords: keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
      },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alert Settings</h1>
        <p className="text-gray-500 mt-1">Configure your review sources and notification preferences</p>
      </div>

      {/* Review Sources */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Review Sources</h2>
        <p className="text-sm text-gray-500 mb-4">Toggle which platforms ReviewDigest monitors for new reviews</p>
        <div className="space-y-3">
          {sources.map((source: any) => (
            <label
              key={source.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:border-indigo-400"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={() => toggleSource(source.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{source.name}</span>
                  {source.lastSync && (
                    <p className="text-xs text-gray-400">
                      Last synced: {new Date(source.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${source.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                {source.enabled ? "Active" : "Paused"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mb-4">Choose how and when you receive alerts</p>
        <div className="space-y-5">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Email notifications</span>
              <p className="text-xs text-gray-400">Receive alert emails for critical reviews</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Slack integration</span>
              <p className="text-xs text-gray-400">Send alerts to your Slack workspace</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.slack}
              onChange={(e) => setNotifications({ ...notifications, slack: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Urgent alerts only</span>
              <p className="text-xs text-gray-400">Only notify for reviews rated ≤ 2 stars</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.urgentOnly}
              onChange={(e) => setNotifications({ ...notifications, urgentOnly: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900">Weekly digest</span>
              <p className="text-xs text-gray-400">Receive a weekly summary of all reviews</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          {notifications.weeklyDigest && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digest day of week
              </label>
              <select
                value={notifications.digestDay}
                onChange={(e) => setNotifications({ ...notifications, digestDay: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white max-w-xs"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Alert Keywords</h2>
        <p className="text-sm text-gray-500 mb-4">Comma-separated keywords that trigger urgent alerts when found in reviews</p>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="crash, bug, broken, terrible, refund"
        />
        <p className="mt-1 text-xs text-gray-400">Keywords are case-insensitive and matched against review titles and content</p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Settings saved successfully</span>
        )}
      </div>
    </div>
  );
}