import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "~/lib/auth-servers";

export const Route = createFileRoute("/dashboard/signup")({
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await auth.register({ data: { name, email, password } });
      if (result.success) {
        router.navigate({ to: "/dashboard" });
      } else {
        setError(result.error || "Registration failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600">ReviewDigest</Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/dashboard/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-200">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="At least 8 characters"
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Choose your plan</p>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                <input type="radio" name="plan" value="starter" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Starter</span>
                  <span className="text-sm text-gray-500 ml-1">– $79/mo · 50 reviews/mo</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                <input type="radio" name="plan" value="pro" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Pro</span>
                  <span className="text-sm text-gray-500 ml-1">– $199/mo · Unlimited reviews</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}