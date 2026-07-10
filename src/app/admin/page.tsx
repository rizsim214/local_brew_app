"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { AdminDashboard } from "@/src/components/admin/admin-dashboard";
import { getAdminMetrics } from "@/src/app/admin/analytics";

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof getAdminMetrics>> | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both your username and password.");
      return;
    }

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      setError("Invalid credentials.");
      return;
    }

    const adminMetrics = await getAdminMetrics();
    setMetrics(adminMetrics);
    setIsLoggedIn(true);
    setError("");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setMetrics(null);
    setUsername("");
    setPassword("");
    setError("");
  }

  if (!isLoggedIn || !metrics) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4">
            <a href="/" className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </a>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Admin access</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to view the dashboard and recent orders.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-foreground">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="admin"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="admin123"
                />
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button type="submit" className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end px-6 pt-6">
        <button type="button" onClick={handleLogout} className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Log out
        </button>
      </div>
      <AdminDashboard metrics={metrics} />
    </div>
  );
}

