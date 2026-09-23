import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { STUDENTS } from "@/data/students";
import { buildCommunity, type Community, type MyProfile } from "@/lib/matching";
import { ProfileForm } from "@/components/worlds/ProfileForm";
import { CommunityView } from "@/components/worlds/CommunityView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Worlds Together — Find your people, wherever you're from" },
      {
        name: "description",
        content:
          "Worlds Together matches international university students into small groups with real common ground, and suggests one easy first meet-up.",
      },
      { property: "og:title", content: "Worlds Together — Find your people, wherever you're from" },
      {
        property: "og:description",
        content:
          "A community matching prototype for international students: small groups, shared interests, and a first meet-up that's easy to say yes to.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "welcome" | "profile" | "loading" | "community";

function Index() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [me, setMe] = useState<MyProfile | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    const t = setTimeout(() => setStage("community"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  const submit = (profile: MyProfile) => {
    setMe(profile);
    setCommunity(buildCommunity(profile, STUDENTS));
    setStage("loading");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-16">
        <div className="flex items-center gap-2.5">
          <span className="size-3 rounded-full bg-accent" />
          <span className="text-sm font-medium tracking-tight">Worlds Together</span>
        </div>

        <div className="mt-10">
          {stage === "welcome" && (
            <section className="card-soft p-7 sm:p-12">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Community matching for international students
              </p>
              <h1 className="mt-4 text-4xl leading-[1.05] sm:text-6xl">
                Find your people,
                <br />
                wherever you're from.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground">
                Answer a few questions and we'll introduce you to a small group on campus with
                enough in common to make the first meet-up easy — and enough difference to be worth
                showing up for.
              </p>
              <div className="mt-8">
                <button className="btn-accent" onClick={() => setStage("profile")}>
                  Find my community
                </button>
              </div>
              <div className="mt-10 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
                {[
                  ["Small groups", "Three to five people, not an endless list."],
                  ["Privacy you can see", "Every question is labelled public or private."],
                  ["One clear first step", "A single plan that fits everyone's free time."],
                ].map(([title, body]) => (
                  <div key={title}>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stage === "profile" && <ProfileForm onSubmit={submit} />}

          {stage === "loading" && (
            <section className="card-soft grid min-h-72 place-items-center p-10 text-center">
              <div>
                <div className="mx-auto flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2.5 animate-bounce rounded-full bg-accent"
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>
                <h2 className="mt-6 text-2xl">Finding people you might actually click with…</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Weighing shared interests, overlapping free time and a mix of backgrounds.
                </p>
              </div>
            </section>
          )}

          {stage === "community" && me && community && (
            <CommunityView
              me={me}
              community={community}
              onRestart={() => {
                setMe(null);
                setCommunity(null);
                setStage("welcome");
              }}
            />
          )}
        </div>

        <footer className="mt-14 text-xs text-muted-foreground">
          Prototype with synthetic student data. No messaging, feed or accounts.
        </footer>
      </div>
    </main>
  );
}
