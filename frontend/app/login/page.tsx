"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setMsg("Please enter email and password.");
      return;
    }

    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.replace("/me");
  }

  async function handleSignUp() {
    if (!email || !password) {
      setMsg("Please enter email and password.");
      return;
    }

    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.replace("/me");
  }

  return (
    <main className={styles.page}>
      <div className={styles.overlay} />

      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to grow your shared pet together 🌱
        </p>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={styles.primaryBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            Login
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={handleSignUp}
            disabled={loading}
          >
            Sign Up
          </button>

          {msg && <div className={styles.error}>{msg}</div>}

          <Link href="/" className={styles.homeLink}>
            ← Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
