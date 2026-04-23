import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT m.*, p.nome 
    FROM movimentacoes m
    JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.data DESC
  `);

  return Response.json(rows);
}

export async function POST(req) {
  const { produto_id, tipo, quantidade } = await req.json();

  // salva histórico
  await db.query(
    "INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES (?, ?, ?)",
    [produto_id, tipo, quantidade]
  );

  // atualiza estoque
  if (tipo === "entrada") {
    await db.query(
      "UPDATE produtos SET quantidade = quantidade + ? WHERE id=?",
      [quantidade, produto_id]
    );
  } else {
    await db.query(
      "UPDATE produtos SET quantidade = quantidade - ? WHERE id=?",
      [quantidade, produto_id]
    );
  }

  return Response.json({ ok: true });
}