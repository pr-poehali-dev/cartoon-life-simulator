import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type LifeStage = "baby" | "child" | "school" | "teen" | "student" | "adult" | "senior" | "elder";

interface Stats {
  health: number;
  happiness: number;
  energy: number;
  money: number;
  education: number;
  reputation: number;
}

interface Career {
  id: string;
  title: string;
  icon: string;
  emoji: string;
  description: string;
  minAge: number;
  minEducation: number;
  salary: number;
  growthRate: number;
  color: string;
  levels: string[];
  currentLevel: number;
  experience: number;
  expToNext: number;
}

interface GameEvent {
  id: string;
  text: string;
  emoji: string;
  type: "positive" | "negative" | "neutral" | "milestone";
}

interface Location {
  id: string;
  name: string;
  emoji: string;
  color: string;
  available: (age: number) => boolean;
  action: string;
  statEffect: Partial<Stats>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CAREERS: Career[] = [
  {
    id: "doctor",
    title: "Врач",
    icon: "Stethoscope",
    emoji: "🏥",
    description: "Спасай жизни, лечи пациентов",
    minAge: 22,
    minEducation: 80,
    salary: 120,
    growthRate: 0.8,
    color: "#ef4444",
    levels: ["Интерн", "Врач", "Старший врач", "Заведующий", "Главврач"],
    currentLevel: 0,
    experience: 0,
    expToNext: 100,
  },
  {
    id: "engineer",
    title: "Инженер",
    icon: "Cpu",
    emoji: "⚙️",
    description: "Создавай технологии будущего",
    minAge: 22,
    minEducation: 70,
    salary: 100,
    growthRate: 1.0,
    color: "#3b82f6",
    levels: ["Джуниор", "Мидл", "Сениор", "Лид", "Директор"],
    currentLevel: 0,
    experience: 0,
    expToNext: 100,
  },
  {
    id: "artist",
    title: "Художник",
    icon: "Palette",
    emoji: "🎨",
    description: "Создавай искусство и вдохновляй мир",
    minAge: 18,
    minEducation: 30,
    salary: 60,
    growthRate: 0.6,
    color: "#a855f7",
    levels: ["Ученик", "Художник", "Мастер", "Известный", "Легенда"],
    currentLevel: 0,
    experience: 0,
    expToNext: 80,
  },
  {
    id: "businessman",
    title: "Предприниматель",
    icon: "TrendingUp",
    emoji: "💼",
    description: "Строй бизнес-империю с нуля",
    minAge: 20,
    minEducation: 50,
    salary: 80,
    growthRate: 1.5,
    color: "#f59e0b",
    levels: ["Стартапер", "Малый бизнес", "Компания", "Корпорация", "Магнат"],
    currentLevel: 0,
    experience: 0,
    expToNext: 120,
  },
  {
    id: "teacher",
    title: "Учитель",
    icon: "BookOpen",
    emoji: "📚",
    description: "Воспитывай следующее поколение",
    minAge: 22,
    minEducation: 65,
    salary: 70,
    growthRate: 0.5,
    color: "#10b981",
    levels: ["Молодой педагог", "Учитель", "Методист", "Завуч", "Директор"],
    currentLevel: 0,
    experience: 0,
    expToNext: 90,
  },
  {
    id: "athlete",
    title: "Спортсмен",
    icon: "Trophy",
    emoji: "🏆",
    description: "Стань чемпионом и покори мир спорта",
    minAge: 16,
    minEducation: 20,
    salary: 90,
    growthRate: 1.2,
    color: "#f97316",
    levels: ["Новичок", "Любитель", "Профи", "Чемпион", "Легенда"],
    currentLevel: 0,
    experience: 0,
    expToNext: 90,
  },
];

const LOCATIONS: Location[] = [
  {
    id: "home",
    name: "Дом",
    emoji: "🏠",
    color: "#f59e0b",
    available: () => true,
    action: "Отдохнуть",
    statEffect: { energy: 20, happiness: 5 },
  },
  {
    id: "kindergarten",
    name: "Детский сад",
    emoji: "🎪",
    color: "#ec4899",
    available: (age) => age >= 3 && age <= 7,
    action: "Играть",
    statEffect: { happiness: 15, education: 5, energy: -5 },
  },
  {
    id: "school",
    name: "Школа",
    emoji: "🏫",
    color: "#3b82f6",
    available: (age) => age >= 7 && age <= 18,
    action: "Учиться",
    statEffect: { education: 15, energy: -10, happiness: -5 },
  },
  {
    id: "university",
    name: "Университет",
    emoji: "🎓",
    color: "#8b5cf6",
    available: (age) => age >= 17 && age <= 26,
    action: "Изучать",
    statEffect: { education: 20, energy: -15, money: -20 },
  },
  {
    id: "park",
    name: "Парк",
    emoji: "🌳",
    color: "#10b981",
    available: () => true,
    action: "Прогуляться",
    statEffect: { happiness: 10, health: 8, energy: -5 },
  },
  {
    id: "gym",
    name: "Спортзал",
    emoji: "💪",
    color: "#f97316",
    available: (age) => age >= 10,
    action: "Тренироваться",
    statEffect: { health: 20, energy: -15, happiness: 5 },
  },
  {
    id: "hospital",
    name: "Больница",
    emoji: "🏥",
    color: "#ef4444",
    available: (age) => age >= 5,
    action: "Лечиться",
    statEffect: { health: 30, money: -30, energy: -10 },
  },
  {
    id: "office",
    name: "Работа",
    emoji: "🏢",
    color: "#6b7280",
    available: (age) => age >= 16,
    action: "Работать",
    statEffect: { money: 25, energy: -20, happiness: -5 },
  },
];

const STAGE_INFO: Record<LifeStage, { label: string; color: string; bgGradient: string; ageRange: string; emoji: string }> = {
  baby:    { label: "Младенчество", color: "#93c5fd", bgGradient: "from-blue-900/30 to-blue-800/10",       ageRange: "0–3",   emoji: "👶" },
  child:   { label: "Детство",      color: "#34d399", bgGradient: "from-emerald-900/30 to-emerald-800/10", ageRange: "3–7",   emoji: "🧒" },
  school:  { label: "Школьные годы",color: "#60a5fa", bgGradient: "from-blue-900/30 to-indigo-800/10",     ageRange: "7–14",  emoji: "📚" },
  teen:    { label: "Юность",       color: "#c084fc", bgGradient: "from-purple-900/30 to-violet-800/10",   ageRange: "14–18", emoji: "🧑" },
  student: { label: "Студенчество", color: "#818cf8", bgGradient: "from-indigo-900/30 to-purple-800/10",   ageRange: "18–23", emoji: "🎓" },
  adult:   { label: "Взрослость",   color: "#fbbf24", bgGradient: "from-amber-900/30 to-orange-800/10",    ageRange: "23–50", emoji: "👨" },
  senior:  { label: "Зрелость",     color: "#94a3b8", bgGradient: "from-slate-900/30 to-slate-800/10",     ageRange: "50–70", emoji: "👴" },
  elder:   { label: "Мудрость",     color: "#d1d5db", bgGradient: "from-gray-900/30 to-gray-800/10",       ageRange: "70+",   emoji: "🧓" },
};

function getStage(age: number): LifeStage {
  if (age < 3)  return "baby";
  if (age < 7)  return "child";
  if (age < 14) return "school";
  if (age < 18) return "teen";
  if (age < 23) return "student";
  if (age < 50) return "adult";
  if (age < 70) return "senior";
  return "elder";
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Assets ───────────────────────────────────────────────────────────────────

const TOWN_BG = "https://cdn.poehali.dev/projects/93b5adca-5b09-432f-8cea-ff88df04fdf1/files/998b7222-9757-4327-b16e-68237e23b588.jpg";
const CHAR_IMG = "https://cdn.poehali.dev/projects/93b5adca-5b09-432f-8cea-ff88df04fdf1/files/91c417c4-848c-4c4a-b7ba-0a61f4ee1701.jpg";

// ─── Main Game ────────────────────────────────────────────────────────────────

export default function Index() {
  const [screen, setScreen] = useState<"intro" | "game" | "career_choice">("intro");
  const [age, setAge] = useState(0);
  const [playerName, setPlayerName] = useState("Алексей");
  const [stats, setStats] = useState<Stats>({
    health: 90, happiness: 80, energy: 100, money: 10, education: 0, reputation: 0,
  });
  const [careers, setCareers] = useState<Career[]>(CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [activeLocation, setActiveLocation] = useState<string>("home");
  const [tab, setTab] = useState<"world" | "career" | "stats">("world");
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageTransition, setStageTransition] = useState(false);
  const [actionCooldown, setActionCooldown] = useState(false);
  const [totalMoney, setTotalMoney] = useState(0);

  const currentStage = getStage(age);
  const stageInfo = STAGE_INFO[currentStage];

  const addEvent = useCallback((text: string, emoji: string, type: GameEvent["type"] = "neutral") => {
    const ev: GameEvent = { id: Date.now().toString() + Math.random(), text, emoji, type };
    setEvents(prev => [ev, ...prev.slice(0, 4)]);
  }, []);

  // Auto-progression tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAge(a => {
        const newAge = a + 1;

        // Stage transition
        if (getStage(newAge) !== getStage(a)) {
          setStageTransition(true);
          setTimeout(() => setStageTransition(false), 700);
          const info = STAGE_INFO[getStage(newAge)];
          addEvent(`Новый этап: ${info.label}!`, info.emoji, "milestone");
        }

        // Random life events
        if (Math.random() < 0.3) {
          const lifeEvents = [
            { text: "Встретил старого друга",     emoji: "🤝", type: "positive" as const, s: { happiness: 10 } },
            { text: "Заболел гриппом",            emoji: "🤧", type: "negative" as const, s: { health: -15, energy: -10 } },
            { text: "Нашёл деньги на улице",      emoji: "💰", type: "positive" as const, s: { money: 15, happiness: 5 } },
            { text: "Прочитал интересную книгу",  emoji: "📖", type: "positive" as const, s: { education: 5, happiness: 5 } },
            { text: "Стрессовая неделя",          emoji: "😰", type: "negative" as const, s: { happiness: -10, energy: -10 } },
            { text: "Получил неожиданную премию", emoji: "🎁", type: "positive" as const, s: { money: 20, happiness: 10 } },
            { text: "Новый знакомый",             emoji: "👋", type: "neutral"  as const, s: { happiness: 5, reputation: 3 } },
            { text: "Выиграл в лотерею",          emoji: "🎰", type: "positive" as const, s: { money: 30 } },
            { text: "Сломал телефон",             emoji: "📱", type: "negative" as const, s: { money: -15, happiness: -5 } },
          ];
          const ev = lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
          addEvent(ev.text, ev.emoji, ev.type);
          setStats(s => {
            const ns = { ...s };
            Object.entries(ev.s).forEach(([k, v]) => { (ns as Record<string, number>)[k] = clamp((s as Record<string, number>)[k] + v); });
            return ns;
          });
        }

        // Passive decay
        setStats(s => ({
          ...s,
          health:    clamp(s.health    - (newAge > 50 ? 0.5 : 0.1)),
          happiness: clamp(s.happiness - 0.2),
          energy:    clamp(s.energy    + 0.5),
        }));

        return newAge;
      });

      // Career progression
      setSelectedCareer(sc => {
        if (!sc) return sc;
        setCareers(cs => cs.map(c => {
          if (c.id !== sc.id) return c;
          const newExp = c.experience + 10;
          if (newExp >= c.expToNext && c.currentLevel < c.levels.length - 1) {
            const nextLevel = c.currentLevel + 1;
            addEvent(`Повышение! ${c.levels[nextLevel]}`, "🎊", "milestone");
            return { ...c, currentLevel: nextLevel, experience: 0, expToNext: c.expToNext + 50 };
          }
          return { ...c, experience: Math.min(newExp, c.expToNext) };
        }));
        setStats(s => ({
          ...s,
          money:      clamp(s.money      + sc.salary * 0.1),
          reputation: clamp(s.reputation + sc.growthRate * 0.5),
        }));
        setTotalMoney(m => m + sc.salary * 0.1);
        return sc;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, addEvent]);

  function handleLocation(loc: Location) {
    if (actionCooldown || !loc.available(age)) return;
    setActiveLocation(loc.id);
    setActionCooldown(true);
    setTimeout(() => setActionCooldown(false), 800);
    setStats(s => {
      const ns = { ...s };
      Object.entries(loc.statEffect).forEach(([k, v]) => { (ns as Record<string, number>)[k] = clamp((s as Record<string, number>)[k] + (v as number)); });
      return ns;
    });
    addEvent(`${loc.action} в «${loc.name}»`, loc.emoji, "neutral");
  }

  function chooseCareer(career: Career) {
    if (age < career.minAge || stats.education < career.minEducation) return;
    setSelectedCareer({ ...career, currentLevel: 0, experience: 0 });
    setCareers(cs => cs.map(c => c.id === career.id ? { ...c, currentLevel: 0, experience: 0 } : c));
    addEvent(`Начал карьеру: ${career.title}!`, career.emoji, "milestone");
    setScreen("game");
    setTab("career");
  }

  const availableLocations = LOCATIONS.filter(l => l.available(age));
  const careerData = selectedCareer ? careers.find(c => c.id === selectedCareer.id) ?? null : null;

  // ─── INTRO ────────────────────────────────────────────────────────────────

  if (screen === "intro") {
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
            onClick={() => { setScreen("game"); setIsPlaying(true); }}
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

  // ─── CAREER CHOICE ────────────────────────────────────────────────────────

  if (screen === "career_choice") {
    return (
      <div className="h-screen w-full overflow-hidden flex flex-col" style={{ background: 'hsl(var(--background))' }}>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 animate-fade-in">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-4xl font-bold text-foreground mb-1" style={{ fontFamily: 'Cormorant, serif' }}>
                Выбор профессии
              </h2>
              <p className="text-muted-foreground text-sm">Тебе {age} лет. Время определиться с путём!</p>
              {stats.education < 50 && (
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-lg px-3 py-1.5">
                  <Icon name="AlertTriangle" size={13} className="text-amber-400" />
                  <span className="text-xs text-amber-300">Некоторые профессии требуют больше образования</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CAREERS.map((career, i) => {
                const locked = age < career.minAge || stats.education < career.minEducation;
                return (
                  <div
                    key={career.id}
                    className={`career-card p-4 glass animate-fade-in ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
                    style={{ animationDelay: `${i * 0.07}s`, borderColor: !locked ? career.color + "44" : undefined }}
                    onClick={() => !locked && chooseCareer(career)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: career.color + "22" }}>
                        {career.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{career.title}</h3>
                        <p className="text-xs text-muted-foreground leading-tight">{career.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs mb-3">
                      <span className="flex items-center gap-1 text-green-400"><Icon name="DollarSign" size={11} />{career.salary}к/мес</span>
                      <span className="flex items-center gap-1 text-blue-400"><Icon name="GraduationCap" size={11} />Обр. {career.minEducation}+</span>
                      <span className="flex items-center gap-1 text-amber-400"><Icon name="Calendar" size={11} />От {career.minAge} лет</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {career.levels.map((lvl, j) => (
                        <span key={j} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: career.color + "22", color: career.color }}>
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setScreen("game")}
              className="mt-5 w-full py-3 rounded-xl text-muted-foreground text-sm hover:text-foreground transition-colors border border-border">
              Пропустить пока
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN GAME ────────────────────────────────────────────────────────────

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
              onClick={() => setIsPlaying(p => !p)}
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
          <EventToast key={ev.id} event={ev} onDone={() => setEvents(es => es.filter(e => e.id !== ev.id))} />
        ))}
      </div>

      {/* TABS */}
      <div className="flex-shrink-0 px-4 py-2">
        <div className="glass rounded-xl p-1 flex gap-1">
          {[
            { id: "world",  label: "Мир",         icon: "Map" },
            { id: "career", label: "Карьера",      icon: "Briefcase" },
            { id: "stats",  label: "Статистика",   icon: "BarChart2" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "world" | "career" | "stats")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon as Parameters<typeof Icon>[0]["name"]} size={14} />
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
                    onClick={() => handleLocation(loc)}
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
                  <button onClick={() => setScreen("career_choice")} className="btn-primary-glow px-6 py-2.5 rounded-xl text-sm font-semibold">
                    Выбрать профессию
                  </button>
                )}
              </div>
            )}

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Другие профессии</h3>
                <button onClick={() => setScreen("career_choice")} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
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