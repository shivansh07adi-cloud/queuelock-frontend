"use client";

import { useEffect, useState } from "react";
import FlowingMenu from "@/components/FlowingMenu";
import CurvedLoop from "@/components/CurvedLoop";
import DomeGallery, { DropCard } from "@/components/DomeGallery";
import { api, getToken } from "@/lib/api";

export default function Home() {
  const [drops, setDrops] = useState<DropCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
    api
      .listDrops()
      .then((data) =>
        setDrops(
          data.map((d: { id: string; name: string; slots_remaining: number; total_slots: number; status: string }) => ({
            id: d.id,
            name: d.name,
            slotsRemaining: d.slots_remaining,
            totalSlots: d.total_slots,
            status: d.status,
          }))
        )
      )
      .catch(() => setDrops([]))
      .finally(() => setLoading(false));
  }, []);

  const liveDrops = drops.filter((d) => d.status === "live");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between py-4 sm:py-8">
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          Flash<span className="text-signal-amber">Book</span>
        </span>
        <FlowingMenu
          items={[
            { label: "Drops", href: "/" },
            { label: loggedIn ? "Admin" : "Log in", href: loggedIn ? "/admin" : "/login" },
          ]}
        />
      </header>

      <CurvedLoop text="Limited slots · No overselling · Ever" />

      <section className="mt-2 text-center sm:mt-6">
        <h1 className="mx-auto max-w-2xl font-[family-name:var(--font-display)] text-4xl font-medium leading-tight sm:text-5xl">
          The drop starts.
          <br />
          <span className="text-signal-amber">Everyone gets a fair shot.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-paper-dim">
          A waiting room, a lock, and a ledger that never oversells - even
          when a thousand people click at once.
        </p>
      </section>

      {loading ? (
        <p className="py-16 text-center text-paper-dim">Loading drops...</p>
      ) : (
        <DomeGallery drops={liveDrops} />
      )}
    </main>
  );
}
