import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="(.+)"/m);
const pool = new Pool({ connectionString: match[1] });

const data = JSON.parse(fs.readFileSync(new URL("./soma-data.json", import.meta.url)));
const outDir = path.resolve("public/soma");
fs.mkdirSync(outDir, { recursive: true });

function ext(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
  return m ? m[1].toLowerCase() : "jpg";
}

async function main() {
  const supplierRes = await pool.query(
    `INSERT INTO suppliers (name, website) VALUES ('SOMA', 'https://usasoma.com')
     ON CONFLICT DO NOTHING RETURNING id`
  );
  let supplierId = supplierRes.rows[0]?.id;
  if (!supplierId) {
    const existing = await pool.query(`SELECT id FROM suppliers WHERE name = 'SOMA'`);
    supplierId = existing.rows[0].id;
  }

  let count = 0;
  for (const item of data) {
    const slug = item.handle.toLowerCase();
    const filename = `${slug}.${ext(item.image)}`;
    const dest = path.join(outDir, filename);

    const res = await fetch(item.image);
    if (!res.ok) {
      console.error("FAILED", item.image, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);

    const priceUsd = Math.round((item.price / 4300) * 2);
    const costUsd = Math.round((item.price / 4300) * 100) / 100;

    await pool.query(
      `INSERT INTO products
        (slug, name, brand, category, supplier_id, cost_usd, price_usd, stock_qty, units_sold,
         short_description, description, highlights, image, origin, in_stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,0,0,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (slug) DO UPDATE SET
         price_usd = EXCLUDED.price_usd,
         cost_usd = EXCLUDED.cost_usd,
         image = EXCLUDED.image,
         updated_at = now()`,
      [
        slug,
        item.title,
        "SOMA",
        "salud-y-cuidado-personal",
        supplierId,
        costUsd,
        priceUsd,
        item.desc,
        item.desc,
        JSON.stringify(["Marca SOMA", "Hecho en Colombia"]),
        `/soma/${filename}`,
        "Hecho en Colombia",
        true,
      ]
    );
    count++;
  }

  console.log(`Done. Inserted/updated ${count}/${data.length} products.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
