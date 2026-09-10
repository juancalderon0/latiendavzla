import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { pool, query } from "@/lib/db";

const DAILY_LIMIT = 10;

async function buildContext() {
  const products = await query<{
    name: string;
    brand: string;
    category: string;
    price_usd: string;
    stock_qty: number;
    units_sold: number;
  }>(`
    SELECT name, brand, category, price_usd, stock_qty, units_sold
    FROM products ORDER BY category, name
  `);

  const [orderStats] = await query<{ confirmed: string; revenue: string; pending: string }>(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'confirmed')::text AS confirmed,
      COALESCE(SUM(total_usd) FILTER (WHERE status = 'confirmed'), 0)::text AS revenue,
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending
    FROM orders
  `);

  const suppliers = await query<{ name: string; website: string | null }>(
    `SELECT name, website FROM suppliers ORDER BY name`
  );

  const categoryCounts = await query<{ category: string; total: string; total_stock: string }>(`
    SELECT category, COUNT(*)::text AS total, COALESCE(SUM(stock_qty), 0)::text AS total_stock
    FROM products GROUP BY category ORDER BY category
  `);

  const productLines = products
    .map(
      (p) =>
        `- ${p.name} | ${p.brand} | ${p.category} | $${Number(p.price_usd).toFixed(2)} | stock: ${p.stock_qty} | vendidos: ${p.units_sold}`
    )
    .join("\n");

  const supplierLines = suppliers.map((s) => `- ${s.name} (${s.website ?? "sin sitio"})`).join("\n");

  const categoryLines = categoryCounts
    .map((c) => `- ${c.category}: ${c.total} productos, ${c.total_stock} unidades en stock`)
    .join("\n");

  return `TOTALES YA CALCULADOS POR CATEGORÍA (usa estos números exactos, NUNCA cuentes las líneas del catálogo tú mismo):
${categoryLines}
Total de productos en el catálogo: ${products.length}

CATÁLOGO COMPLETO, útil para precios/características/stock de un producto específico (nombre | marca | categoría | precio | stock | unidades vendidas):
${productLines}

PROVEEDORES:
${supplierLines}

RESUMEN DE VENTAS: ${orderStats?.confirmed ?? 0} pedidos confirmados, USD ${Number(orderStats?.revenue ?? 0).toFixed(2)} en ingresos, ${orderStats?.pending ?? 0} pedidos pendientes de confirmar.`;
}

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Falta la pregunta" }, { status: 400 });
  }

  const usageRes = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM assistant_usage WHERE used_at::date = CURRENT_DATE`
  );
  const usedToday = Number(usageRes.rows[0]?.count ?? 0);

  if (usedToday >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: `Ya usaste tus ${DAILY_LIMIT} preguntas de hoy. Vuelve mañana.` },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "El asistente todavía no está configurado (falta la clave de API)." },
      { status: 503 }
    );
  }

  const context = await buildContext();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: `Eres el asistente interno de La Tienda VZLA, un ecommerce venezolano. SOLO respondes preguntas relacionadas con el negocio: inventario, características de productos, proveedores, ventas, pedidos, clientes o el catálogo en general. Si te preguntan algo fuera de ese alcance (temas personales, generales, no relacionados con la tienda), responde amablemente que solo puedes ayudar con temas de la tienda. Sé breve y directo. Usa los datos reales a continuación para responder con precisión, no inventes cifras.

${context}`,
    messages: [{ role: "user", content: question }],
  });

  await pool.query(`INSERT INTO assistant_usage DEFAULT VALUES`);
  await pool.query(
    `INSERT INTO assistant_messages (role, content) VALUES ('user', $1), ('assistant', $2)`,
    [question, message.content[0].type === "text" ? message.content[0].text : ""]
  );

  const answer = message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ answer, remaining: DAILY_LIMIT - usedToday - 1 });
}

export async function GET() {
  const usageRes = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM assistant_usage WHERE used_at::date = CURRENT_DATE`
  );
  const usedToday = Number(usageRes.rows[0]?.count ?? 0);

  const history = await query<{ role: string; content: string; created_at: string }>(
    `SELECT role, content, created_at FROM assistant_messages ORDER BY created_at DESC LIMIT 20`
  );

  return NextResponse.json({
    remaining: Math.max(0, DAILY_LIMIT - usedToday),
    limit: DAILY_LIMIT,
    history: history.reverse(),
  });
}
