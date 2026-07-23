"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [totalSlots, setTotalSlots] = useState(10);
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const drop = await api.createDrop({
        name,
        total_slots: totalSlots,
        per_user_limit: perUserLimit,
        start_time: new Date().toISOString(),
      });
      setCreated(drop);
    } catch (err) {
      const e2 = err as { status?: number; message: string };
      setError(
        e2.status === 403
          ? "Your account isn't an admin. Promote it in the database, then log in again."
          : e2.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoLive() {
    if (!created) return;
    await api.setDropStatus(created.id, "live");
    router.push(`/drops/${created.id}`);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-2xl font-medium">
        Create a drop
      </h1>

      {!created ? (
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <label className="text-xs uppercase tracking-widest text-paper-dim">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Diwali merch drop"
            className="rounded-lg border border-ink-line bg-ink-raised px-4 py-3 text-sm outline-none focus:border-signal-cyan"
          />

          <label className="mt-2 text-xs uppercase tracking-widest text-paper-dim">
            Total slots
          </label>
          <input
            type="number"
            min={1}
            required
            value={totalSlots}
            onChange={(e) => setTotalSlots(Number(e.target.value))}
            className="rounded-lg border border-ink-line bg-ink-raised px-4 py-3 text-sm outline-none focus:border-signal-cyan"
          />

          <label className="mt-2 text-xs uppercase tracking-widest text-paper-dim">
            Per-user limit
          </label>
          <input
            type="number"
            min={1}
            required
            value={perUserLimit}
            onChange={(e) => setPerUserLimit(Number(e.target.value))}
            className="rounded-lg border border-ink-line bg-ink-raised px-4 py-3 text-sm outline-none focus:border-signal-cyan"
          />

          {error && <p className="text-sm text-signal-amber">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg bg-signal-cyan px-4 py-3 text-sm font-semibold text-ink hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Create drop"}
          </button>
        </form>
      ) : (
        <div className="rounded-lg border border-ink-line bg-ink-raised p-6 text-center">
          <p className="mb-4 text-sm text-paper-dim">
            &ldquo;{created.name}&rdquo; is created as a draft.
          </p>
          <button
            onClick={handleGoLive}
            className="w-full rounded-lg bg-signal-amber px-4 py-3 text-sm font-semibold text-ink hover:opacity-90"
          >
            Go live now
          </button>
        </div>
      )}
    </main>
  );
}
