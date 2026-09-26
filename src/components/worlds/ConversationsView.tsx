import { useMemo, useState } from "react";
import { LockKeyhole, MessageCircle, Send, ShieldCheck, UsersRound, Video } from "lucide-react";
import { CONVERSATIONS, type ConversationMessage } from "@/data/network";

export function ConversationsView() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, ConversationMessage[]>>({});
  const [virtualRequested, setVirtualRequested] = useState(false);

  const active = useMemo(
    () => CONVERSATIONS.find((conversation) => conversation.id === activeId),
    [activeId],
  );

  const messages = active ? [...active.messages, ...(localMessages[active.id] ?? [])] : [];

  const send = () => {
    const text = draft.trim();
    if (!active || !text) return;

    const next: ConversationMessage = {
      id: `local-message-${Date.now()}`,
      sender: "You",
      college: "Smith College",
      text,
      time: "Now",
    };

    setLocalMessages((previous) => ({
      ...previous,
      [active.id]: [...(previous[active.id] ?? []), next],
    }));
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Private conversations
        </p>
        <h1 className="mt-3 font-sans text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Talk across campuses without exposing the whole network.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          You see conversations you joined and the people who actively participate. There is no
          public member directory or giant group roster.
        </p>
      </header>

      <div className="grid min-h-[620px] overflow-hidden rounded-[1.2rem] border border-border bg-card shadow-soft lg:grid-cols-[0.36fr_0.64fr]">
        <aside className="border-b border-border bg-secondary/35 lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" />
              <h2 className="font-sans text-sm font-semibold">Your conversations</h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Topic-based, small, and opt-in.
            </p>
          </div>

          <div className="p-2">
            {CONVERSATIONS.map((conversation) => {
              const selected = conversation.id === activeId;
              return (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setActiveId(conversation.id);
                    setVirtualRequested(false);
                  }}
                  className={`w-full rounded-xl p-4 text-left transition ${
                    selected ? "bg-card shadow-sm" : "hover:bg-card/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{conversation.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {conversation.lastUpdated}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {conversation.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <UsersRound className="size-3" />
                      {conversation.participantCount} participants
                    </span>
                    <span>{conversation.collegeCount} colleges</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col">
          {active ? (
            <>
              <div className="border-b border-border p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-xl font-semibold">{active.title}</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                      {active.description}
                    </p>
                  </div>
                  <button className="btn-quiet" onClick={() => setVirtualRequested(true)}>
                    <Video className="size-4" />
                    Suggest virtual meetup
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <LockKeyhole className="size-3.5" />
                    Member list hidden
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    You see people when they participate
                  </span>
                </div>

                {virtualRequested && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/7 p-4 text-sm leading-6">
                    <p className="font-medium text-primary">Virtual meetup suggested.</p>
                    <p className="mt-1 text-muted-foreground">
                      In the real product, each participant would opt in privately before a time or
                      meeting link is revealed.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
                {messages.map((message) => (
                  <div key={message.id} className="max-w-2xl">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold">{message.sender}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.college} · {message.time}
                      </p>
                    </div>
                    <p className="mt-1.5 rounded-xl bg-secondary/60 px-4 py-3 text-sm leading-6">
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4 sm:p-5">
                <div className="flex gap-2">
                  <input
                    className="field"
                    placeholder="Write to this conversation…"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") send();
                    }}
                  />
                  <button
                    className="btn-primary shrink-0 px-4"
                    disabled={!draft.trim()}
                    onClick={send}
                    aria-label="Send prototype message"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  Prototype only. Messages stay in browser state.
                </p>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-sm text-muted-foreground">
              Select a conversation.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
