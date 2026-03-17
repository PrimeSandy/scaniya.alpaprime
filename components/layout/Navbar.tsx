"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { QrCode, LayoutDashboard, Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlanBadge } from "@/components/shared/PlanBadge";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Scaniya Homepage">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Scaniya</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/create">
                <Button size="sm" className="gradient-primary text-white border-0 gap-1.5">
                  <Plus className="w-4 h-4" />
                  Create QR
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/login">
                <Button size="sm" className="gradient-primary text-white border-0">
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* User Menu */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Open User Menu">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                  <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                <div className="mt-1">
                  <PlanBadge plan={(session.user as any).plan ?? "free"} />
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
