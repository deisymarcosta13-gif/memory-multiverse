import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LEVELS } from "../constants/levels";
import { fetchCharacters } from "../services/api";
import { generateCards, preloadImages } from "../utils/game";
import type { Card } from "../types/card";
import Header from "../components/Header";
import VictoryModal, { type RecordStatus } from "../components/VictoryModal";
import { checkWin } from "../utils/gameHelpers";
import { launchConfetti } from "../utils/confetti";
import StartModal from "../components/StartModal";
import ExitModal from "../components/ExitModal";
import ErrorModal from "../components/ErrorModal";
import { saveScore, getScores } from "../utils/storage";
import SkeletonCard from "../components/SkeletonCard";
import MemoryCard from "../components/MemoryCard";

type Nivel = keyof typeof LEVELS;

const NIVEL_LABEL: Record<Nivel, string> = {
    facil: "Fácil",
    medio: "Medio",
    dificil: "Difícil",
};

// columnas/filas en móvil y desde 640px, y ancho máximo del tablero
const BOARD_LAYOUT: Record<Nivel, { cols: number; rows: number; colsSm: number; rowsSm: number; maxWidth: string }> = {
    facil: { cols: 2, rows: 4, colsSm: 4, rowsSm: 2, maxWidth: "44rem" },
    medio: { cols: 4, rows: 4, colsSm: 4, rowsSm: 4, maxWidth: "42rem" },
    dificil: { cols: 4, rows: 6, colsSm: 6, rowsSm: 4, maxWidth: "56rem" },
};

// pide personajes, genera las cartas y precarga sus imágenes
const fetchDeck = async (pares: number, filtro: string): Promise<Card[]> => {
    const characters = await fetchCharacters(pares, filtro);

    if (!characters || characters.length === 0) {
        throw new Error("API vacía");
    }

    const gameCards = generateCards(characters);
    await preloadImages(gameCards.map((card) => card.image));
    return gameCards;
};

const MISMATCH_DELAY = 900; // tiempo que se ven las cartas incorrectas
const VICTORY_DELAY = 700;  // deja ver la animación de la última pareja

function Game({ nivel, setNivel }: { nivel: string; setNivel: (n: string | null) => void }) {
    const nivelKey = nivel as Nivel;
    const pares = LEVELS[nivelKey];
    const nivelLabel = NIVEL_LABEL[nivelKey];

    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    const [mismatchIds, setMismatchIds] = useState<string[]>([]);

    const [tiempo, setTiempo] = useState(0);
    const [intentos, setIntentos] = useState(0);

    const [isWin, setIsWin] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [showStartModal, setShowStartModal] = useState(true);
    const [filtro, setFiltro] = useState("all");

    const [showExitModal, setShowExitModal] = useState(false);

    const [bestScore, setBestScore] = useState<{
        bestTime?: number;
        bestAttempts?: number;
    }>({});
    const [record, setRecord] = useState<RecordStatus>({
        isFirst: false,
        newRecordTime: false,
        newRecordAttempts: false,
    });

    // las cartas se cargan al abrir "Configura tu partida"
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    // ERROR
    const [error, setError] = useState<string | null>(null);

    const startTimeRef = useRef(0);
    const loadIdRef = useRef(0); // descarta respuestas de cargas anteriores
    const mismatchTimeoutRef = useRef<number | null>(null);
    const victoryTimeoutRef = useRef<number | null>(null);

    const getElapsed = () => Math.floor((Date.now() - startTimeRef.current) / 1000);

    const clearPendingTimers = () => {
        if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
        if (victoryTimeoutRef.current) clearTimeout(victoryTimeoutRef.current);
        mismatchTimeoutRef.current = null;
        victoryTimeoutRef.current = null;
    };

    // carga un mazo; solo la carga más reciente actualiza el estado
    const loadGame = (filtroSeleccionado: string) => {
        const loadId = ++loadIdRef.current;

        fetchDeck(pares, filtroSeleccionado)
            .then((gameCards) => {
                if (loadId !== loadIdRef.current) return;
                setCards(gameCards);
                setIsReady(true);
                setIsLoading(false);
            })
            .catch((err) => {
                if (loadId !== loadIdRef.current) return;
                console.error("ERROR API:", err);
                setError("No se pudieron cargar los personajes.");
                setIsLoading(false);
            });
    };

    // vuelve al estado "preparando" y carga un mazo nuevo
    const prepareGame = (filtroSeleccionado: string) => {
        clearPendingTimers();
        setIsPlaying(false);
        setIsWin(false);
        setShowVictory(false);
        setFlippedCards([]);
        setMismatchIds([]);
        setTiempo(0);
        setIntentos(0);
        setError(null);
        setIsReady(false);
        setIsLoading(true);
        loadGame(filtroSeleccionado);
    };

    // primera carga al entrar al nivel; al salir se cancelan cargas y timers pendientes
    useEffect(() => {
        const loadIds = loadIdRef;
        loadGame("all");

        return () => {
            loadIds.current++;
            clearPendingTimers();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //actualiza el tiempo: se calcula desde el inicio real, así no se desfasa
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setTiempo(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 250);

        return () => clearInterval(interval);
    }, [isPlaying]);

    //inicia la partida: aquí empiezan el cronómetro y los intentos
    const handleStart = () => {
        if (!isReady) return;

        setShowStartModal(false);
        setTiempo(0);
        setIntentos(0);
        startTimeRef.current = Date.now();
        setIsPlaying(true);
    };

    const handleFiltroChange = (nuevoFiltro: string) => {
        if (nuevoFiltro === filtro) return;
        setFiltro(nuevoFiltro);
        prepareGame(nuevoFiltro);
    };

    const finishGame = (intentosFinales: number) => {
        const tiempoFinal = getElapsed();

        setIsPlaying(false);
        setTiempo(tiempoFinal);
        setIsWin(true);

        const hadRecord = getScores()[nivelKey] !== undefined;
        const result = saveScore(nivelKey, tiempoFinal, intentosFinales);

        setBestScore({ bestTime: result.bestTime, bestAttempts: result.bestAttempts });
        setRecord({
            isFirst: !hadRecord,
            newRecordTime: hadRecord && result.newRecordTime,
            newRecordAttempts: hadRecord && result.newRecordAttempts,
        });

        victoryTimeoutRef.current = window.setTimeout(() => {
            setShowVictory(true);
            launchConfetti();
        }, VICTORY_DELAY);
    };

    //voltea carta; al voltear la segunda se cuenta el intento y se comparan
    const handleFlip = (id: string) => {
        if (!isPlaying || flippedCards.length === 2) return;

        const selectedCard = cards.find((card) => card.id === id);

        if (!selectedCard || selectedCard.isFlipped || selectedCard.isMatched) return;

        let nextCards = cards.map((card) =>
            card.id === id ? { ...card, isFlipped: true } : card
        );
        const nextFlipped = [...flippedCards, selectedCard];

        if (nextFlipped.length < 2) {
            setCards(nextCards);
            setFlippedCards(nextFlipped);
            return;
        }

        const nextIntentos = intentos + 1;
        setIntentos(nextIntentos);

        const [first, second] = nextFlipped;

        if (first.pairId === second.pairId) {
            nextCards = nextCards.map((card) =>
                card.pairId === first.pairId ? { ...card, isMatched: true } : card
            );

            setCards(nextCards);
            setFlippedCards([]);

            if (checkWin(nextCards)) {
                finishGame(nextIntentos);
            }
        } else {
            setCards(nextCards);
            setFlippedCards(nextFlipped);
            setMismatchIds([first.id, second.id]);

            mismatchTimeoutRef.current = window.setTimeout(() => {
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.id === first.id || card.id === second.id
                            ? { ...card, isFlipped: false }
                            : card
                    )
                );
                setFlippedCards([]);
                setMismatchIds([]);
                mismatchTimeoutRef.current = null;
            }, MISMATCH_DELAY);
        }
    };

    //reinicia la partida: vuelve a "Configura tu partida" con el mismo filtro
    const resetGame = () => {
        setShowStartModal(true);
        prepareGame(filtro);
    };

    //sale a la pantalla principal
    const goBack = () => {
        setNivel(null);
    };

    //reintenta cargar el juego cuando la api falla
    const retryLoad = () => {
        prepareGame(filtro);
    };

    //muestra modal de salir (el cronómetro sigue: la partida no se pausa)
    const openExitModal = () => {
        setShowExitModal(true);
    };

    //mantiene en el juego
    const cancelExit = () => {
        setShowExitModal(false);
    };

    //sale a la pantalla principal
    const confirmExit = () => {
        setShowExitModal(false);
        setNivel(null);
    };

    const layout = BOARD_LAYOUT[nivelKey];
    const boardVars = {
        "--cols": layout.cols,
        "--rows": layout.rows,
        "--cols-sm": layout.colsSm,
        "--rows-sm": layout.rowsSm,
        "--board-max": layout.maxWidth,
    } as CSSProperties;

    const isBoardLocked = !isPlaying || flippedCards.length === 2;

    return (
        <div className="relative min-h-screen min-h-dvh px-3 py-3 text-white sm:px-6 sm:py-6">
            {/* fondo fijo, oscurecido para que el tablero tenga protagonismo */}
            <div className="pointer-events-none fixed inset-0 bg-[url('/img/fondoMorty.jpg')] bg-cover bg-center" aria-hidden="true" />
            <div className="pointer-events-none fixed inset-0 bg-slate-950/60" aria-hidden="true" />

            {showStartModal && !error && (
                <StartModal
                    nivelLabel={nivelLabel}
                    pares={pares}
                    filtro={filtro}
                    isLoading={isLoading}
                    isReady={isReady}
                    onFiltroChange={handleFiltroChange}
                    onStart={handleStart}
                    onChangeLevel={goBack}
                />
            )}

            {showExitModal && (
                <ExitModal
                    onCancel={cancelExit}
                    onExit={confirmExit}
                />
            )}

            {error && (
                <ErrorModal
                    message={error}
                    onRetry={retryLoad}
                    onExit={goBack}
                />
            )}

            <main className="game-column relative mx-auto flex flex-col gap-3 sm:gap-5" style={boardVars}>
                <Header
                    nivelLabel={nivelLabel}
                    tiempo={tiempo}
                    intentos={intentos}
                    onReset={resetGame}
                    onBack={openExitModal}
                />

                <section
                    aria-label="Tablero de cartas"
                    className="board rounded-2xl border border-white/10 bg-slate-950/40 p-2.5 backdrop-blur-sm sm:p-4"
                >
                    {isLoading || cards.length === 0
                        ? Array.from({ length: pares * 2 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                        : cards.map((card, i) => (
                            <MemoryCard
                                key={card.id}
                                card={card}
                                position={i + 1}
                                isMismatch={mismatchIds.includes(card.id)}
                                isLocked={isBoardLocked}
                                onFlip={handleFlip}
                            />
                        ))
                    }
                </section>
            </main>

            {isWin && showVictory && (
                <VictoryModal
                    nivelLabel={nivelLabel}
                    tiempo={tiempo}
                    intentos={intentos}
                    pares={pares}
                    bestTime={bestScore.bestTime}
                    bestAttempts={bestScore.bestAttempts}
                    record={record}
                    onReset={resetGame}
                    onExit={goBack}
                />
            )}
        </div>
    );
}

export default Game;
