import { AssistantChat } from "@/components/admin/AssistantChat";

export const dynamic = "force-dynamic";

export default function AdminAsistentePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Asistente</h1>
      <p className="mb-6 text-sm text-black/50">
        Máximo 10 preguntas al día. Solo responde temas relacionados con la tienda.
      </p>
      <AssistantChat />
    </div>
  );
}
