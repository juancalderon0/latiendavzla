"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  return (
    <span className={`text-amber-500 ${size}`}>
      {"★".repeat(Math.round(value))}
      <span className="text-black/20">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(data.reviews);
    setAverage(data.average);
    setCount(data.count);
  }

  useEffect(() => {
    load();
  }, [productId]);

  async function submit() {
    if (!name.trim()) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, customerName: name, rating, comment }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setName("");
      setComment("");
      setRating(5);
      setShowForm(false);
    }
  }

  return (
    <div className="border-t border-black/10 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Reseñas</h2>
          {count > 0 ? (
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Stars value={average} />
              <span className="text-black/60">
                {average.toFixed(1)} · {count} {count === 1 ? "reseña" : "reseñas"}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-black/50">Aún sin reseñas — sé el primero en opinar.</p>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Dejar reseña
        </button>
      </div>

      {showForm && (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-black/10 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={n <= rating ? "text-amber-500" : "text-black/20"}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos tu experiencia (opcional)"
            rows={3}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <button
            onClick={submit}
            className="self-start rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Enviar reseña
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

      <div className="mt-4 flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-black/10 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.customer_name}</span>
              <Stars value={r.rating} size="text-sm" />
            </div>
            {r.comment && <p className="mt-1 text-black/70">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
