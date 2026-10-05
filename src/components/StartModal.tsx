import type { ReactNode } from "react";
import { ArrowLeft, Check, CircleHelp, HeartPulse, LoaderCircle, Play, Skull, Users } from "lucide-react";
import Modal from "./Modal";

type StartModalProps = {
    nivelLabel: string;
    pares: number;
    filtro: string;
    isLoading: boolean;
    isReady: boolean;
    onFiltroChange: (filtro: string) => void;
    onStart: () => void;
    onChangeLevel: () => void;
};

const ICON_PROPS = { size: 16, strokeWidth: 1.75, "aria-hidden": true } as const;

const FILTROS: { value: string; label: string; icon: ReactNode }[] = [
    { value: "all", label: "Todos", icon: <Users {...ICON_PROPS} /> },
    { value: "alive", label: "Vivos", icon: <HeartPulse {...ICON_PROPS} /> },
    { value: "dead", label: "Muertos", icon: <Skull {...ICON_PROPS} /> },
    { value: "unknown", label: "Desconocido", icon: <CircleHelp {...ICON_PROPS} /> },
];

function StartModal({
    nivelLabel,
    pares,
    filtro,
    isLoading,
    isReady,
    onFiltroChange,
    onStart,
    onChangeLevel,
}: StartModalProps) {
    return (
        <Modal
            eyebrow={`Nivel ${nivelLabel} · ${pares} parejas`}
            title="Configura tu partida"
            actions={
                <>
                    <button onClick={onChangeLevel} className="btn-secondary">
                        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                        Cambiar nivel
                    </button>

                    <button onClick={onStart} disabled={!isReady} className="btn-primary sm:min-w-44">
                        <Play size={16} strokeWidth={2} aria-hidden="true" />
                        Iniciar partida
                    </button>
                </>
            }
        >
            <p className="text-sm sm:text-base">
                Encuentra todas las parejas con el menor tiempo e intentos posibles.
            </p>

            {/* SELECTOR DE PERSONAJES */}
            <fieldset className="mt-5">
                <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Personajes
                </legend>

                <div className="grid grid-cols-2 gap-2">
                    {FILTROS.map((opcion) => (
                        <label key={opcion.value} className="cursor-pointer">
                            <input
                                type="radio"
                                name="filtro"
                                value={opcion.value}
                                checked={filtro === opcion.value}
                                onChange={() => onFiltroChange(opcion.value)}
                                className="peer sr-only"
                            />
                            <span
                                className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3
                                            text-sm font-medium text-slate-300 transition-colors
                                            hover:border-white/20 hover:bg-white/[0.06]
                                            peer-checked:border-lime-400/60 peer-checked:bg-lime-400/10 peer-checked:text-lime-100
                                            peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300"
                            >
                                {opcion.icon}
                                {opcion.label}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* ESTADO DE CARGA */}
            <p className="mt-4 flex items-center gap-2 text-sm" aria-live="polite">
                {isLoading && (
                    <>
                        <LoaderCircle size={16} className="animate-spin text-cyan-300" aria-hidden="true" />
                        <span className="text-slate-400">Preparando cartas…</span>
                    </>
                )}
                {isReady && (
                    <>
                        <Check size={16} strokeWidth={2.25} className="text-lime-300" aria-hidden="true" />
                        <span className="text-slate-300">Cartas listas</span>
                    </>
                )}
            </p>
        </Modal>
    );
}

export default StartModal;
