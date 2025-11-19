interface Card {
  value: string | number;
  label: string;
  color?: string;
  sublabel?: string;
}

interface SummaryCardsProps {
  cards: Card[];
}

export const SummaryCards = ({ cards }: SummaryCardsProps) => {
  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="card-value" style={card.color ? { color: card.color } : {}}>
            {card.value}
          </div>
          <div className="card-label">{card.label}</div>
          {card.sublabel && (
            <div style={{ marginTop: '0.5rem', fontWeight: 500, color: card.color || '#7f8c8d' }}>
              {card.sublabel}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
