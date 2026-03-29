import Icon from "@/components/ui/icon";
import { Career, Stats, CAREERS } from "./game.types";

interface CareerChoiceScreenProps {
  age: number;
  stats: Stats;
  onChoose: (career: Career) => void;
  onSkip: () => void;
}

export default function CareerChoiceScreen({ age, stats, onChoose, onSkip }: CareerChoiceScreenProps) {
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
                  onClick={() => !locked && onChoose(career)}
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

          <button
            onClick={onSkip}
            className="mt-5 w-full py-3 rounded-xl text-muted-foreground text-sm hover:text-foreground transition-colors border border-border"
          >
            Пропустить пока
          </button>
        </div>
      </div>
    </div>
  );
}
