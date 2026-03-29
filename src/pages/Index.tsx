import { useState, useEffect, useCallback } from "react";
import IntroScreen from "@/components/game/IntroScreen";
import CareerChoiceScreen from "@/components/game/CareerChoiceScreen";
import GameScreen from "@/components/game/GameScreen";
import EndScreen from "@/components/game/EndScreen";
import { PARTNER_NAMES, CHILD_NAMES, PARTNER_EMOJIS } from "@/components/game/FamilyPanel";
import {
  Stats, Career, GameEvent, Location, Family, FamilyMember,
  CAREERS, STAGE_INFO,
  getStage, clamp,
} from "@/components/game/game.types";

const CHILD_EMOJIS = ["👦", "👧", "🧒"];

const DEFAULT_FAMILY: Family = {
  hasPartner: false,
  partnerName: "",
  partnerEmoji: "",
  relationshipLevel: 0,
  children: [],
  marriageAge: null,
};

export default function Index() {
  const [screen, setScreen] = useState<"intro" | "game" | "career_choice" | "end">("intro");
  const [age, setAge] = useState(0);
  const [playerName, setPlayerName] = useState("Алексей");
  const [stats, setStats] = useState<Stats>({
    health: 90, happiness: 80, energy: 100, money: 10, education: 0, reputation: 0,
  });
  const [careers, setCareers] = useState<Career[]>(CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [activeLocation, setActiveLocation] = useState<string>("home");
  const [tab, setTab] = useState<"world" | "career" | "stats" | "family">("world");
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageTransition, setStageTransition] = useState(false);
  const [actionCooldown, setActionCooldown] = useState(false);
  const [totalMoney, setTotalMoney] = useState(0);
  const [family, setFamily] = useState<Family>(DEFAULT_FAMILY);

  const currentStage = getStage(age);

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

        // Family passive effects each year
        setFamily(f => {
          if (!f.hasPartner) return f;
          // Relationship slightly decays without attention
          const newRelLevel = clamp(f.relationshipLevel - 0.5);
          // Children grow up
          const updatedChildren = f.children.map(c => ({
            ...c,
            age: c.age + 1,
            happiness: clamp(c.happiness - 0.3),
          }));
          return { ...f, relationshipLevel: newRelLevel, children: updatedChildren };
        });

        // Partner gives happiness bonus each year
        setFamily(f => {
          if (!f.hasPartner) return f;
          setStats(s => ({ ...s, happiness: clamp(s.happiness + 1.5) }));
          return f;
        });

        // Each child gives happiness but costs money
        setFamily(f => {
          if (f.children.length === 0) return f;
          setStats(s => ({
            ...s,
            happiness: clamp(s.happiness + f.children.length * 0.5),
            money:     clamp(s.money - f.children.length * 0.3),
          }));
          return f;
        });

        // End of life
        if (newAge >= 80) {
          setIsPlaying(false);
          setTimeout(() => setScreen("end"), 800);
        }

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

  // ─── Family handlers ──────────────────────────────────────────────────────

  function handleMeetPartner() {
    const name  = PARTNER_NAMES[Math.floor(Math.random() * PARTNER_NAMES.length)];
    const emoji = PARTNER_EMOJIS[Math.floor(Math.random() * PARTNER_EMOJIS.length)];
    setFamily(f => ({ ...f, hasPartner: true, partnerName: name, partnerEmoji: emoji, relationshipLevel: 30 }));
    addEvent(`Познакомился с ${name}!`, "💕", "positive");
    setStats(s => ({ ...s, happiness: clamp(s.happiness + 15) }));
  }

  function handleImproveRelationship() {
    setFamily(f => {
      const newLevel = clamp(f.relationshipLevel + 12);
      // Proposal — marry when hitting 60+ for the first time
      if (f.marriageAge === null && newLevel >= 60 && f.relationshipLevel < 60) {
        addEvent(`Свадьба с ${f.partnerName}!`, "💍", "milestone");
        setStats(s => ({ ...s, happiness: clamp(s.happiness + 20), reputation: clamp(s.reputation + 10) }));
        return { ...f, relationshipLevel: newLevel, marriageAge: age };
      }
      addEvent(`Романтический вечер с ${f.partnerName}`, "🌹", "positive");
      setStats(s => ({ ...s, happiness: clamp(s.happiness + 8), money: clamp(s.money - 5) }));
      return { ...f, relationshipLevel: newLevel };
    });
  }

  function handleHaveChild() {
    setFamily(f => {
      if (!f.hasPartner || age > 50 || f.children.length >= 4) return f;
      const name  = CHILD_NAMES[Math.floor(Math.random() * CHILD_NAMES.length)];
      const emoji = CHILD_EMOJIS[Math.floor(Math.random() * CHILD_EMOJIS.length)];
      const child: FamilyMember = {
        id:       Date.now().toString(),
        name,
        relation: "child",
        age:      0,
        emoji,
        happiness: 80,
      };
      addEvent(`Родился ${name}!`, "👶", "milestone");
      setStats(s => ({
        ...s,
        happiness: clamp(s.happiness + 20),
        money:     clamp(s.money - 20),
        energy:    clamp(s.energy - 15),
      }));
      return { ...f, children: [...f.children, child] };
    });
  }

  function handleSpendTimeWithFamily() {
    setFamily(f => {
      if (!f.hasPartner) return f;
      const updatedChildren = f.children.map(c => ({ ...c, happiness: clamp(c.happiness + 10) }));
      addEvent("Провёл время с семьёй", "🏡", "positive");
      setStats(s => ({
        ...s,
        happiness:  clamp(s.happiness + 10),
        reputation: clamp(s.reputation + 3),
        energy:     clamp(s.energy - 5),
      }));
      return { ...f, relationshipLevel: clamp(f.relationshipLevel + 5), children: updatedChildren };
    });
  }

  // ─── Restart ──────────────────────────────────────────────────────────────

  function handleRestart() {
    setAge(0);
    setPlayerName("Алексей");
    setStats({ health: 90, happiness: 80, energy: 100, money: 10, education: 0, reputation: 0 });
    setCareers(CAREERS);
    setSelectedCareer(null);
    setEvents([]);
    setActiveLocation("home");
    setTab("world");
    setIsPlaying(false);
    setStageTransition(false);
    setActionCooldown(false);
    setTotalMoney(0);
    setFamily(DEFAULT_FAMILY);
    setScreen("intro");
  }

  // ─── Screens ──────────────────────────────────────────────────────────────

  if (screen === "intro") {
    return (
      <IntroScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={() => { setScreen("game"); setIsPlaying(true); }}
      />
    );
  }

  if (screen === "end") {
    return (
      <EndScreen
        playerName={playerName}
        stats={stats}
        totalMoney={totalMoney}
        career={selectedCareer ? careers.find(c => c.id === selectedCareer.id) ?? null : null}
        onRestart={handleRestart}
      />
    );
  }

  if (screen === "career_choice") {
    return (
      <CareerChoiceScreen
        age={age}
        stats={stats}
        onChoose={chooseCareer}
        onSkip={() => setScreen("game")}
      />
    );
  }

  return (
    <GameScreen
      age={age}
      playerName={playerName}
      stats={stats}
      careers={careers}
      selectedCareer={selectedCareer}
      events={events}
      activeLocation={activeLocation}
      tab={tab}
      isPlaying={isPlaying}
      stageTransition={stageTransition}
      actionCooldown={actionCooldown}
      totalMoney={totalMoney}
      currentStage={currentStage}
      family={family}
      onSetTab={setTab}
      onSetEvents={setEvents}
      onTogglePlay={() => setIsPlaying(p => !p)}
      onLocationClick={handleLocation}
      onOpenCareerChoice={() => setScreen("career_choice")}
      onMeetPartner={handleMeetPartner}
      onImproveRelationship={handleImproveRelationship}
      onHaveChild={handleHaveChild}
      onSpendTimeWithFamily={handleSpendTimeWithFamily}
    />
  );
}
