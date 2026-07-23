"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FlapCounter from "@/components/FlapCounter";
import PixelTransition from "@/components/PixelTransition";
import { api, getToken } from "@/lib/api";

type Drop = {
  id: string;
  name: string;
  slots_remaining: number;
  total_slots: number;
  status: string;
  start_time: string;
};

type FlowState =
  | "idle"
  | "queued"
  | "admitted"
  | "booked"
  | "paying"
  | "confirmed"
  | "sold_out"
  | "error";

export default function DropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dropId = params.id as string;

  const [drop, setDrop] = useState<Drop | null>(null);
  const [flow, setFlow] = useState<FlowState>("idle");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll the drop's own counter every 2s so slots_remaining feels "live"
  // without needing a websocket for this project's scope.
  useEffect(() => {
    let active = true;
    const load = () => api.getDrop(dropId).then((d) => active && setDrop(d)).catch(() => {});
    load();
    const t = setInterval(load, 2000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [dropId]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleJoinQueue() {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    setMessage(null);
    try {
      const result = await api.joinQueue(dropId);
      if (result.admitted) {
        setFlow("admitted");
        return;
      }
      setFlow("queued");
      setQueuePosition(result.position);
      pollRef.current = setInterval(async () => {
        try {
          const status = await api.queueStatus(dropId);
          if (status.admitted) {
            setFlow("admitted");
            if (pollRef.current) clearInterval(pollRef.current);
          } else {
            setQueuePosition(status.position);
          }
        } catch {
          // transient poll error - try again next tick
        }
      }, 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Couldn't join the queue");
      setFlow("error");
    }
  }

  async function handleBook() {
    setMessage(null);
    try {
      const booking = await api.book(dropId);
      setBookingId(booking.id);
      setFlow("booked");
    } catch (err) {
      const e = err as { status?: number; message: string };
      if (e.status === 409) {
        setFlow("sold_out");
        setMessage("Sold out - every slot is taken.");
      } else {
        setMessage(e.message);
        setFlow("error");
      }
    }
  }

  async function handlePay() {
    if (!bookingId) return;
    setFlow("paying");
    setMessage(null);
    try {
      const idempotencyKey = `pay-${bookingId}-${Date.now()}`;
      await api.pay(bookingId, idempotencyKey);
      setFlow("confirmed");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment failed");
      setFlow("error");
    }
  }

  if (!drop) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center text-paper-dim">
        Loading drop...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="mb-1 text-xs uppercase tracking-widest text-paper-dim">
        {drop.status === "live" ? "Live now" : drop.status}
      </p>
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl font-medium">
        {drop.name}
      </h1>

      <PixelTransition triggerKey={drop.slots_remaining}>
        <div className="rounded-2xl border border-ink-line bg-ink-raised p-8">
          <p className="mb-3 text-xs uppercase tracking-widest text-paper-dim">
            Slots remaining
          </p>
          <FlapCounter value={drop.slots_remaining} digits={String(drop.total_slots).length} />
        </div>
      </PixelTransition>

      <div className="mt-8">
        {flow === "idle" && drop.status === "live" && (
          <button
            onClick={handleJoinQueue}
            className="w-full rounded-lg bg-signal-amber px-4 py-3 text-sm font-semibold text-ink hover:opacity-90"
          >
            Join the waiting room
          </button>
        )}

        {flow === "idle" && drop.status !== "live" && (
          <p className="text-center text-sm text-paper-dim">
            This drop isn&apos;t open for booking right now.
          </p>
        )}

        {flow === "queued" && (
          <div className="rounded-lg border border-ink-line bg-ink-raised p-5 text-center">
            <p className="text-sm text-paper-dim">Your position in line</p>
            <p className="mt-1 font-[family-name:var(--font-flap)] text-2xl text-signal-cyan">
              #{queuePosition ?? "..."}
            </p>
          </div>
        )}

        {flow === "admitted" && (
          <button
            onClick={handleBook}
            className="w-full animate-pulse rounded-lg bg-signal-cyan px-4 py-3 text-sm font-semibold text-ink hover:opacity-90"
          >
            It&apos;s your turn — book now
          </button>
        )}

        {flow === "booked" && (
          <button
            onClick={handlePay}
            className="w-full rounded-lg bg-signal-amber px-4 py-3 text-sm font-semibold text-ink hover:opacity-90"
          >
            Confirm with payment
          </button>
        )}

        {flow === "paying" && (
          <p className="text-center text-sm text-paper-dim">Processing payment...</p>
        )}

        {flow === "confirmed" && (
          <p className="rounded-lg border border-signal-cyan/40 bg-signal-cyan/10 p-5 text-center text-sm text-signal-cyan">
            Confirmed. Your slot is yours.
          </p>
        )}

        {flow === "sold_out" && (
          <p className="rounded-lg border border-signal-amber/40 bg-signal-amber/10 p-5 text-center text-sm text-signal-amber">
            {message}
          </p>
        )}

        {flow === "error" && message && (
          <p className="text-center text-sm text-signal-amber">{message}</p>
        )}
      </div>
    </main>
  );
}
