import { TOWN_BG } from "./game.types";

interface IntroScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onStart: () => void;
}

export default function IntroScreen({ playerName, setPlayerName, onStart }: IntroScreenProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${TOWN_BG})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85" />

      <div className="relative z-10 text-center animate-fade-in max-w-md px-6 w-full">
        <div className="text-7xl mb-5 animate-float">🌍</div>
        <h1 className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Cormorant, serif', letterSpacing: '-1px' }}>
          Жизненный Путь
        </h1>
        <p className="text-lg text-white/60 mb-8 italic" style={{ fontFamily: 'Cormorant, serif' }}>
          Проживи свою жизнь — от первого вздоха до мудрой старости
        </p>

        <div className="glass-strong rounded-2xl p-5 mb-6 text-left">
          <label className="block text-sm text-white/50 mb-2">Имя персонажа</label>
          <input
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-medium outline-none focus:border-amber-400/60 transition-colors"
            placeholder="Введи имя..."
            maxLength={20}
          />
        </div>

        <button
          onClick={onStart}
          className="btn-primary-glow w-full py-4 rounded-2xl text-lg font-bold tracking-wide mb-6"
        >
          Начать жизнь →
        </button>

        <div className="flex justify-center gap-4 flex-wrap">
          {["👶 Рождение", "🏫 Школа", "🎓 Универ", "💼 Карьера", "🏆 Успех"].map((s, i) => (
            <span key={i} className="text-xs text-white/35">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
