import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync(new URL("./belleza-data.json", import.meta.url)));
const outDir = path.resolve("public/belleza");
fs.mkdirSync(outDir, { recursive: true });

function ext(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
  return m ? m[1].toLowerCase() : "jpg";
}

const entries = [];

for (const item of data) {
  const slug = `milagros-${item.handle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
    brand: "Milagros Beauty",
    category: "belleza",
    priceUsd: ${priceUsd},
    shortDescription: "${name}.",
    description: "${name}. Producto capilar profesional.",
    highlights: ["Cuidado capilar profesional"],
    image: "/belleza/${filename}",
    origin: "Producto importado",
    inStock: true,
  },`);
}

fs.writeFileSync(
  path.resolve("scripts/belleza-entries.ts.txt"),
  entries.join("\n") + "\n"
);

console.log(`Done. Downloaded ${entries.length}/${data.length} images.`);
