import { useMemo, useState } from "react";
import { Building2, Filter, MapPin, Plus, Send, X } from "lucide-react";
import {
  BOARD_CATEGORIES,
  BOARD_POSTS,
  COLLEGES,
  type BoardCategory,
  type BoardPost,
  type College,
} from "@/data/network";

type FilterCategory = "All" | BoardCategory;

export function CommunityBoard() {
  const [posts, setPosts] = useState<BoardPost[]>(BOARD_POSTS);
  const [filter, setFilter] = useState<FilterCategory>("All");
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({
    category: "Housing" as BoardCategory,
    title: "",
    body: "",
    college: "Smith College" as College,
    location: "",
  });

  const visiblePosts = useMemo(
    () => (filter === "All" ? posts : posts.filter((post) => post.category === filter)),
    [filter, posts],
  );

  const submitPost = () => {
    if (!draft.title.trim() || !draft.body.trim()) return;

    const next: BoardPost = {
      id: `local-${Date.now()}`,
      category: draft.category,
      title: draft.title.trim(),
      body: draft.body.trim(),
      authorFirstName: "You",
      college: draft.college,
      location: draft.location.trim() || "Campus network",
      postedWhen: "Just now",
    };

    setPosts((previous) => [next, ...previous]);
    setDraft((previous) => ({
      ...previous,
      title: "",
      body: "",
      location: "",
    }));
    setShowComposer(false);
    setFilter("All");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Community board
          </p>
          <h1 className="mt-3 font-sans text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            The useful part of a campus Facebook group, across colleges.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Housing requests and offers, rides, travel, campus visits, and practical help. Posting
            makes you visible for that post only.
          </p>
        </header>

        <button className="btn-primary shrink-0" onClick={() => setShowComposer((value) => !value)}>
          {showComposer ? <X className="size-4" /> : <Plus className="size-4" />}
          {showComposer ? "Close" : "Post to the network"}
        </button>
      </div>

      {showComposer && (
        <section className="card-soft p-6 sm:p-7">
          <div className="flex items-center gap-2">
            <Send className="size-4 text-primary" />
            <h2 className="font-sans text-lg font-semibold">Create a post</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-category">
                Category
              </label>
              <select
                id="post-category"
                className="field"
                value={draft.category}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    category: event.target.value as BoardCategory,
                  }))
                }
              >
                {BOARD_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-college">
                Your college
              </label>
              <select
                id="post-college"
                className="field"
                value={draft.college}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    college: event.target.value as College,
                  }))
                }
              >
                {COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="post-title">
                Title
              </label>
              <input
                id="post-title"
                className="field"
                placeholder="e.g. Looking for summer housing near Smith"
                value={draft.title}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="post-body">
                Details
              </label>
              <textarea
                id="post-body"
                className="field min-h-28 resize-y"
                placeholder="Dates, budget, route, or anything someone needs in order to respond."
                value={draft.body}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    body: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="post-location">
                Location or route
              </label>
              <input
                id="post-location"
                className="field"
                placeholder="e.g. Northampton, or Northampton → Boston"
                value={draft.location}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    location: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              className="btn-primary"
              disabled={!draft.title.trim() || !draft.body.trim()}
              onClick={submitPost}
            >
              Publish prototype post
            </button>
            <p className="text-xs leading-5 text-muted-foreground">
              Demo only. This post exists in your browser state and is not sent anywhere.
            </p>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="size-4 shrink-0 text-muted-foreground" />
          {(["All", ...BOARD_CATEGORIES] as FilterCategory[]).map((category) => (
            <button
              key={category}
              className={filter === category ? "chip chip-on" : "chip"}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visiblePosts.map((post) => (
            <article key={post.id} className="card-soft p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag">{post.category}</span>
                    <span className="text-xs text-muted-foreground">{post.postedWhen}</span>
                  </div>
                  <h2 className="mt-3 font-sans text-lg font-semibold tracking-tight sm:text-xl">
                    {post.title}
                  </h2>
                </div>
                <Building2 className="size-5 shrink-0 text-muted-foreground" />
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{post.body}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <span>
                  {post.authorFirstName} · {post.college}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {post.location}
                </span>
                <button className="font-medium text-primary hover:underline">
                  Reply privately
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
