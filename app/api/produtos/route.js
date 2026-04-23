import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM produtos");
  return Response.json(rows);
}

export async function POST(req) {
  const data = await req.json();

  await db.query(
    "INSERT INTO produtos (nome, descricao, preco, quantidade, estoque_min) VALUES (?, ?, ?, ?, ?)",
    [data.nome, data.descricao, data.preco, data.quantidade, data.estoque_min]
  );

  return Response.json({ ok: true });
}