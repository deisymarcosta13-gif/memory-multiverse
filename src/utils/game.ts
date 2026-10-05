import type { Card } from "../types/card";

// campos de la API de Rick and Morty que usa el juego
type ApiCharacter = {
    id: number;
    name: string;
    image: string;
};

export const generateCards = (characters: ApiCharacter[]): Card[] => {
    const duplicated = characters.flatMap((char) => [//duplica las cartas
        {
        id: `${char.id}-1`,
        pairId: char.id,
        name: char.name,
        image: char.image,
        isFlipped: false,
        isMatched: false,
        },
        {
        id: `${char.id}-2`,
        pairId: char.id,
        name: char.name,
        image: char.image,
        isFlipped: false,
        isMatched: false,
        },
    ]);

    return shuffle(duplicated);//mezcla las cartas
};

// Fisher-Yates: mezcla uniforme
const shuffle = (array: Card[]): Card[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

// descarga las imágenes antes de empezar; si alguna falla o tarda demasiado, no bloquea la partida
export const preloadImages = (urls: string[], timeoutMs = 6000): Promise<void> => {
    const loads = urls.map(
        (src) =>
            new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = src;
            })
    );

    return Promise.race([
        Promise.all(loads).then(() => undefined),
        new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
};
