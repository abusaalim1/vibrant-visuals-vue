import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Music2 } from "lucide-react";
import { useState } from "react";
import { PhoneShell } from "@/components/usora/PhoneShell";
import { AmbientBackdrop } from "@/components/usora/Blobs";

export const Route = createFileRoute("/playlist")({ component: Playlist });

const TRACKS = [
  { title: "First Dance", artist: "The XX", duration: "3:42", vibe: "Romantic" },
  { title: "Our Song", artist: "Local Natives", duration: "4:12", vibe: "Nostalgic" },
  { title: "Slow Sunday", artist: "Bon Iver", duration: "3:55", vibe: "Calm" },
  { title: "Chai Mornings", artist: "Prateek Kuhad", duration: "3:28", vibe: "Cozy" },
  { title: "The Drive Home", artist: "Cigarettes After Sex", duration: "4:03", vibe: "Dreamy" },
  { title: "Little Things", artist: "Lianne La Havas", duration: "3:34", vibe: "Sweet" },
];

function Playlist() {
  const nav = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [current] = useState(0);
  const track = TRACKS[current];

  return (
    <PhoneShell>
      <AmbientBackdrop />
      <header className="relative flex items-center justify-between px-6 pt-8">
        <button
          onClick={() => nav({ to: "/profile" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-[13px] font-semibold text-ink">Our Playlist</span>
        <Heart className="h-4 w-4 text-[color:var(--primary)]" fill="currentColor" />
      </header>

      <main className="relative flex-1 px-6 pb-10">
        {/* Album art */}
        <div className="relative mx-auto mt-6 h-64 w-64">
          <div
            className="absolute inset-0 rounded-[32px] shadow-float"
            style={{
              background:
                "conic-gradient(from 30deg, #ffb0c6, #ff7ca3, #ff4470, #ffd0dc, #ffb0c6)",
            }}
          />
          <div className="absolute inset-4 flex items-center justify-center rounded-[24px] bg-white/20 backdrop-blur-sm">
            <Music2 className="h-16 w-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
            {track.vibe}
          </p>
          <h1 className="font-display mt-1 text-[28px] text-ink">{track.title}</h1>
          <p className="text-[13px] text-muted-ink">{track.artist}</p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="relative h-1 rounded-full bg-[color:var(--hairline)]">
            <motion.div
              animate={{ width: playing ? "72%" : "30%" }}
              transition={{ duration: 20, ease: "linear" }}
              className="h-full rounded-full bg-gradient-primary"
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-ink">
            <span>1:14</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white">
            <SkipBack className="h-5 w-5 text-ink" fill="currentColor" />
          </button>
          <button
            onClick={() => setPlaying((v) => !v)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-cta transition active:scale-95"
          >
            {playing ? (
              <Pause className="h-6 w-6 text-white" fill="white" />
            ) : (
              <Play className="ml-1 h-6 w-6 text-white" fill="white" />
            )}
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-white">
            <SkipForward className="h-5 w-5 text-ink" fill="currentColor" />
          </button>
        </div>

        {/* Track list */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-ink">
            Up next
          </p>
          <div className="mt-3 space-y-2">
            {TRACKS.slice(1).map((t, i) => (
              <div
                key={t.title}
                className="flex items-center gap-3 rounded-2xl border border-[color:var(--hairline)] bg-white p-3"
              >
                <span className="w-5 text-[12px] text-muted-ink">{i + 2}</span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-medium text-ink">{t.title}</p>
                  <p className="text-[11.5px] text-muted-ink">{t.artist}</p>
                </div>
                <span className="text-[11px] text-muted-ink">{t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PhoneShell>
  );
}
