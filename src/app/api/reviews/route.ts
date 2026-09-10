import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Falta productId" }, { status: 400 });
  }

  const reviews = await query<{
    id: number;
    customer_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
  }>(
    `SELECT id, customer_name, rating, comment, created_at
     FROM reviews WHERE product_id = $1 AND approved = true
     ORDER BY created_at DESC`,
    [productId]
  );

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({ reviews, average: avg, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const { productId, customerName, rating, comment } = await req.json();

  if (!productId || !customerName || !rating) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Calificación inválida" }, { status: 400 });
  }

  await query(
    `INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4)`,
    [productId, customerName, rating, comment || null]
  );

  return NextResponse.json({ ok: true, message: "¡Gracias! Tu reseña se publicará luego de ser revisada." });
}
