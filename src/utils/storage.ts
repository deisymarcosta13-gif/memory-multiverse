type Score = {
    bestTime: number;
    bestAttempts: number;
};

type Scores = {
    facil?: Score;
    medio?: Score;
    dificil?: Score;
};

const STORAGE_KEY = "memoryGameScores";

type Nivel = "facil" | "medio" | "dificil";

// Obtener datos
export const getScores = (): Scores => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// Guardar datos
export const saveScore = (
    nivel: Nivel,
    tiempo: number,
    intentos: number
) => {
    const scores = getScores();
    const current = scores[nivel];

    let newRecordTime = false;
    let newRecordAttempts = false;

    if (!current) {
        scores[nivel] = {
        bestTime: tiempo,
        bestAttempts: intentos,
        };

        newRecordTime = true;
        newRecordAttempts = true;
    } else {
        if (tiempo < current.bestTime) {
        current.bestTime = tiempo;
        newRecordTime = true;
        }

        if (intentos < current.bestAttempts) {
        current.bestAttempts = intentos;
        newRecordAttempts = true;
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

    return {
        bestTime: scores[nivel]?.bestTime,
        bestAttempts: scores[nivel]?.bestAttempts,
        newRecordTime,
        newRecordAttempts,
    };
};