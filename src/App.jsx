import { useState, useEffect } from "react";
import Castle from "./components/01_Castle";
import SimpleAsyncAwait from "./examples/async/simpleAsyncAwait";

export default function App() {
  const [question, setQuestion] = useState(" ");
  const [answer, setAnswer] = useState(" ");

  // Pokemon state
  const [pokemon, setPokemon] = useState(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswer = (e) => {
    setAnswer(e.target.value);
  };

  // Watch answer — ถ้ามี "help me" ให้สุ่ม pokemon
  useEffect(() => {
    if (answer.toLowerCase().includes("help me")) {
      const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1 pokemon
      setLoadingPokemon(true);
      setPokemon(null);

      fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then((res) => res.json())
        .then((data) => {
          setPokemon({
            name: data.name,
            sprite: data.sprites.front_default,
            hp: data.stats[0].base_stat,
            type: data.types[0].type.name,
          });
          setLoadingPokemon(false);
        })
        .catch(() => setLoadingPokemon(false));
    }
  }, [answer]);

  return (
    <div className="pb-80 py-10 gap-y-4 flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white">
      <p className="text-purple-300">
        Message for JSD12:
        <span className="text-yellow-300">
          {question ? question : "Waiting for your message..."}
        </span>
      </p>
      <textarea
        value={question}
        onChange={handleQuestion}
        className="bg-white text-black rounded px-2 py-1"
        placeholder="Type your message here..."
      />

      {/* Pokemon Rescue Card — แสดงเมื่อ Secret Room พิมพ์ "help me" */}
      {loadingPokemon && (
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-700 border border-yellow-400 rounded-xl animate-pulse">
          <p className="text-yellow-300 text-sm">🚨 A wild Pokémon is coming to help...</p>
        </div>
      )}

      {pokemon && !loadingPokemon && (
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-700 border-2 border-yellow-400 rounded-xl shadow-lg shadow-yellow-900/50">
          <p className="text-yellow-300 text-sm font-bold uppercase tracking-widest">
            🚨 Secret Room called for help!
          </p>
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-24 h-24 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <p className="capitalize text-white text-xl font-bold">{pokemon.name}</p>
          <div className="flex gap-3 text-sm text-gray-300">
            <span>Type: <span className="text-green-300 capitalize">{pokemon.type}</span></span>
            <span>HP: <span className="text-red-400">{pokemon.hp}</span></span>
          </div>
        </div>
      )}

      <p className="text-green-300">
        Reply from secret room:{" "}
        <span className="text-yellow-300">
          {answer ? answer : "Waiting for reply..."}
        </span>
      </p>

      <Castle question={question} answer={answer} handleAnswer={handleAnswer} />
      <SimpleAsyncAwait />
    </div>
  );
}