import { Check } from "lucide-react";
import type { Card } from "../types/card";

type MemoryCardProps = {
    card: Card;
    position: number;
    isMismatch: boolean;
    isLocked: boolean;
    onFlip: (id: string) => void;
};

function MemoryCard({ card, position, isMismatch, isLocked, onFlip }: MemoryCardProps) {
    const isOpen = card.isFlipped || card.isMatched;

    const label = card.isMatched
        ? `${card.name}, pareja encontrada`
        : isOpen
            ? card.name
            : `Carta ${position}, oculta`;

    // borde según el estado: error > acertada > descubierta
    const ring = isMismatch
        ? "ring-2 ring-rose-400"
        : card.isMatched
            ? "ring-2 ring-lime-400/90 shadow-[0_0_14px_rgb(163_230_53/0.35)]"
            : "ring-2 ring-cyan-300/80";

    return (
        <button
            type="button"
            onClick={() => onFlip(card.id)}
            aria-label={label}
            aria-disabled={isLocked || isOpen}
            className={`group block w-full aspect-square perspective rounded-xl
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
                        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                        ${isOpen ? "cursor-default" : "cursor-pointer"}
                        ${isMismatch ? "animate-shake" : ""}
                        ${card.isMatched ? "animate-pop" : ""}
                        motion-reduce:animate-none`}
        >
            <div
                className={`relative h-full w-full transform-style transition-transform duration-500
                            ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none
                            ${isOpen ? "rotate-y-180" : ""}`}
            >
                {/* REVERSO */}
                <div
                    className={`card-back [container-type:inline-size] absolute inset-0 flex items-center justify-center rounded-xl backface-hidden
                                ring-1 ring-cyan-300/20 shadow-lg shadow-black/40 transition-[box-shadow,transform] duration-200
                                ${!isOpen && !isLocked ? "[@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:ring-lime-300/50" : ""}`}
                >
                    <span
                        className="select-none font-black text-lime-300/80 text-[clamp(1rem,40cqw,2.5rem)] leading-none
                                    drop-shadow-[0_0_6px_rgb(163_230_53/0.5)]"
                        aria-hidden="true"
                    >
                        ?
                    </span>
                </div>

                {/* CARA */}
                <div className={`absolute inset-0 rotate-y-180 backface-hidden rounded-xl shadow-lg shadow-black/40 transition-shadow ${ring}`}>
                    <img
                        src={card.image}
                        alt=""
                        draggable={false}
                        className="h-full w-full rounded-xl object-cover"
                    />

                    {card.isMatched && (
                        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-slate-950 sm:h-6 sm:w-6">
                            <Check size={14} strokeWidth={3} aria-hidden="true" />
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}

export default MemoryCard;
