import React, { useState, useEffect } from "react";
import { FaAward } from "react-icons/fa";

export function PopOverScore() {
  interface Result {
    color: string;
    level: string;
    description: string;
    maxPoints: number;
    percentage: number;
    totalPoints: number;
  }
  const [results, setResults] = useState<Result>({
    color: "",
    level: "",
    description: "",
    maxPoints: 0,
    percentage: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const localResults = localStorage.getItem("results");
    setResults(JSON.parse(localResults!));
  });

  return (
    <>
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <FaAward className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Test Completado!
            </h2>
            <p className="text-gray-600">Tu nivel de inglés es:</p>
          </div>

          <div
            className={`bg-linear-to-r ${results.color} rounded-xl p-8 text-white mb-6`}
          >
            <div className="text-center">
              <p className="text-4xl font-bold mb-4">{results.level}</p>
              <p className="text-lg mb-4">{results.description}</p>
              <div className="bg-white/20 rounded-lg p-4 inline-block">
                <p className="text-sm mb-1">Puntuación obtenida</p>
                <p className="text-3xl font-bold">
                  {results.totalPoints} / {results.maxPoints}
                </p>
              </div>
            </div>
          </div>
          <a
            href="/user"
            className="bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all px-4 block w-full text-center"
          >
            Ir al Menú Principal
          </a>
        </div>
      </div>
    </>
  );
}
