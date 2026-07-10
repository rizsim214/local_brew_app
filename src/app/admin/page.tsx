"use client";

import { useEffect, useState } from "react";
import type * as React from "react";
import { ArrowLeft } from "lucide-react"

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(window.localStorage.getItem("admin-auth") === "true");
    }
  }, []);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both your username and password.");
      return;
    }

    window.localStorage.setItem("admin-auth", "true");
    setIsLoggedIn(true);
    setError("");
  }

  function handleLogout() {
    window.localStorage.removeItem("admin-auth");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm ">
          <div className="mb-6 flex flex-col gap-4">
            <a
              href="/"
              className="mb-4 space-x-2 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" /> <p className="m-0 p-0">Back</p>
            </a>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access the admin dashboard.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-ring"
                  placeholder="Enter password"
                />
              </div>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Log out
      </button>
    </div>
  );
}

