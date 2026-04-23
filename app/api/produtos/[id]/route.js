import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  const data = await req.json();

  await db.query(
    "UPDATE produtos SET nome=?, descricao=?, preco=?, quantidade=?, estoque_min=? WHERE id=?",
    [
      data.nome,
      data.descricao,
      data.preco,
      data.quantidade,
      data.estoque_min,
      params.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req, { params }) {
  await db.query("DELETE FROM produtos WHERE id=?", [params.id]);
  return Response.json({ ok: true });
}