import { Pool } from "pg";
import fs from "node:fs";
import { products } from "../src/data/products.ts";

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="(.+)"/m);
if (!match) throw new Error("DATABASE_URL not found in .env.local");

const pool = new Pool({ connectionString: match[1] });

const suppliers: Record<string, { website: string }> = {
  "Mindfuel": { website: "https://joinmindfuel.com" },
  "Nobrand": { website: "https://seamlesscolombia.com" },
  "OWfit": { website: "https://owfit.co" },
  "Colombian Gymwear": { website: "https://colombiangymwear.com" },
  "DeColombia Joyas": { website: "https://decolombiajoyas.com/joyeriaoroplata" },
  "Fajas Salomé": { website: "https://fajasalome.co" },
  "Fajas M&D": { website: "https://fajasmyd.com" },
  "Fajas MariaE": { website: "https://fajasmariae.com" },
  "Shape Concept": { website: "https://shapeconcept.co" },
  "Milagros Beauty": { website: "https://milagrosbeauty.com" },
};

async function main() {
  const supplierIds: Record<string, number> = {};

  for (const [name, info] of Object.entries(suppliers)) {
    const res = await pool.query<{ id: number }>(
      `INSERT INTO suppliers (name, website) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING id`,
      [name, info.website]
    );
    if (res.rows[0]) {
      supplierIds[name] = res.rows[0].id;
    } else {
      const existing = await pool.query<{ id: number }>(
        `SELECT id FROM suppliers WHERE name = $1`,
        [name]
      );
      supplierIds[name] = existing.rows[0].id;
    }
  }

  let inserted = 0;
  for (const p of products) {
    const costUsd = p.brand === "Shape Concept" ? null : Math.round((p.priceUsd / 2) * 100) / 100;
    const supplierId = supplierIds[p.brand] ?? null;

    await pool.query(
      `INSERT INTO products
        (slug, name, brand, category, supplier_id, cost_usd, price_usd, stock_qty, units_sold,
         short_description, description, highlights, image, origin, in_stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,0,0,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         brand = EXCLUDED.brand,
         category = EXCLUDED.category,
         supplier_id = EXCLUDED.supplier_id,
         cost_usd = EXCLUDED.cost_usd,
         price_usd = EXCLUDED.price_usd,
         short_description = EXCLUDED.short_description,
         description = EXCLUDED.description,
         highlights = EXCLUDED.highlights,
         image = EXCLUDED.image,
         origin = EXCLUDED.origin,
         in_stock = EXCLUDED.in_stock,
         updated_at = now()
      `,
      [
        p.slug,
        p.name,
        p.brand,
        p.category,
        supplierId,
        costUsd,
        p.priceUsd,
        p.shortDescription,
        p.description,
        JSON.stringify(p.highlights),
        p.image,
        p.origin,
        p.inStock,
      ]
    );
    inserted++;
  }

  console.log(`Migrated ${inserted} products, ${Object.keys(supplierIds).length} suppliers.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
