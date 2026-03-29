import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Stats, Career, CHAR_IMG } from "./game.types";

interface LifeSummary {
  playerName: string;
  stats: Stats;
  totalMoney: number;
  career: Career | null;
  onRestart: () => void;
}

function getRating(stats: Stats, totalMoney: number, career: Career | null): { score: number; title: string; emoji: string; color: string } {
  const avg = (stats.health + stats.happiness + stats.education + stats.reputation) / 4;
  const moneyBonus = Math.min(totalMoney / 10, 20);
  const careerBonus = career ? (career.currentLevel + 1) * 3 : 0;
  const score = Math.round(Math.min(avg + moneyBonus + careerBonus, 100));

  if (score >= 85) return { score, title: "Легендарная жизнь",  emoji: "🏆", color: "#f59e0b" };
  if (score >= 70) return { score, title: "Выдающаяся жизнь",  emoji: "🌟", color: "#a855f7" };
  if (score >= 55) return { score, title: "Достойная жизнь",   emoji: "✨", color: "#3b82f6" };
  if (score >= 40) return { score, title: "Обычная жизнь",     emoji: "🌿", color: "#10b981" };
  return               { score, title: "Трудная жизнь",        emoji: "🌧️", color: "#94a3b8" };
}

function getAchievements(stats: Stats, totalMoney: number, career: Career | null): { icon: string; text: string }[] {
  const list: { icon: string; text: string }[] = [];
  if (stats.health >= 70)       list.push({ icon: "Heart",        text: "Железное здоровье" });
  if (stats.happiness >= 70)    list.push({ icon: "Smile",        text: "Счастливый человек" });
  if (stats.education >= 70)    list.push({ icon: "GraduationCap",text: "Высокообразованный" });
  if (stats.reputation >= 60)   list.push({ icon: "Star",         text: "Известная личность" });
  if (totalMoney >= 500)        list.push({ icon: "DollarSign",   text: "Финансовый успех" });
  if (career?.currentLevel === 4) list.push({ icon: "Trophy",    text: "Вершина карьеры" });
  if (list.length === 0)        list.push({ icon: "Leaf",         text: "Просто жил" });
  return list;
}

export default function EndScreen({ playerName, stats, totalMoney, career, onRestart }: LifeSummary) {
  const rating = getRating(stats, totalMoney, career);
  const achievements = getAchievements(stats, totalMoney, career);
  const [visible, setVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAch, setShowAch] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowStats(true), 700);
    const t3 = setTimeout(() => setShowAch(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: 'hsl(var(--background))' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: rating.color }} />
      </div>

      <div className={`relative z-10 w-full max-w-md px-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-float">{rating.emoji}</div>
          <h1 className="text-5xl font-bold mb-1" style={{ fontFamily: 'Cormorant, serif', color: rating.color }}>
            Жизнь прожита
          </h1>
          <p className="text-muted-foreground italic" style={{ fontFamily: 'Cormorant, serif' }}>
            {playerName} · 80 лет · {rating.title}
          </p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                stroke={rating.color}
                strokeLinecap="round"
                strokeDasharray={`${rating.score * 2.638} 263.8`}
                style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1) 0.5s" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: rating.color, fontFamily: 'Cormorant, serif' }}>
                {rating.score}
              </span>
              <span className="text-xs text-muted-foreground">из 100</span>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className={`glass rounded-2xl p-4 mb-3 transition-all duration-500 ${showStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img src={CHAR_IMG} alt="Персонаж" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: 'Cormorant, serif' }}>{playerName}</div>
              {career && (
                <div className="text-sm" style={{ color: career.color }}>
                  {career.emoji} {career.levels[career.currentLevel]} · {career.title}
                </div>
              )}
            </div>
            <div className="ml-auto text-right">
              <div className="font-bold text-green-400">{Math.round(totalMoney)}к</div>
              <div className="text-xs text-muted-foreground">заработано</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Здоровье",    value: stats.health,     color: "#ef4444", emoji: "❤️" },
              { label: "Счастье",     value: stats.happiness,  color: "#f59e0b", emoji: "😊" },
              { label: "Образование", value: stats.education,  color: "#a855f7", emoji: "🎓" },
              { label: "Энергия",     value: stats.energy,     color: "#3b82f6", emoji: "⚡" },
              { label: "Деньги",      value: stats.money,      color: "#10b981", emoji: "💰" },
              { label: "Репутация",   value: stats.reputation, color: "#f97316", emoji: "⭐" },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: s.color + "11" }}>
                <div className="text-lg">{s.emoji}</div>
                <div className="text-sm font-bold" style={{ color: s.color }}>{Math.round(s.value)}</div>
                <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`glass rounded-2xl p-4 mb-5 transition-all duration-500 ${showAch ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Достижения</h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-border">
                <Icon name={a.icon as Parameters<typeof Icon>[0]["name"]} size={13} className="text-amber-400" />
                <span className="text-xs font-medium">{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="btn-primary-glow w-full py-4 rounded-2xl text-lg font-bold tracking-wide"
        >
          Прожить заново →
        </button>
      </div>
    </div>
  );
}
