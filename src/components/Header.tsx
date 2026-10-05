import type { ReactNode } from "react";
import { Crosshair, LogOut, RotateCcw, Timer } from "lucide-react";
import { formatTime } from "../utils/gameHelpers";

type HeaderProps = {
    nivelLabel: string;
    tiempo: number;
    intentos: number;
    onReset: () => void;
    onBack: () => void;
};

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.04] px-3 py-1.5 sm:px-4">
            <span className="text-cyan-300/80">{icon}</span>
            <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-white">{value}</p>
            </div>
        </div>
    );
}

function Header({ nivelLabel, tiempo, intentos, onReset, onBack }: HeaderProps) {
    return (
        <header className="panel w-full px-3 py-2.5 sm:px-5 sm:py-3">
            <div className="panel-accent from-lime-400/0 via-lime-400/70 to-cyan-400/0" />

            {/* móvil: [nivel | botones] / [tiempo | intentos] — desktop: una sola fila */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 sm:grid-cols-[1fr_auto_1fr]">

                {/* NIVEL */}
                <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-400 shadow-[0_0_8px_rgb(163_230_53/0.7)]" aria-hidden="true" />
                    <div className="leading-tight">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Nivel</p>
                        <p className="text-sm sm:text-base font-semibold text-lime-300">{nivelLabel}</p>
                    </div>
                </div>

                {/* TIEMPO E INTENTOS */}
                <div className="order-last col-span-2 grid grid-cols-2 gap-2 sm:order-none sm:col-span-1 sm:flex sm:gap-3">
                    <Stat icon={<Timer size={18} strokeWidth={1.75} aria-hidden="true" />} label="Tiempo" value={formatTime(tiempo)} />
                    <Stat icon={<Crosshair size={18} strokeWidth={1.75} aria-hidden="true" />} label="Intentos" value={intentos} />
                </div>

                {/* ACCIONES */}
                <div className="flex justify-end gap-2">
                    <button onClick={onReset} className="btn-secondary btn-sm">
                        <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
                        Reiniciar
                    </button>

                    <button onClick={onBack} className="btn-secondary btn-sm">
                        <LogOut size={15} strokeWidth={2} aria-hidden="true" />
                        Salir
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
