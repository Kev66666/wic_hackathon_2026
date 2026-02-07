'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { addMessage, getEvents } from "../../../lib/store";

type RoomEvent = {
  id: string;
  type: "message" | "photo";
  text?: string;
  createdAt: number;
};

type PetState = {
  xp: number;
  level: number;
  snacks: number;
};

export default function RoomPage({ params }: { params: { relationshipId: string } }) {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const [pet, setPet] = useState<PetState>({ xp: 0, level: 1, snacks: 0 });

  // 从 Python FastAPI 后端同步宠物数据
  const fetchPetData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/pet/${params.relationshipId}`);
      if (res.ok) {
        const data = await res.json();
        setPet(data);
      }
    } catch (error) {
      console.error("无法同步宠物数据:", error);
    }
  };

  useEffect(() => {
    setEvents(getEvents() as RoomEvent[]);
    
    // 初始化加载数据
    fetchPetData();

    // 设置轮询，每 2 秒同步一次后端状态，保证两个页面数据一致
    const timer = setInterval(fetchPetData, 2000);
    return () => clearInterval(timer);
  }, [params.relationshipId]);

  function onSend() {
    const t = text.trim();
    if (!t) return;
    
    // 本地存储消息
    addMessage(t);
    setText("");
    setEvents(getEvents() as RoomEvent[]);
    
    // 消息发送后立即尝试更新一次宠物状态（假设发送消息会触发后端 XP 增加）
    fetchPetData();
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>房间：{params.relationshipId}</h1>
        <Link href={`/pet/${params.relationshipId}`} style={{ textDecoration: "underline" }}>
          去看宠物 →
        </Link>
      </div>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
        <div>宠物等级：<b>{pet.level}</b></div>
        <div>XP：<b>{pet.xp}</b></div>
        <div>零食：<b>{pet.snacks}</b> 🍪</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="发一句消息…"
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        />
        <button onClick={onSend} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ccc" }}>
          发送
        </button>
      </div>

      <h2 style={{ marginTop: 20, fontSize: 18, fontWeight: 700 }}>事件</h2>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {events.map((e) => (
          <div key={e.id} style={{ padding: 10, border: "1px solid #eee", borderRadius: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {new Date(e.createdAt).toLocaleString()}
            </div>
            <div style={{ marginTop: 4 }}>
              <b>{e.type}:</b> {e.text}
            </div>
          </div>
        ))}
        {events.length === 0 && <div style={{ opacity: 0.7 }}>还没有事件，先发一条试试。</div>}
      </div>
    </main>
  );
}