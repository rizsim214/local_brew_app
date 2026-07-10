"use client";

import Link from "next/link";
import { ArrowUpRight, ReceiptText, TrendingUp } from "lucide-react";

import { type AdminMetrics } from "@/src/app/admin/analytics";

type AdminDashboardProps = {
  metrics: AdminMetrics;
};

export function AdminDashboard({ metrics }: AdminDashboardProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3 rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Local Brew at a glance</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Review your top-selling items, revenue, and recent order activity from one calm workspace.
          </p>
        </div>
        <Link href="/admin/orders" className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
          View orders
          <ArrowUpRight className="ml-2 size-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">₱{metrics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Completed orders</p>
            <ReceiptText className="size-4 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">{metrics.totalOrders}</p>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm md:col-span-2 xl:col-span-1">
          <p className="text-sm text-muted-foreground">Popular products</p>
          <div className="mt-4 space-y-3">
            {metrics.popularProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-3 py-2 text-sm">
                <span className="text-foreground">{product.name}</span>
                <span className="font-medium text-primary">{product.unitsSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
