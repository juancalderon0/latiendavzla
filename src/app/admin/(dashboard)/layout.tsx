import Link from "next/link";
import { STORE } from "@/lib/config";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/proveedores", label: "Proveedores" },
  { href: "/admin/descuentos", label: "Descuentos" },
  { href: "/admin/vendedores", label: "Vendedores" },
  { href: "/admin/asistente", label: "Asistente" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 bg-neutral-50">
      <aside className="hidden w-56 shrink-0 border-r border-black/10 bg-white p-4 md:block">
        <div className="mb-6 font-bold">{STORE.name}</div>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-black/70 hover:bg-black/5 hover:text-black"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-black/10 pt-4">
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3 md:hidden">
          <span className="font-bold">{STORE.name} · Admin</span>
          <AdminLogoutButton />
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-black/10 bg-white px-4 py-2 text-sm md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full border border-black/10 px-3 py-1.5"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
