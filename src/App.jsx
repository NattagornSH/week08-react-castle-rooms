import { useState, useEffect, useRef } from "react";
import Castle from "./components/01_Castle";
import SimpleAsyncAwait from "./examples/async/simpleAsyncAwait";

export default function App() {
  const [question, setQuestion] = useState(" ");
  const [answer, setAnswer] = useState(" ");

  const [capturedPokemon, setCapturedPokemon] = useState(null);
  const [rescuePokemon, setRescuePokemon] = useState(null);
  const [loadingRescue, setLoadingRescue] = useState(false);

  const [phase, setPhase] = useState("idle");
  const [mewtwoOpacity, setMewtwoOpacity] = useState(1);
  const [pokemonFlying, setPokemonFlying] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const hasTriggered = useRef(false);

  // โหลด captured pokemon ตอนแรก
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      .then((res) => res.json())
      .then((data) => {
        setCapturedPokemon({
          name: data.name,
          sprite: data.sprites.other["official-artwork"].front_default,
          type: data.types[0].type.name,
          hp: data.stats[0].base_stat,
        });
      });
  }, []);

  const handleQuestion = (e) => setQuestion(e.target.value);
  const handleAnswer = (e) => setAnswer(e.target.value);

  // Watch answer — "help me" → spawn rescue pokemon
  useEffect(() => {
    if (answer.toLowerCase().includes("help me") && !hasTriggered.current) {
      hasTriggered.current = true;
      setLoadingRescue(true);
      setRescuePokemon(null);

      const randomId = Math.floor(Math.random() * 151) + 1;
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then((res) => res.json())
        .then((data) => {
          setRescuePokemon({
            name: data.name,
            sprite: data.sprites.other["official-artwork"].front_default,
            type: data.types[0].type.name,
            hp: data.stats[0].base_stat,
          });
          setLoadingRescue(false);
          setPhase("rescued");
        })
        .catch(() => setLoadingRescue(false));
    }

    if (!answer.toLowerCase().includes("help me")) {
      hasTriggered.current = false;
    }
  }, [answer]);

  const handleAttack = () => {
    setPhase("attacking");
    let op = 100;
    const interval = setInterval(() => {
      op -= 5;
      setMewtwoOpacity(op / 100);
      if (op <= 0) {
        clearInterval(interval);
        setMewtwoOpacity(0);
        setPhase("freed");
      }
    }, 60);
  };

  const handleFree = () => {
    setPokemonFlying(true);
    setPhase("celebration");

    const colors = [
      "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
      "#ff922b", "#cc5de8", "#20c997", "#f06595",
    ];
    const particles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: Math.random() * 2 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      rotate: Math.random() * 360,
    }));
    setConfetti(particles);
  };

  const typeColors = {
    fire: "#fb923c", water: "#60a5fa", grass: "#4ade80",
    electric: "#fde047", psychic: "#f472b6", normal: "#d1d5db",
    poison: "#c084fc", flying: "#7dd3fc", bug: "#a3e635",
    rock: "#d97706", ground: "#b45309", ice: "#67e8f9",
    dragon: "#818cf8", ghost: "#8b5cf6", dark: "#6b7280",
    steel: "#94a3b8", fairy: "#fbcfe8", fighting: "#ef4444",
  };

  return (
    <div className="pb-80 py-10 gap-y-6 flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white relative overflow-hidden">

      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${p.left}vw`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size * 0.5}px`,
            backgroundColor: p.color,
            borderRadius: "2px",
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pokemonFlyUp {
          0%   { transform: translateY(0px) scale(1); opacity: 1; }
          100% { transform: translateY(-350px) scale(1.5); opacity: 0; }
        }
        @keyframes spawnIn {
          0%   { transform: translateX(160px) scale(0.5); opacity: 0; }
          70%  { transform: translateX(-8px) scale(1.05); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes capturedFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes mewtwoGlow {
          0%, 100% { filter: drop-shadow(0 0 8px #a855f7); }
          50%       { filter: drop-shadow(0 0 28px #c084fc); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        @keyframes capturedGrayscalePulse {
          0%, 100% { filter: grayscale(1) brightness(0.7); }
          50%       { filter: grayscale(1) brightness(0.9); }
        }
      `}</style>

      {/* ===== Message Input (ข้างนอก Castle ด้านบน) ===== */}
      <p className="text-purple-300 text-sm">
        Message for JSD12:{" "}
        <span className="text-yellow-300">
          {question.trim() ? question : "Waiting for your message..."}
        </span>
      </p>
      <textarea
        value={question}
        onChange={handleQuestion}
        className="bg-white text-black rounded px-2 py-1"
        placeholder="Type your message here..."
      />

      {/* ===== Reply zone (ข้างนอก Castle ด้านบน) ===== */}
      <p className="text-green-300 text-sm">
        Reply from secret room:{" "}
        <span className="text-yellow-300">
          {answer.trim() ? answer : "Waiting for reply..."}
        </span>
      </p>

      {/* ===== Castle ===== */}
      <Castle question={question} answer={answer} handleAnswer={handleAnswer} />

      {/* ===== MEWTWO BOSS ZONE — ข้างล่าง Castle ใกล้ reply ===== */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4 mt-2">

        <div className="flex items-center gap-3">
          <span className="text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">⚠ BOSS</span>
          <p className="text-purple-200 font-bold text-base tracking-wide">Mewtwo has captured a Pokémon!</p>
          <span className="text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">⚠ BOSS</span>
        </div>

        {/* Mewtwo + Captured Pokemon */}
        <div className="flex items-end justify-center gap-10">

          {/* Mewtwo */}
          <div
            className="flex flex-col items-center gap-1"
            style={{ opacity: mewtwoOpacity, transition: "opacity 0.1s" }}
          >
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Mewtwo</span>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
              alt="mewtwo"
              className="w-36 h-36 object-contain"
              style={{
                animation: phase === "attacking"
                  ? "shake 0.35s linear infinite"
                  : "mewtwoGlow 2.5s ease-in-out infinite",
              }}
            />
            <span className="text-purple-500 text-xs">Psychic · Lv.???</span>
          </div>

          {/* VS */}
          <span className="text-red-500 font-black text-3xl mb-10 drop-shadow-lg">VS</span>

          {/* Captured Pokemon */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Captured!</span>
            {capturedPokemon ? (
              <div
                className="flex flex-col items-center"
                style={{
                  animation: pokemonFlying
                    ? "pokemonFlyUp 1.5s ease-in forwards"
                    : "capturedFloat 3s ease-in-out infinite",
                }}
              >
                <img
                  src={capturedPokemon.sprite}
                  alt={capturedPokemon.name}
                  className="w-28 h-28 object-contain"
                  style={{ animation: "capturedGrayscalePulse 2s ease-in-out infinite" }}
                />
                <p className="capitalize text-gray-400 text-sm font-bold mt-1">{capturedPokemon.name}</p>
                <span className="text-xs capitalize" style={{ color: typeColors[capturedPokemon.type] || "#d1d5db" }}>
                  {capturedPokemon.type}
                </span>
              </div>
            ) : (
              <div className="w-28 h-28 flex items-center justify-center">
                <span className="text-gray-600 text-xs animate-pulse">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Rescue Pokemon */}
        {loadingRescue && (
          <div className="px-4 py-2 bg-yellow-900/40 border border-yellow-500 rounded-xl animate-pulse">
            <span className="text-yellow-300 text-sm">⚡ A Pokémon is rushing to help...</span>
          </div>
        )}

        {rescuePokemon && (
          <div
            className="flex flex-col items-center gap-1 px-5 py-3 bg-gray-800 border-2 border-yellow-400 rounded-2xl shadow-xl shadow-yellow-900/30"
            style={{ animation: "spawnIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
          >
            <p className="text-yellow-300 text-xs font-black uppercase tracking-widest">🚨 Rescue Pokémon!</p>
            <img
              src={rescuePokemon.sprite}
              alt={rescuePokemon.name}
              className="w-24 h-24 object-contain"
            />
            <p className="capitalize text-white text-lg font-bold">{rescuePokemon.name}</p>
            <div className="flex gap-4 text-xs">
              <span>Type: <span className="capitalize font-bold" style={{ color: typeColors[rescuePokemon.type] || "#d1d5db" }}>{rescuePokemon.type}</span></span>
              <span>HP: <span className="text-red-400 font-bold">{rescuePokemon.hp}</span></span>
            </div>
          </div>
        )}

        {phase === "rescued" && (
          <button
            onClick={handleAttack}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black rounded-2xl border-2 border-red-400 shadow-lg shadow-red-900/50 tracking-wider transition-all text-sm uppercase"
          >
            ⚔️ Attack Mewtwo!
          </button>
        )}

        {phase === "freed" && (
          <button
            onClick={handleFree}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black rounded-2xl border-2 border-emerald-400 shadow-lg shadow-emerald-900/50 tracking-wider transition-all text-sm uppercase animate-bounce"
          >
            🎉 You Helped Pokémon!
          </button>
        )}

        {phase === "celebration" && (
          <p className="text-yellow-300 font-black text-2xl animate-bounce drop-shadow-lg">
            🌟 Pokémon is FREE! 🌟
          </p>
        )}
      </div>

      <SimpleAsyncAwait />
    </div>
  );
}