'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eef6ff 0%, #ffffff 60%)",
        padding: "60px 20px",
      }}
    >
      {/* Main container */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Header card */}
        <header
          style={{
            padding: "28px 28px",
            borderRadius: 22,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: "linear-gradient(135deg,#22c55e,#3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#fff",
                fontWeight: 800,
              }}
            >
              🐾
            </div>

            <div>
              <h1
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Pet Together
              </h1>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 15,
                  color: "#555",
                }}
              >
                Grow a shared pet through conversations
              </p>
            </div>
          </div>
        </header>

        {/* Intro card */}
        <section
          style={{
            padding: "26px 26px",
            borderRadius: 22,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            🌱 Raise a Pet Together
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#666",
            }}
          >
            Raise a virtual pet with family and friends far away.
            Every message or photo you send rewards your shared pet,
            helping it grow stronger over time.
          </p>
        </section>

        {/* Action buttons */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Chat button */}
          <Link
            href="/room/demo"
            style={{
              padding: "18px 18px",
              borderRadius: 18,
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "#fff",
              fontWeight: 800,
              textAlign: "center",
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
              transition: "transform 0.15s ease",
            }}
          >
            💬 Enter Chat
          </Link>

          {/* Pet button */}
          <Link
            href="/pet/demo"
            style={{
              padding: "18px 18px",
              borderRadius: 18,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              fontWeight: 800,
              textAlign: "center",
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(34,197,94,0.25)",
              transition: "transform 0.15s ease",
            }}
          >
            🐶 View Pet
          </Link>
        </section>

        {/* Footer hint */}
        <footer
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#888",
            marginTop: 12,
          }}
        >
          ✨ More chatting → More growth → A stronger shared pet
        </footer>
      </div>
    </main>
  );
}
