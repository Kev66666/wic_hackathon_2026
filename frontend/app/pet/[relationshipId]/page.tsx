'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

// 定义从 Python 后端接收的数据结构
type PetState = {
  xp: number;
  level: number;
  snacks: number;
  size_multiplier: number; // 后端计算出的缩放比例
  skin: string;            // 后端返回的皮肤标识（如 "default" 或 "evolved"）
};

export default function PetPage({ params }: { params: { relationshipId: string } }) {
  // 初始状态，确保在连接上后端前 UI 不会崩溃
  const [pet, setPet] = useState<PetState>({ 
    xp: 0, 
    level: 1, 
    snacks: 0, 
    size_multiplier: 1, 
    skin: "default" 
  });

  // 从 Python FastAPI 后端同步宠物数据
  const fetchPetData = async () => {
    try {
      // 对应 Python 中的 @app.get("/api/pet/{rid}")
      const res = await fetch(`http://localhost:8000/api/pet/${params.relationshipId}`);
      if (res.ok) {
        const data = await res.json();
        setPet(data);
      }
    } catch (error) {
      console.error("无法连接到后端 Python 服务器，请确保 uvicorn 正在运行", error);
    }
  };

  // 喂食功能：通过 POST 请求消耗零食并增加经验
  const handleFeed = async () => {
    try {
      // 对应 Python 中的 @app.post("/api/pet/{rid}/feed")
      const res = await fetch(`http://localhost:8000/api/pet/${params.relationshipId}/feed`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchPetData(); // 喂食成功后立即刷新数据，看到宠物变大
      } else {
        const errData = await res.json();
        console.error("喂食失败:", errData.detail);
      }
    } catch (error) {
      alert("网络连接失败，请检查后端 API");
    }
  };

  useEffect(() => {
    fetchPetData();
    // 每 1000ms (1秒) 轮询一次。当你在聊天室发送加密消息触发 XP 增长时，
    // 此页面的宠物会实时感应并平滑地变大。
    const id = setInterval(fetchPetData, 1000);
    return () => clearInterval(id);
  }, [params.relationshipId]);

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      {/* 顶部导航与标题 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>宠物状态</h1>
        <Link href={`/room/${params.relationshipId}`} style={{ textDecoration: "underline", color: "#666" }}>
          回到房间聊天 →
        </Link>
      </div>

      <div style={{ marginTop: 16, padding: 24, border: "1px solid #eee", borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>等级：<span style={{ color: "#0070f3" }}>{pet.level}</span></div>
            <div style={{ marginTop: 8, color: "#666" }}>当前经验值 (XP)：<b>{pet.xp}</b></div>
            <div style={{ marginTop: 8, color: "#666" }}>零食储备：<b>{pet.snacks}</b> 🍪</div>
          </div>
          
          {/* 喂食按钮：零食耗尽时自动置灰 */}
          <button 
            onClick={handleFeed}
            disabled={pet.snacks <= 0}
            style={{
              padding: "12px 24px",
              backgroundColor: pet.snacks > 0 ? "#FFD700" : "#E0E0E0",
              color: pet.snacks > 0 ? "#000" : "#999",
              border: "none",
              borderRadius: 14,
              cursor: pet.snacks > 0 ? "pointer" : "not-allowed",
              fontWeight: "bold",
              transition: "transform 0.2s active"
            }}
          >
            {pet.snacks > 0 ? "喂食 🍪" : "零食空了"}
          </button>
        </div>

        {/* 宠物展示容器：变大变小的视觉核心 */}
        <div style={{ 
          marginTop: 32, 
          padding: "80px 20px", 
          borderRadius: 24, 
          border: "2px dashed #f0f0f0",
          textAlign: "center",
          backgroundColor: "#fafafa",
          position: "relative"
        }}>
          <div style={{ 
            fontSize: 80, 
            display: "inline-block",
            // 使用 transform: scale 实现根据后端倍率的平滑缩放
            transform: `scale(${pet.size_multiplier})`,
            // 贝塞尔曲线让缩放动画具有“弹性”质感
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" 
          }}>
            {/* 根据后端返回的皮肤标识切换形态 */}
            {pet.skin === "evolved" ? "🐉" : "🐾"}
          </div>
          
          <div style={{ marginTop: 40, fontWeight: 500 }}>
            {pet.level >= 5 ? (
              <span style={{ color: "#f5a623" }}>✨ 恭喜！它已进化为神兽形态</span>
            ) : (
              <span style={{ color: "#999" }}>房间：{params.relationshipId} 的守护灵成长中</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}