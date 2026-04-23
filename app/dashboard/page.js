"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    estoque_min: "",
  });

  async function carregar() {
    const res = await fetch("/api/produtos");
    const data = await res.json();
    setProdutos(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvarProduto() {
    const dados = {
      ...form,
      preco: Number(form.preco),
      quantidade: Number(form.quantidade),
      estoque_min: Number(form.estoque_min),
    };

    if (editando) {
      await fetch(`/api/produtos/${editando.id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      setEditando(null);
    } else {
      await fetch("/api/produtos", {
        method: "POST",
        body: JSON.stringify(dados),
      });
    }

    setForm({
      nome: "",
      descricao: "",
      preco: "",
      quantidade: "",
      estoque_min: "",
    });

    carregar();
  }

  function iniciarEdicao(p) {
    setEditando(p);
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      preco: p.preco,
      quantidade: p.quantidade,
      estoque_min: p.estoque_min,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📦 Gestão de Estoque
        </h1>

        {/* FORMULÁRIO */}
        <div className="mb-6 bg-white p-6 rounded-2xl shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            {editando ? "✏️ Editar Produto" : "➕ Novo Produto"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              placeholder="Nome"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            <input
              placeholder="Descrição"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.descricao}
              onChange={(e) =>
                setForm({ ...form, descricao: e.target.value })
              }
            />

            <input
              placeholder="Preço"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />

            <input
              placeholder="Quantidade"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.quantidade}
              onChange={(e) =>
                setForm({ ...form, quantidade: e.target.value })
              }
            />

            <input
              placeholder="Estoque mínimo"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.estoque_min}
              onChange={(e) =>
                setForm({ ...form, estoque_min: e.target.value })
              }
            />
          </div>

          <button
            onClick={salvarProduto}
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow"
          >
            {editando ? "Atualizar" : "Salvar"}
          </button>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Preço</th>
                <th className="p-3 text-left">Quantidade</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{p.nome}</td>
                  <td className="p-3">R$ {p.preco}</td>
                  <td className="p-3">{p.quantidade}</td>

                  <td className="p-3">
                    {p.quantidade < p.estoque_min ? (
                      <span className="text-red-500 font-semibold">
                        🔴 Baixo
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        🟢 Normal
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(`/api/produtos/${p.id}`, {
                          method: "DELETE",
                        });
                        carregar();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {produtos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    Nenhum produto cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}