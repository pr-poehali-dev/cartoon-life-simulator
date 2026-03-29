import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  Career, GameEvent, Location, Stats, LifeStage, Family,
  CAREERS, LOCATIONS, STAGE_INFO, TOWN_BG, CHAR_IMG,
} from "./game.types";
import FamilyPanel from "./FamilyPanel";

// ─── StatBar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={12} className="opacity-70" />
          <span className="text-xs text-muted-foreground font-medium">{label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── EventToast ───────────────────────────────────────────────────────────────

function EventToast({ event, onDone }: { event: GameEvent; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors: Record<GameEvent["type"], string> = {
    positive:  "border-emerald-500/50 bg-emerald-950/80",
    negative:  "border-red-500/50 bg-red-950/80",
    neutral:   "border-slate-500/50 bg-slate-950/80",
    milestone: "border-amber-500/50 bg-amber-950/80",
  };

  return (
    <div className={`animate-event-pop glass px-4 py-3 rounded-xl border ${colors[event.type]} flex items-center gap-3 max-w-xs shadow-2xl`}>
      <span className="text-2xl">{event.emoji}</span>
      <span className="text-sm font-medium text-foreground/90">{event.text}</span>
    </div>
  );
}

// ─── GameScreen ───────────────────────────────────────────────────────────────

interface GameScreenProps {
  age: number;
  playerName: string;
  stats: Stats;
  careers: Career[];
  selectedCareer: Career | null;
  events: GameEvent[];
  activeLocation: string;
  tab: "world" | "career" | "stats" | "family";
  isPlaying: boolean;
  stageTransition: boolean;
  actionCooldown: boolean;
  totalMoney: number;
  currentStage: LifeStage;
  family: Family;
  onSetTab: (tab: "world" | "career" | "stats" | "family") => void;
  onSetEvents: (fn: (es: GameEvent[]) => GameEvent[]) => void;
  onTogglePlay: () => void;
  onLocationClick: (loc: Location) => void;
  onOpenCareerChoice: () => void;
  onMeetPartner: () => void;
  onImproveRelationship: () => void;
  onHaveChild: () => void;
  onSpendTimeWithFamily: () => void;
}

export default function GameScreen({
  age, playerName, stats, careers, selectedCareer, events,
  activeLocation, tab, isPlaying, stageTransition, actionCooldown,
  totalMoney, currentStage, family, onSetTab, onSetEvents, onTogglePlay,
  onLocationClick, onOpenCareerChoice, onMeetPartner, onImproveRelationship,
  onHaveChild, onSpendTimeWithFamily,
}: GameScreenProps) {
  const stageInfo = STAGE_INFO[currentStage];
  const availableLocations = LOCATIONS.filter(l => l.available(age));
  const careerData = selectedCareer ? careers.find(c => c.id === selectedCareer.id) ?? null : null;

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--background))' }}>

      {/* TOP HUD */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Character */}
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${stageTransition ? "animate-age-transition" : ""}`}
                style={{ background: stageInfo.color + "22", border: `2px solid ${stageInfo.color}44` }}
              >
                {stageInfo.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{playerName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: stageInfo.color + "22", color: stageInfo.color }}>
                    {age} лет
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{stageInfo.label}</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 items-center">
              {[
                { e: "❤️", v: stats.health,    c: "#ef4444" },
                { e: "😊", v: stats.happiness, c: "#f59e0b" },
                { e: "⚡", v: stats.energy,    c: "#3b82f6" },
                { e: "💰", v: totalMoney,       c: "#10b981" },
              ].map(({ e, v, c }) => (
                <div key={e} className="flex items-center gap-1">
                  <span className="text-sm">{e}</span>
                  <span className="text-sm font-bold" style={{ color: c }}>{Math.round(v)}</span>
                </div>
              ))}
            </div>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                isPlaying ? "bg-amber-500/20 text-amber-400 animate-pulse-glow" : "glass text-muted-foreground"
              }`}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
            </button>
          </div>

          {/* Timeline */}
          <div className="mt-3">
            <div className="relative h-2 rounded-full overflow-hidden bg-muted">
              <div className="timeline-track h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((age / 80) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>👶 0</span>
              <span style={{ color: stageInfo.color }}>{stageInfo.label}</span>
              <span>🧓 80</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event toasts */}
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
        {events.slice(0, 3).map(ev => (
          <EventToast
            key={ev.id}
            event={ev}
            onDone={() => onSetEvents(es => es.filter(e => e.id !== ev.id))}
          />
        ))}
      </div>

      {/* TABS */}
      <div className="flex-shrink-0 px-4 py-2">
        <div className="glass rounded-xl p-1 flex gap-1">
          {[
            { id: "world",  label: "Мир",     icon: "Map" },
            { id: "career", label: "Карьера",  icon: "Briefcase" },
            { id: "family", label: "Семья",    icon: "Heart" },
            { id: "stats",  label: "Итоги",    icon: "BarChart2" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => onSetTab(t.id as "world" | "career" | "stats" | "family")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon as Parameters<typeof Icon>[0]["name"]} size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden px-4 pb-4 min-h-0">

        {/* WORLD */}
        {tab === "world" && (
          <div className="h-full flex flex-col gap-3 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden h-32 flex-shrink-0">
              <img src={TOWN_BG} alt="Город" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <div className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant, serif' }}>Твой город</div>
                <div className="text-white/60 text-xs">Выбери локацию для действия</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {availableLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => onLocationClick(loc)}
                    className={`location-btn glass rounded-xl p-3 flex flex-col items-center gap-1.5 ${
                      activeLocation === loc.id ? "border border-amber-400/40" : ""
                    } ${actionCooldown ? "opacity-60" : ""}`}
                  >
                    <span className="text-3xl">{loc.emoji}</span>
                    <span className="text-xs font-medium text-foreground/80 text-center leading-tight">{loc.name}</span>
                    <span className="text-xs text-muted-foreground">{loc.action}</span>
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {Object.entries(loc.statEffect).map(([k, v]) => (
                        <span key={k} className={`text-xs font-bold ${(v as number) > 0 ? "text-green-400" : "text-red-400"}`}>
                          {(v as number) > 0 ? "+" : ""}{v}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CAREER */}
        {tab === "career" && (
          <div className="h-full overflow-y-auto space-y-3 animate-fade-in">
            {careerData ? (
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ background: careerData.color + "22", border: `2px solid ${careerData.color}44` }}>
                    {careerData.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl" style={{ fontFamily: 'Cormorant, serif', color: careerData.color }}>
                      {careerData.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{careerData.levels[careerData.currentLevel]}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{careerData.salary}к</div>
                    <div className="text-xs text-muted-foreground">в месяц</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Опыт</span>
                    <span style={{ color: careerData.color }}>{careerData.experience}/{careerData.expToNext}</span>
                  </div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill"
                      style={{ width: `${(careerData.experience / careerData.expToNext) * 100}%`, background: careerData.color }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  {careerData.levels.map((lvl, i) => (
                    <div key={i} className="flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: i <= careerData.currentLevel ? careerData.color + "22" : "hsl(var(--muted))",
                        color: i <= careerData.currentLevel ? careerData.color : "hsl(var(--muted-foreground))",
                        border: i === careerData.currentLevel ? `1px solid ${careerData.color}66` : "1px solid transparent",
                        opacity: i > careerData.currentLevel ? 0.45 : 1,
                      }}>
                      {i === careerData.currentLevel && <div className="text-sm mb-0.5">⭐</div>}
                      <div className="leading-tight">{lvl}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cormorant, serif' }}>Профессия не выбрана</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {age < 16 ? `Тебе ${age} лет — учись и готовься к взрослой жизни!` : "Самое время выбрать путь!"}
                </p>
                {age >= 16 && (
                  <button onClick={onOpenCareerChoice} className="btn-primary-glow px-6 py-2.5 rounded-xl text-sm font-semibold">
                    Выбрать профессию
                  </button>
                )}
              </div>
            )}

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Другие профессии</h3>
                <button onClick={onOpenCareerChoice} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Сменить →
                </button>
              </div>
              <div className="space-y-2">
                {CAREERS.filter(c => c.id !== selectedCareer?.id).slice(0, 3).map(c => {
                  const locked = age < c.minAge || stats.education < c.minEducation;
                  return (
                    <div key={c.id} className={`flex items-center gap-3 p-2.5 rounded-xl glass ${locked ? "opacity-40" : ""}`}>
                      <span className="text-xl">{c.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.description}</div>
                      </div>
                      <div className="text-xs text-green-400 font-bold">{c.salary}к</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FAMILY */}
        {tab === "family" && (
          <FamilyPanel
            age={age}
            family={family}
            onMeetPartner={onMeetPartner}
            onImproveRelationship={onImproveRelationship}
            onHaveChild={onHaveChild}
            onSpendTimeWithFamily={onSpendTimeWithFamily}
          />
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="h-full overflow-y-auto space-y-3 animate-fade-in">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex gap-4 p-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={CHAR_IMG} alt="Персонаж" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-0.5" style={{ fontFamily: 'Cormorant, serif' }}>{playerName}</div>
                  <div className="text-sm mb-3" style={{ color: stageInfo.color }}>{stageInfo.label} · {age} лет</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <div className="font-bold text-green-400">{Math.round(totalMoney)}к</div>
                      <div className="text-xs text-muted-foreground">Заработано</div>
                    </div>
                    <div>
                      <div className="font-bold text-orange-400">{Math.round(stats.reputation)}</div>
                      <div className="text-xs text-muted-foreground">Репутация</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-400">{Math.round(stats.education)}</div>
                      <div className="text-xs text-muted-foreground">Образование</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Показатели жизни</h3>
              <StatBar label="Здоровье"    value={stats.health}     color="#ef4444" icon="Heart" />
              <StatBar label="Счастье"     value={stats.happiness}  color="#f59e0b" icon="Smile" />
              <StatBar label="Энергия"     value={stats.energy}     color="#3b82f6" icon="Zap" />
              <StatBar label="Деньги"      value={stats.money}      color="#10b981" icon="DollarSign" />
              <StatBar label="Образование" value={stats.education}  color="#a855f7" icon="GraduationCap" />
              <StatBar label="Репутация"   value={stats.reputation} color="#f97316" icon="Star" />
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Жизненные этапы</h3>
              <div className="space-y-2">
                {(Object.entries(STAGE_INFO) as [LifeStage, typeof STAGE_INFO[LifeStage]][]).map(([stage, info]) => {
                  const minAge = parseInt(info.ageRange.split("–")[0]);
                  const passed  = age > minAge;
                  const current = stage === currentStage;
                  return (
                    <div key={stage} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${current ? "glass-strong" : ""}`}
                      style={{ opacity: passed || current ? 1 : 0.3 }}>
                      <span className="text-xl">{info.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{info.label}</div>
                        <div className="text-xs text-muted-foreground">{info.ageRange} лет</div>
                      </div>
                      {passed && !current && <Icon name="CheckCircle" size={15} className="text-green-400" />}
                      {current && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: info.color + "22", color: info.color }}>Сейчас</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}