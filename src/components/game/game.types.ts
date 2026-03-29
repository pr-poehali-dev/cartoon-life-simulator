// ─── Types ───────────────────────────────────────────────────────────────────

export type LifeStage = "baby" | "child" | "school" | "teen" | "student" | "adult" | "senior" | "elder";

export interface Stats {
  health: number;
  happiness: number;
  energy: number;
  money: number;
  education: number;
  reputation: number;
}

export interface Career {
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

export interface GameEvent {
  id: string;
  text: string;
  emoji: string;
  type: "positive" | "negative" | "neutral" | "milestone";
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  color: string;
  available: (age: number) => boolean;
  action: string;
  statEffect: Partial<Stats>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CAREERS: Career[] = [
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

export const LOCATIONS: Location[] = [
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

export const STAGE_INFO: Record<LifeStage, { label: string; color: string; bgGradient: string; ageRange: string; emoji: string }> = {
  baby:    { label: "Младенчество", color: "#93c5fd", bgGradient: "from-blue-900/30 to-blue-800/10",       ageRange: "0–3",   emoji: "👶" },
  child:   { label: "Детство",      color: "#34d399", bgGradient: "from-emerald-900/30 to-emerald-800/10", ageRange: "3–7",   emoji: "🧒" },
  school:  { label: "Школьные годы",color: "#60a5fa", bgGradient: "from-blue-900/30 to-indigo-800/10",     ageRange: "7–14",  emoji: "📚" },
  teen:    { label: "Юность",       color: "#c084fc", bgGradient: "from-purple-900/30 to-violet-800/10",   ageRange: "14–18", emoji: "🧑" },
  student: { label: "Студенчество", color: "#818cf8", bgGradient: "from-indigo-900/30 to-purple-800/10",   ageRange: "18–23", emoji: "🎓" },
  adult:   { label: "Взрослость",   color: "#fbbf24", bgGradient: "from-amber-900/30 to-orange-800/10",    ageRange: "23–50", emoji: "👨" },
  senior:  { label: "Зрелость",     color: "#94a3b8", bgGradient: "from-slate-900/30 to-slate-800/10",     ageRange: "50–70", emoji: "👴" },
  elder:   { label: "Мудрость",     color: "#d1d5db", bgGradient: "from-gray-900/30 to-gray-800/10",       ageRange: "70+",   emoji: "🧓" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getStage(age: number): LifeStage {
  if (age < 3)  return "baby";
  if (age < 7)  return "child";
  if (age < 14) return "school";
  if (age < 18) return "teen";
  if (age < 23) return "student";
  if (age < 50) return "adult";
  if (age < 70) return "senior";
  return "elder";
}

export function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export const TOWN_BG = "https://cdn.poehali.dev/projects/93b5adca-5b09-432f-8cea-ff88df04fdf1/files/998b7222-9757-4327-b16e-68237e23b588.jpg";
export const CHAR_IMG = "https://cdn.poehali.dev/projects/93b5adca-5b09-432f-8cea-ff88df04fdf1/files/91c417c4-848c-4c4a-b7ba-0a61f4ee1701.jpg";
