import type { Card } from "../types/card";

export const checkWin = (cards: Card[]): boolean => {// determina si el usuario gano
  return cards.length > 0 && cards.every((card) => card.isMatched);
};

// formato de cronómetro mm:ss (ej. 01:05)
export const formatTime = (segundos: number): string => {
  const min = Math.floor(segundos / 60);
  const sec = segundos % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};
