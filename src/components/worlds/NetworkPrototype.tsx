import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Home,
  MessageCircle,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { CommunityBoard } from "./CommunityBoard";
import { ConnectView } from "./ConnectView";
import { ConversationsView } from "./ConversationsView";

type Section = "home" | "connect" | "board" | "conversations";

const navItems: {
  id: Exclude<Section, "home">;
  label: string;
  icon: typeof UsersRound;
}[] = [
  { id: "connect", label: "Connect", icon: UsersRound },
  { id: "board", label: "Community board", icon: Building2 },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
];

function HomeView({ navigate }: { navigate: (section: Exclude<Section, "home">) => void }) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-soft">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Network className="size-3.5" />
              Pilot network: Five Colleges + nearby campuses
            </div>

            <h1 className="mt-6 max-w-3xl font-sans text-4xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-6xl">
              Your international student network, beyond your campus.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Meet students at other colleges, exchange practical help, and join small conversations
              without opening your profile to an entire network.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => navigate("connect")}>
                Find an introduction
                <ArrowRight className="size-4" />
              </button>
              <button className="btn-quiet" onClick={() => navigate("board")}>
                Browse community posts
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-secondary/50 p-6">
            <ShieldCheck className="size-6 text-primary" />
            <h2 className="mt-4 font-sans text-lg font-semibold">Private by default</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <p>No searchable directory of every student.</p>
              <p>
                Introductions reveal one person at a time, only when there is a reason to connect.
              </p>
              <p>
                Conversation rosters stay hidden. You see the people who participate, not a list of
                everyone in the network.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <button
          className="group card-soft p-6 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          onClick={() => navigate("connect")}
        >
          <UsersRound className="size-6 text-primary" />
          <h2 className="mt-5 font-sans text-xl font-semibold">Connect</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tell Worlds Together what kind of connection would be useful. Get one cross-campus
            introduction instead of browsing profiles.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Try introductions
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </button>

        <button
          className="group card-soft p-6 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          onClick={() => navigate("board")}
        >
          <Building2 className="size-6 text-primary" />
          <h2 className="mt-5 font-sans text-xl font-semibold">Community board</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Housing, sublets, rides, travel plans, campus visits, and things to give away across
            participating colleges.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open the board
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </button>

        <button
          className="group card-soft p-6 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          onClick={() => navigate("conversations")}
        >
          <MessageCircle className="size-6 text-primary" />
          <h2 className="mt-5 font-sans text-xl font-semibold">Conversations</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Small topic-based conversations with optional virtual meetups. No public member list.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
            View conversations
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Prototype principle
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <p className="font-medium">Useful before social</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Housing and rides give students a concrete reason to use the network.
            </p>
          </div>
          <div>
            <p className="font-medium">Cross-campus by design</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Introductions prioritize people at other colleges instead of recreating a campus
              directory.
            </p>
          </div>
          <div>
            <p className="font-medium">Controlled visibility</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Students choose when they become visible through a post, introduction, or
              conversation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function NetworkPrototype() {
  const [section, setSection] = useState<Section>("home");

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setSection("home")}
            aria-label="Worlds Together home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
              WT
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Worlds Together</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                International student network
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground sm:flex"
            onClick={() => setSection("home")}
          >
            <Home className="size-3.5" />
            Prototype
          </button>
        </div>

        <nav className="flex border-t border-border/70 px-3 py-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium ${
                  active ? "bg-secondary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {item.label === "Community board" ? "Board" : item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-10">
        {section === "home" && <HomeView navigate={setSection} />}
        {section === "connect" && <ConnectView />}
        {section === "board" && <CommunityBoard />}
        {section === "conversations" && <ConversationsView />}

        <footer className="mt-12 border-t border-border py-7 text-xs leading-5 text-muted-foreground">
          Prototype using synthetic student data. No account, post, message, or introduction is sent
          to a real person.
        </footer>
      </div>
    </main>
  );
}
