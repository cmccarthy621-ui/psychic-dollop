import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import { auth } from "~/lib/auth-servers";

export const Route = createFileRoute("/dashboard/__root")({
  beforeLoad: async ({ location }) => {
    // During SSR (no document), the cookie shim returns undefined, so
    // we skip the redirect and let the client handle it after hydration.
    // During client-side navigation, the server function works properly
    // and we redirect to login if unauthenticated.
    if (typeof document !== "undefined") {
      const session = await auth.getSession();
      const publicPaths = ["/dashboard/login", "/dashboard/signup"];
      if (!session && !publicPaths.includes(location.pathname)) {
        throw redirect({ to: "/dashboard/login" });
      }
    }
  },
  component: DashboardLayout,
});

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "⭐" },
  { href: "/dashboard/settings", label: "Alert Settings", icon: "⚙️" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
];

function DashboardLayout() {
  const location = useLocation();
  const isPublicPage =
    location.pathname === "/dashboard/login" ||
    location.pathname === "/dashboard/signup";

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">
              ReviewDigest
            </span>
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">Customer Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/dashboard/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="text-lg">🚪</span>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}