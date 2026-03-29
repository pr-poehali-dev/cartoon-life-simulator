import Icon from "@/components/ui/icon";
import { Family } from "./game.types";

const PARTNER_NAMES = ["Анна", "Мария", "Елена", "Ольга", "Наташа", "Дарья", "Катя", "Алина"];
const CHILD_NAMES   = ["Миша", "Саша", "Лёша", "Дима", "Ваня", "Коля", "Маша", "Соня", "Лена", "Аня"];
const PARTNER_EMOJIS = ["👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👧"];

export { PARTNER_NAMES, CHILD_NAMES, PARTNER_EMOJIS };

interface FamilyPanelProps {
  age: number;
  family: Family;
  onMeetPartner: () => void;
  onImproveRelationship: () => void;
  onHaveChild: () => void;
  onSpendTimeWithFamily: () => void;
}

export default function FamilyPanel({
  age, family,
  onMeetPartner, onImproveRelationship, onHaveChild, onSpendTimeWithFamily,
}: FamilyPanelProps) {
  const canMeet     = !family.hasPartner && age >= 18;
  const canMarry    = family.hasPartner && family.marriageAge === null && family.relationshipLevel >= 60;
  const canHaveChild = family.hasPartner && age >= 20 && age <= 50 && family.children.length < 4;
  const canImprove  = family.hasPartner && family.relationshipLevel < 100;

  return (
    <div className="h-full overflow-y-auto space-y-3 animate-fade-in">

      {/* Партнёр */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Cormorant, serif' }}>Личная жизнь</h3>
          {family.marriageAge && (
            <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              💍 Женат с {family.marriageAge} лет
            </span>
          )}
        </div>

        {family.hasPartner ? (
          <div>
            {/* Partner card */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'rgba(236,72,153,0.15)' }}>
                {family.partnerEmoji}
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">{family.partnerName}</div>
                <div className="text-xs text-muted-foreground mb-2">Партнёр</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Отношения</span>
                    <span className="text-pink-400 font-bold">{Math.round(family.relationshipLevel)}%</span>
                  </div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ width: `${family.relationshipLevel}%`, background: '#ec4899' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onImproveRelationship}
                disabled={!canImprove}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'rgba(236,72,153,0.15)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.3)' }}
              >
                <span>💕</span> Свидание
              </button>
              <button
                onClick={onHaveChild}
                disabled={!canHaveChild}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.25)' }}
              >
                <span>👶</span> Ребёнок
              </button>
            </div>

            {canMarry && (
              <button
                onClick={onImproveRelationship}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium animate-pulse-glow"
                style={{ background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', border: '1px solid rgba(236,72,153,0.5)' }}
              >
                <span>💍</span> Предложить руку и сердце
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">💔</div>
            <p className="text-sm text-muted-foreground mb-4">
              {age < 18
                ? "Ещё слишком молод для серьёзных отношений"
                : "Ты пока один. Может, пора познакомиться?"}
            </p>
            {canMeet && (
              <button
                onClick={onMeetPartner}
                className="btn-primary-glow px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Познакомиться 💕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Дети */}
      {family.children.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Дети <span className="text-muted-foreground">({family.children.length})</span></h3>
            <button
              onClick={onSpendTimeWithFamily}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.25)' }}
            >
              🎮 Провести время
            </button>
          </div>
          <div className="space-y-2">
            {family.children.map(child => (
              <div key={child.id} className="flex items-center gap-3 p-2.5 rounded-xl glass">
                <span className="text-2xl">{child.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{child.name}</div>
                  <div className="text-xs text-muted-foreground">{child.age} лет</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">😊</span>
                  <span className="text-xs font-bold text-yellow-400">{Math.round(child.happiness)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Нет детей — подсказка */}
      {family.hasPartner && family.children.length === 0 && (
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🍼</div>
          <p className="text-sm text-muted-foreground">
            {age < 20
              ? "Дети появятся позже — сначала укрепи отношения"
              : "Ты пока бездетен. Нажми «Ребёнок», чтобы завести семью!"}
          </p>
        </div>
      )}

      {/* Инфо-блок */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Влияние семьи</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Heart" size={13} className="text-pink-400" />
            <span className="text-muted-foreground">Партнёр даёт</span>
            <span className="text-pink-400 font-bold ml-auto">+счастье каждый год</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Baby" size={13} className="text-yellow-400" fallback="Star" />
            <span className="text-muted-foreground">Каждый ребёнок</span>
            <span className="text-yellow-400 font-bold ml-auto">+счастье −деньги</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={13} className="text-blue-400" />
            <span className="text-muted-foreground">Время с семьёй</span>
            <span className="text-blue-400 font-bold ml-auto">+репутация</span>
          </div>
        </div>
      </div>
    </div>
  );
}
