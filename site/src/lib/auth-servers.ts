import { createServerFn } from "@tanstack/react-start";

// vinxi/http provides cookie helpers
import { getCookie as _getCookie, setCookie as _setCookie, deleteCookie as _deleteCookie } from "vinxi/http.js";

// Simple session store using a Map (in-memory, for now)
const sessions = new Map<string, { userId: string; email: string; name: string; plan: string }>();

let counter = 0;
function generateSessionToken(): string {
  return `sess_${Date.now()}_${++counter}_${Math.random().toString(36).slice(2, 10)}`;
}

export const auth = {
  getSession: createServerFn({ method: "GET" }).handler(async () => {
    const token = _getCookie("session_token");
    if (!token) return null;
    const session = sessions.get(token);
    if (!session) return null;
    return session;
  }),

  createSession: createServerFn({ method: "POST" })
    .validator((data: { email: string; password: string }) => data)
    .handler(async ({ data }) => {
      // Try calling the backend API first
      try {
        const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const user = await res.json();
          const token = generateSessionToken();
          sessions.set(token, { userId: user.id, email: user.email, name: user.name, plan: user.plan || "starter" });
          _setCookie("session_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return { success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan || "starter" } };
        }
        return { success: false, error: "Invalid email or password" };
      } catch {
        return {
          success: false,
          error: "Authentication service unavailable. Please try again later.",
        };
      }
    }),

  register: createServerFn({ method: "POST" })
    .validator((data: { name: string; email: string; password: string }) => data)
    .handler(async ({ data }) => {
      try {
        const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const user = await res.json();
          const token = generateSessionToken();
          sessions.set(token, { userId: user.id, email: user.email, name: user.name, plan: user.plan || "starter" });
          _setCookie("session_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return { success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan || "starter" } };
        }
        return { success: false, error: "Registration failed. Please try again." };
      } catch {
        return {
          success: false,
          error: "Registration service unavailable. Please try again later.",
        };
      }
    }),

  signOut: createServerFn({ method: "POST" }).handler(async () => {
    const token = _getCookie("session_token");
    if (token) {
      sessions.delete(token);
      _deleteCookie("session_token", { path: "/" });
    }
    return { success: true };
  }),

  demoLogin: createServerFn({ method: "POST" }).handler(async () => {
    const token = generateSessionToken();
    sessions.set(token, {
      userId: "demo-user-1",
      email: "demo@reviewdigest.io",
      name: "Alex Chen",
      plan: "pro",
    });
    _setCookie("session_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return {
      success: true,
      user: {
        id: "demo-user-1",
        email: "demo@reviewdigest.io",
        name: "Alex Chen",
        plan: "pro",
      },
    };
  }),
};