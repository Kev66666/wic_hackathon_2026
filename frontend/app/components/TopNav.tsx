"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TopNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    // 不强制跳转，让页面自己根据 session 变化更新
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* Left: always Home */}
      <Link href="/" style={{ fontWeight: 800, textDecoration: "none" }}>
        Home
      </Link>

      {/* Right: Login OR Profile+Logout */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {email ? (
          <>
            <Link href="/me" style={{ textDecoration: "none" }}>
              Profile
            </Link>
            <button onClick={logout} style={{ padding: "6px 10px" }}>
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              padding: "6px 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
