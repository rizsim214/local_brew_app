"use client";

import Link from "next/link";
import { ShoppingCart, Coffee } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";

export function NavMenu() {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-x-2 text-lg font-semibold text-primary">
          <Coffee className=" h-8 w-8 md:h-10 md:w-10" />
          <span className="tracking-wider mt-1.5 hidden md:block">LokalBrew</span>
        </Link>

        <div className="flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/menu" className={navigationMenuTriggerStyle()}>
                    Menu
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Link
          href="/checkout"
          aria-label="Checkout"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
        >
          <ShoppingCart className="size-4" />
        </Link>
      </div>
    </header>
  );
}
