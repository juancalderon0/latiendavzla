import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`
    SELECT p.*, s.name AS supplier_name, s.website AS supplier_website, s.whatsapp AS supplier_whatsapp
    FROM products p
    LEFT JOIN suppliers s ON s.id = p.supplier_id
    ORDER BY p.category, p.name
  `);
  return NextResponse.json(rows);
}
