import React, { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface DeterminantResponse {
  determinant: number;
}

export const CalcularDeterminante: React.FC = () => {
  const [size, setSize] = useState<number>(2);
  const [matrix, setMatrix] = useState<string[][]>([
    ["", ""],
    ["", ""],
  ]);

  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (row: number, col: number, value: string) => {
    const m = [...matrix];
    m[row][col] = value;
    setMatrix(m);
  };

  const handleChangeSize = (newSize: number) => {
    setSize(newSize);

    const newMatrix: string[][] = Array.from({ length: newSize }, () =>
      Array(newSize).fill("")
    );

    setMatrix(newMatrix);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const numericMatrix = matrix.map((row) => row.map((v) => Number(v)));

    try {
      const response = await axios.post<DeterminantResponse>(
        "http://localhost:8000/calcular-determinante",
        { matrix: numericMatrix }
      );

      setResult(response.data.determinant);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.detail || "Erro ao calcular determinante");
      } else if (err.request) {
        setError("Não foi possível comunicar com a API");
      } else {
        setError(err.message || "Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-950 p-8 rounded-2xl w-full max-w-3xl shadow-xl border border-slate-800 text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Calculadora de Determinante
        </h1>

        <p className="text-sm text-slate-400 mb-6 text-center">
          Escolha o tamanho da matriz quadrada e insira os valores para calcular
          o determinante.
        </p>

        {/* Seleção do tamanho */}
        <div className="mb-6">
          <label className="text-sm text-slate-300 mb-2 block">
            Tamanho da matriz (NxN):
          </label>
          <select
            value={size}
            onChange={(e) => handleChangeSize(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} x {n}
              </option>
            ))}
          </select>
        </div>

        {/* Inputs da matriz */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            }}
          >
            {matrix.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handleInputChange(rowIndex, colIndex, e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 text-center placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`${rowIndex + 1},${colIndex + 1}`}
                />
              ))
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Calculando..." : "Calcular determinante"}
          </button>
        </form>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-900/70 text-red-100 px-3 py-2 text-xs text-center">
            Erro: {error}
          </div>
        )}

        {/* Resultado */}
        {result !== null && !error && (
          <div className="mt-4 rounded-lg bg-emerald-900/60 text-emerald-100 px-3 py-2 text-center text-lg">
            Determinante: <strong>{result}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
