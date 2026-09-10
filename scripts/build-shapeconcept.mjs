import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync(new URL("./shapeconcept-data.json", import.meta.url)));
const outDir = path.resolve("public/fajas");
fs.mkdirSync(outDir, { recursive: true });

function ext(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
  return m ? m[1].toLowerCase() : "jpg";
}

const entries = [];

for (const item of data) {
  const slug = `shapeconcept-${item.handle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `${slug}.${ext(item.image)}`;
  const dest = path.join(outDir, filename);

  const res = await fetch(item.image);
  if (!res.ok) {
    console.error("FAILED", item.image, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);

  // Precio ya es sugerido de venta en USD -- NO se duplica (regla especial para este proveedor).
  const priceUsd = Math.round(item.price);
  const name = item.title.replace(/"/g, '\\"');

  entries.push(`  {
    slug: "${slug}",
    name: "${name}",
    brand: "Shape Concept",
    category: "fajas",
    priceUsd: ${priceUsd},
    shortDescription: "${name}.",
    description: "${name}. Precio sugerido de venta del proveedor.",
    highlights: ["Alta compresión", "Fabricada en Colombia"],
    image: "/fajas/${filename}",
    origin: "Hecho en Colombia",
    inStock: true,
  },`);
}

fs.writeFileSync(
  path.resolve("scripts/shapeconcept-entries.ts.txt"),
  entries.join("\n") + "\n"
);

console.log(`Done. Downloaded ${entries.length}/${data.length} images.`);
