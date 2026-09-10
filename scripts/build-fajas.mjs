import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync(new URL("./fajas-data.json", import.meta.url)));
const outDir = path.resolve("public/fajas");
fs.mkdirSync(outDir, { recursive: true });

function slugify(brandPrefix, handle) {
  return `${brandPrefix}-${handle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function brandPrefix(brand) {
  if (brand.includes("Salomé")) return "salome";
  if (brand.includes("M&D")) return "myd";
  return "mariae";
}

function ext(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
  return m ? m[1].toLowerCase() : "jpg";
}

const entries = [];

for (const item of data) {
  const prefix = brandPrefix(item.brand);
  const slug = slugify(prefix, item.handle);
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
  const name = item.title.replace(/"/g, '\\"');

  entries.push(`  {
    slug: "${slug}",
    name: "${name}",
    brand: "${item.brand}",
    category: "fajas",
    priceUsd: ${priceUsd},
    shortDescription: "${name}.",
    description: "${name}, fabricada en Colombia. Compresión y moldeo de calidad.",
    highlights: ["Compresión moldeadora", "Fabricada en Colombia"],
    image: "/fajas/${filename}",
    origin: "Hecho en Colombia",
    inStock: true,
  },`);
}

fs.writeFileSync(
  path.resolve("scripts/fajas-entries.ts.txt"),
  entries.join("\n") + "\n"
);

console.log(`Done. Downloaded ${entries.length}/${data.length} images.`);
