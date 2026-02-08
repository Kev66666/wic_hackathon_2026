"use client";

import { useEffect, useMemo, useState } from "react";
import { use } from "react";
import Link from "next/link";
import styles from "./PetPage.module.css";
import { feedPet, getPet, PetState } from "@/lib/store";

export default function PetPage(props: { params: Promise<{ relationshipId: string }> }) {
  const { relationshipId } = use(props.params);

  const [pet, setPet] = useState<PetState>({ xp: 0, level: 1, snacks: 0 });

  // ✅ 初始化 + 监听 localStorage 变化（多标签页同步）
  useEffect(() => {
    // mount 时读一次
    setPet(getPet(relationshipId));

    // 其他标签页写 localStorage 会触发 storage 事件
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === `pet:${relationshipId}`) {
        setPet(getPet(relationshipId));
      }
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [relationshipId]);

  const handleFeed = () => {
    const next = feedPet(relationshipId);
    if (!next) return;
    setPet(next);
  };

  const petAsset = useMemo(() => "/pets/dog.gif", []);

  const canFeed = pet.snacks > 0;

  const xpProgress = useMemo(() => {
    const safeXp = Number.isFinite(pet.xp) ? pet.xp : 0;
    return Math.max(0, Math.min(100, safeXp % 100));
  }, [pet.xp]);

  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} aria-hidden />

      <header className={styles.topbar}>
        <div className={styles.left}>
          <div className={styles.badge}>PET</div>
          <div className={styles.titleWrap}>
            <div className={styles.title}>Pet Status</div>
            <div className={styles.subtitle}>User</div>
          </div>
        </div>

        <Link className={styles.linkBtn} href={`/room/${relationshipId}`}>
          Back to chat →
        </Link>
      </header>

      <section className={styles.card}>
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

          <button
            onClick={handleFeed}
            disabled={!canFeed}
            className={`${styles.feedBtn} ${!canFeed ? styles.feedBtnDisabled : ""}`}
          >
            {canFeed ? "Feed 🍪" : "No snacks"}
          </button>
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

        <div className={styles.stage}>
          <img className={styles.petGif} src={petAsset} alt="pet" />
          <div className={styles.stageText}>
            {pet.level >= 5 ? (
              <span className={styles.evolved}>✨ Congrats! Your pet has evolved.</span>
            ) : (
              <span>
                Growing with your conversations in room: <b>{relationshipId}</b>
              </span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
