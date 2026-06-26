'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav';
import { EventOps } from '@/lib/api-client';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import VoiceCopilot from '@/components/voice/VoiceCopilot';
import ThemeToggle from '@/components/dashboard/theme-toggle';
import {
  LayoutDashboard,
  CalendarDays,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
  ScrollText,
  Settings,
  Menu,
  Bell,
  ArrowUpRight,
  Cpu,
  LogOut,
} from 'lucide-react';

const DASHBOARD_STATS_REFRESH_EVENT = 'eventops:stats-refresh';

const ICONS = {
  LayoutDashboard,
  CalendarDays,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
  ScrollText,
  Settings,
};

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return 'US';

  const cleanValue = nameOrEmail.trim();

  if (cleanValue.includes('@')) {
    return cleanValue.slice(0, 2).toUpperCase();
  }

  const parts = cleanValue.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatRole(role) {
  if (!role) return 'Owner';

  return role
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join(' ');
}

function NavLinks({ counts, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon] || LayoutDashboard;
        const active =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

        const badge = item.badgeKey ? counts?.[item.badgeKey] : null;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              active
                ? 'bg-sidebar-accent text-white'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white'
            )}
          >
            <Icon
              className={cn(
                'h-[18px] w-[18px] shrink-0',
                active
                  ? 'text-cyan-400'
                  : 'text-sidebar-foreground group-hover:text-cyan-400'
              )}
            />

            <span className="min-w-0 flex-1 truncate">{item.label}</span>

            {badge ? (
              <span className="rounded-full bg-cyan-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ counts, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">
          RG
        </span>

        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-sm font-bold text-white">EventOps</p>
          <p className="truncate text-[11px] text-cyan-400">AI Assistant</p>
        </div>
      </Link>

      <div className="mt-2 flex-1 overflow-y-auto scrollbar-thin">
        <NavLinks counts={counts} onNavigate={onNavigate} />
      </div>

      <div className="m-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Cpu className="h-4 w-4" />
          <span className="text-xs font-semibold">MCP-ready</span>
        </div>

        <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground">
          Core actions exposed as typed AI-agent tools.
        </p>

        <Link
          href="/dashboard/settings"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:underline"
        >
          View tools <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardShell({ children, profile, workspace }) {
  const router = useRouter();
  const pathname = usePathname();
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');

  const displayEmail = useMemo(() => {
    return authEmail || profile?.email || '';
  }, [authEmail, profile]);

  const displayName = useMemo(() => {
    return displayEmail || profile?.full_name || 'User';
  }, [displayEmail, profile]);

  const displayRole = useMemo(() => {
    return formatRole(profile?.role);
  }, [profile]);

  const workspaceName = workspace?.name || 'Workspace';
  const initials = getInitials(displayName);

  const loadCounts = useCallback(async () => {
    try {
      const stats = await EventOps.stats();

      setCounts({
        inbox: stats?.newEnquiries || 0,
        approvals: stats?.pendingApprovals || 0,
      });
    } catch {
      setCounts({
        inbox: 0,
        approvals: 0,
      });
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setAuthEmail(data?.user?.email || '');
    });
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts, pathname]);

  useEffect(() => {
    const refreshCounts = () => loadCounts();

    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') loadCounts();
    };

    window.addEventListener(DASHBOARD_STATS_REFRESH_EVENT, refreshCounts);
    window.addEventListener('focus', refreshCounts);
    document.addEventListener('visibilitychange', refreshOnVisible);

    return () => {
      window.removeEventListener(DASHBOARD_STATS_REFRESH_EVENT, refreshCounts);
      window.removeEventListener('focus', refreshCounts);
      document.removeEventListener('visibilitychange', refreshOnVisible);
    };
  }, [loadCounts]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border md:block">
        <SidebarInner counts={counts} />
      </aside>

      <div className="min-w-0 md:pl-64">
        <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
          <div className="flex min-h-16 items-center gap-2 px-3 py-2 md:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-64 border-0 p-0">
                <SidebarInner counts={counts} onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-foreground">
                AI EventOps Assistant
              </p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {workspaceName} • Supabase workspace
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ThemeToggle />

              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10"
                onClick={loadCounts}
                title="Refresh notification counts"
              >
                <Bell className="h-4 w-4" />
                {counts.approvals ? (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {counts.approvals}
                  </span>
                ) : null}
              </Button>

              <div className="flex max-w-[42px] items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-1 sm:max-w-[260px] sm:pr-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 text-[11px] font-bold text-slate-950">
                  {initials}
                </div>

                <div className="hidden min-w-0 text-left leading-tight sm:block">
                  <p className="max-w-44 truncate text-xs font-semibold text-foreground lg:max-w-52">
                    {displayEmail || displayName}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">{displayRole}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-10 w-10 px-0 sm:w-auto sm:px-3"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="min-w-0 p-4 pb-28 md:p-8 md:pb-8">{children}</main>
      </div>

      <VoiceCopilot />
    </div>
  );
}