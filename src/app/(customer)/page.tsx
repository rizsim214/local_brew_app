import Link from "next/link";
import { ArrowRight, Coffee, Sparkles } from "lucide-react";

export default function CustomerLanding() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-[2.5rem] border border-border bg-card px-8 py-16 text-center shadow-sm sm:px-12 lg:flex-row lg:items-start lg:text-left">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="mr-2 size-4 text-primary" />
            Your neighborhood coffee ritual
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Local Brew, made for calm mornings and easy afternoons.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Discover signature coffee, fresh pastries, and a smooth ordering experience made for your next visit.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Explore the menu
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/checkout" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
              View checkout
            </Link>
          </div>
        </div>

        <div className="flex-1 rounded-[2rem] border border-border bg-background/70 p-8">
          <div className="flex items-center gap-3 text-primary">
            <Coffee className="size-6" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Freshly brewed</span>
          </div>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p>• Single-origin espresso</p>
            <p>• House-made pastries</p>
            <p>• Seamless pickup and order coordination</p>
          </div>
        </div>
      </div>
    </main>
  );
}
