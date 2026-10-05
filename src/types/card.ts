export type Card = {
    id: string;
    pairId: number; // id del personaje, compartido por las dos cartas de la pareja
    name: string;
    image: string;
    isFlipped: boolean;
    isMatched: boolean;
};
