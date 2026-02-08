"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { use } from "react";
import Link from "next/link";
import styles from "./RoomPage.module.css";
import { addMessage, getEvents, getPet, RoomEvent, PetState } from "@/lib/store";

export default function RoomPage(props: { params: Promise<{ relationshipId: string }> }) {
  const { relationshipId } = use(props.params);

  const [text, setText] = useState("");
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const [pet, setPet] = useState<PetState>({ xp: 0, level: 1, snacks: 0 });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ 初始化：读取本地 events + pet
  useEffect(() => {
    setEvents(getEvents(relationshipId));
    setPet(getPet(relationshipId));
  }, [relationshipId]);

  function onSend() {
    const t = text.trim();
    if (!t) return;

    addMessage(relationshipId, {
      id: crypto.randomUUID(),
      type: "message",
      text: t,
      createdAt: Date.now(),
      sender: "me",
    });

    // ✅ 关键：重新读 events + pet（snacks 已在 addMessage 里+1）
    setEvents(getEvents(relationshipId));
    setPet(getPet(relationshipId));
    setText("");
  }

  // store 是 oldest-first（我们存进去就是顺序追加的）
  const orderedEvents = useMemo(() => events, [events]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [orderedEvents.length]);

  const xpProgress = useMemo(() => {
    const safeXp = Number.isFinite(pet.xp) ? pet.xp : 0;
    return Math.max(0, Math.min(100, safeXp % 100));
  }, [pet.xp]);

  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} aria-hidden />

      <header className={styles.topbar}>
        <div className={styles.left}>
          <div className={styles.badge}>CHAT</div>
          <div className={styles.titleWrap}>
            <div className={styles.title}>Room</div>
            <div className={styles.subtitle}>User</div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link className={styles.linkBtn} href={`/pet/${relationshipId}`}>
            View Pet →
          </Link>
        </div>
      </header>

      {/* Pet “hero” card */}
      <section className={styles.petHero}>
        <div className={styles.petMedia}>
          <img className={styles.petGif} src="/pets/dog.gif" alt="pet" />
          <div className={styles.petOverlay} />
        </div>

        <div className={styles.petInfo}>
          <div className={styles.petKicker}>Your Shared Pet</div>
          <div className={styles.petHeadline}>Grows as you chat together</div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Level</div>
              <div className={styles.statValue}>{pet.level}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>XP</div>
              <div className={styles.statValue}>{pet.xp}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Snacks</div>
              <div className={styles.statValue}>
                {pet.snacks} <span className={styles.cookie}>🍪</span>
              </div>
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressTop}>
              <span>XP progress</span>
              <span className={styles.progressPct}>{xpProgress}%</span>
            </div>
            <div className={styles.progressTrack} aria-label="XP progress">
              <div className={styles.progressFill} style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Chat card */}
      <section className={styles.chatCard} aria-label="Chat messages">
        <div className={styles.chatHeader}>
          <div>
            <div className={styles.chatTitle}>Messages</div>
            <div className={styles.chatHint}>More messages → more growth ✨</div>
          </div>
          <div className={styles.chatPill}>Local</div>
        </div>

        <div className={styles.msgList}>
          {orderedEvents.map((e) => {
            const side = e.sender === "me" ? styles.me : styles.partner;

            return (
              <div key={e.id} className={`${styles.msgRow} ${side}`}>
                <div className={styles.meta}>{new Date(e.createdAt).toLocaleString()}</div>

                <div className={styles.bubble}>
                  <div className={styles.bubbleType}>
                    {e.type === "message" ? "Message" : "Photo"}
                  </div>
                  <div className={styles.bubbleText}>
                    {e.text || (e.type === "photo" ? "[Photo]" : "")}
                  </div>
                </div>
              </div>
            );
          })}

          {orderedEvents.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>💬</div>
              <div className={styles.emptyTitle}>No messages yet</div>
              <div className={styles.emptySub}>Send the first one to start growing your pet.</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className={styles.composer}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className={styles.input}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button onClick={onSend} className={styles.sendBtn}>
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
