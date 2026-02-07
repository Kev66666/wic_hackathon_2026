'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700 }}>Pet Together 🐾</h1>
      <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
        和远方的家人朋友一起养一只电子宠物：发消息、发照片就能奖励宠物！
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <Link href="/room/demo" style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 10 }}>
          进入 Demo 房间
        </Link>
        <Link href="/pet/demo" style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 10 }}>
          查看宠物
        </Link>
      </div>
    </main>
  );
}
