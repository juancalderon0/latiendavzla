const sizes = [
  { talla: "XS", busto: "76-80", cintura: "60-64", cadera: "84-88" },
  { talla: "S", busto: "81-85", cintura: "65-69", cadera: "89-93" },
  { talla: "M", busto: "86-91", cintura: "70-75", cadera: "94-99" },
  { talla: "L", busto: "92-98", cintura: "76-82", cadera: "100-106" },
  { talla: "XL", busto: "99-106", cintura: "83-90", cadera: "107-114" },
  { talla: "XXL", busto: "107-115", cintura: "91-99", cadera: "115-123" },
];

export default function GuiaTallasPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Guía de tallas</h1>
      <p className="mb-6 text-sm text-black/60">
        Medidas de referencia para ropa y fajas, en centímetros. Cada proveedor puede
        tener variaciones leves — si tienes dudas, escríbenos por WhatsApp antes de comprar.
      </p>

      <div className="overflow-x-auto rounded-xl border border-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50 text-left">
              <th className="p-3">Talla</th>
              <th className="p-3">Busto (cm)</th>
              <th className="p-3">Cintura (cm)</th>
              <th className="p-3">Cadera (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.talla} className="border-b border-black/5">
                <td className="p-3 font-medium">{s.talla}</td>
                <td className="p-3">{s.busto}</td>
                <td className="p-3">{s.cintura}</td>
                <td className="p-3">{s.cadera}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4 text-sm text-black/70">
        <h2 className="font-semibold text-black">Cómo medirte</h2>
        <ul className="list-inside list-disc space-y-1">
          <li><strong>Busto:</strong> mide alrededor de la parte más ancha del pecho.</li>
          <li><strong>Cintura:</strong> mide en la parte más angosta del abdomen, usualmente por encima del ombligo.</li>
          <li><strong>Cadera:</strong> mide alrededor de la parte más ancha de la cadera/glúteos.</li>
        </ul>
        <p>
          Para <strong>fajas</strong>: si estás entre dos tallas, elige la menor para mayor
          compresión, o la mayor si prefieres uso más cómodo para el día a día.
        </p>
      </div>
    </div>
  );
}
