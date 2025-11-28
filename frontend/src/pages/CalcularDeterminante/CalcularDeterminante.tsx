import React, { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface DeterminantResponse {
  determinant: number;
}

// ✅ Matriz 10x10 fixa para usar quando desejar
const matriz10x10: string[][] = [
  ["32", "4", "9", "3", "2", "3", "4", "6", "8", "7"],
  ["0", "-1", "5", "-1", "3", "4", "-15", "8", "7", "6"],
  ["1", "10", "-1", "2", "-2", "3", "1", "2", "3", "3"],
  ["7", "6", "5", "3", "4", "54", "5", "-5", "4", "2"],
  ["7", "6", "8", "77", "6", "5", "4", "3", "5", "5"],
  ["5", "2", "-14", "1", "0", "0", "2", "1", "4", "5"],
  ["2", "1", "1", "2", "0", "1", "-12", "21", "3", "21"],
  ["4", "-1", "0", "0", "0", "4", "5", "4", "65", "12"],
  ["5", "8", "8", "7", "0", "0", "0", "0", "0", "0"],
  ["5", "18", "4", "3", "5", "1", "0", "-10", "0", "-10"],
];

const matriz20x20: string[][] = [
  ["12","-3","7","-15","8","0","19","-11","6","4","-7","3","1","14","-9","2","5","-12","18","7"],
  ["-10","4","-2","6","15","-8","0","3","-4","19","7","-1","12","-6","8","-3","10","0","-5","11"],
  ["9","-14","3","0","-7","20","-5","8","1","-3","6","-11","4","13","-2","17","-9","5","0","-16"],
  ["-1","7","18","-6","2","9","-13","14","-3","8","0","-12","5","11","4","-5","1","17","-7","10"],
  ["3","15","-9","8","-4","11","0","-2","7","-10","12","6","-3","5","14","-1","19","0","4","-8"],
  ["-6","20","5","-3","17","0","-14","9","2","-1","3","-5","16","8","-2","10","-7","11","0","13"],
  ["8","-4","16","7","-5","3","19","0","-9","10","-11","2","6","-1","15","-12","4","18","0","-3"],
  ["0","11","-7","14","-2","5","-9","3","16","-8","1","19","-4","12","0","6","-13","4","20","-6"],
  ["5","-12","0","18","4","-9","2","7","-1","15","-6","3","11","-14","9","0","8","-5","10","-3"],
  ["14","0","-10","9","-6","2","-1","13","4","0","17","-3","5","-7","20","-2","11","8","-15","6"],
  ["-8","6","12","-1","10","-5","3","19","0","7","-2","16","-4","14","0","5","-6","2","9","-11"],
  ["11","-7","4","0","13","8","-12","6","-3","1","15","-9","0","3","17","-5","10","-1","19","-4"],
  ["-3","18","7","-2","5","0","14","-10","4","12","-8","9","1","-6","3","16","-4","11","0","20"],
  ["6","-5","0","11","-13","17","2","-3","15","-7","4","20","-1","8","5","-6","12","0","9","-10"],
  ["-2","9","14","-8","0","3","10","-6","18","-1","5","7","-4","19","0","11","-7","2","13","-15"],
  ["7","-9","1","5","16","-4","0","12","-2","6","-11","3","20","-1","18","0","4","9","-3","14"],
  ["-11","8","0","17","3","-7","5","14","-6","2","10","-1","7","-5","4","19","-12","6","0","13"],
  ["10","-8","6","-3","19","0","-14","1","7","-2","12","5","-9","3","16","-4","11","0","8","-6"],
  ["4","13","-5","20","0","8","-3","17","-7","11","1","-10","6","-2","9","0","14","-8","19","5"],
  ["0","5","11","-4","12","-9","3","6","-1","18","-7","14","2","-3","10","-5","16","0","7","-12"]
];


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

    if (newSize === 10) {
      setMatrix(matriz10x10);
      return;
    }

    if (newSize === 20) {
      setMatrix(matriz20x20);
      return;
    }

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

  const is20 = size === 20;

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-6">
      <div
        className={`bg-slate-950 p-8 rounded-2xl w-full shadow-xl border border-slate-800 text-white ${
          is20 ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">
          Calculadora de Determinante
        </h1>

        <p className="text-sm text-slate-400 mb-6 text-center">
          Escolha o tamanho da matriz quadrada e insira os valores para calcular
          o determinante.
        </p>

        <div className="mb-6">
          <label className="text-sm text-slate-300 mb-2 block">
            Tamanho da matriz (NxN):
          </label>
          <select
            value={size}
            onChange={(e) => handleChangeSize(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} x {n}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`grid ${is20 ? "gap-[3px]" : "gap-3"}`}
            style={{
              // 👉 deixa sempre sem tamanho mínimo fixo, para caber dentro do card
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
                  className={
                    "w-full rounded-lg border border-slate-700 bg-slate-900 text-slate-100 text-center " +
                    "placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                    (is20
                      ? "text-[9px] px-1 py-1 aspect-square"
                      : "px-3 py-2 text-sm")
                  }
                  placeholder={`${rowIndex + 1},${colIndex + 1}`}
                />
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Calculando..." : "Calcular determinante"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg bg-red-900/70 text-red-100 px-3 py-2 text-xs text-center">
            Erro: {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="mt-4 rounded-lg bg-emerald-900/60 text-emerald-100 px-3 py-2 text-center text-lg">
            Determinante: <strong>{result}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

