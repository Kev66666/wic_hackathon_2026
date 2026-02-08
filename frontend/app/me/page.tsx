"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login?next=/me");
        return;
      }
      setEmail(data.session.user.email ?? "");
    })();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <main className={styles.page}>
      {/* Countryside overlays (make text readable + dreamy) */}
      <div className={styles.overlay} />
      <div className={styles.haze} />

      {/* Profile card */}
      <section className={styles.card}>
        <span className={styles.badge}>🌾 Countryside Life</span>

        <h1 className={styles.title}>Profile</h1>
        <p className={styles.sub}>
          Slow down and enjoy the sunshine.
        </p>

        <div className={styles.profileRow}>
          <div className={styles.label}>Email</div>
          <div className={styles.value}>{email || "(no email)"}</div>
        </div>

        <button className={styles.btn} onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}