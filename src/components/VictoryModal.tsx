import { RotateCcw, Trophy } from "lucide-react";
import Modal from "./Modal";
import { formatTime } from "../utils/gameHelpers";

export type RecordStatus = {
    isFirst: boolean;
    newRecordTime: boolean;
    newRecordAttempts: boolean;
};

type VictoryModalProps = {
    nivelLabel: string;
    tiempo: number;
    intentos: number;
    pares: number;
    bestTime?: number;
    bestAttempts?: number;
    record: RecordStatus;
    onReset: () => void;
    onExit: () => void;
};

//  LÓGICA JUSTA (basada en eficiencia)
function getMessage(intentos: number, pares: number) {
    const eficiencia = intentos / pares;

    if (eficiencia === 1) return "Memoria perfecta. Ni Rick lo habría hecho mejor.";
    if (eficiencia <= 2) return "Excelente memoria.";
    if (eficiencia <= 3) return "Buen trabajo.";
    return "Misión cumplida. Aún puedes mejorar tu precisión.";
}

function getRecordText({ isFirst, newRecordTime, newRecordAttempts }: RecordStatus) {
    if (isFirst) return "Primer récord registrado";
    if (newRecordTime && newRecordAttempts) return "Nuevo récord de tiempo e intentos";
    if (newRecordTime) return "Nuevo récord de tiempo";
    if (newRecordAttempts) return "Nuevo récord de intentos";
    return null;
}

function VictoryModal({
    nivelLabel,
    tiempo,
    intentos,
    pares,
    bestTime,
    bestAttempts,
    record,
    onReset,
    onExit,
}: VictoryModalProps) {
    // porcentaje de intentos que fueron aciertos (100% = sin fallos)
    const precision = Math.round((pares / intentos) * 100);
    const recordText = getRecordText(record);

    const stats = [
        { label: "Tiempo", value: formatTime(tiempo) },
        { label: "Intentos", value: intentos },
        { label: "Precisión", value: `${precision}%` },
    ];

    return (
        <Modal
            icon={<Trophy size={20} strokeWidth={1.75} aria-hidden="true" />}
            eyebrow={`Misión completada · Nivel ${nivelLabel}`}
            title="¡Ganaste!"
            actions={
                <>
                    <button onClick={onExit} className="btn-secondary">
                        Volver al inicio
                    </button>

                    <button onClick={onReset} className="btn-primary" autoFocus>
                        <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
                        Jugar de nuevo
                    </button>
                </>
            }
        >
            <p>{getMessage(intentos, pares)}</p>

            {/* RESULTADO DE LA PARTIDA */}
            <dl className="mt-4 grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {stat.label}
                        </dt>
                        <dd className="mt-1 font-mono text-lg sm:text-xl font-semibold tabular-nums text-white">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>

            {/* RÉCORDS */}
            {recordText && (
                <p
                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        record.isFirst
                            ? "bg-cyan-400/10 text-cyan-200 ring-cyan-400/30"
                            : "bg-lime-400/10 text-lime-200 ring-lime-400/40"
                    }`}
                >
                    <Trophy size={12} strokeWidth={2} aria-hidden="true" />
                    {recordText}
                </p>
            )}

            {(bestTime !== undefined || bestAttempts !== undefined) && (
                <p className="mt-3 text-sm text-slate-400">
                    Mejor tiempo:{" "}
                    <span className="font-mono tabular-nums text-slate-200">
                        {bestTime !== undefined ? formatTime(bestTime) : "--"}
                    </span>
                    {" · "}
                    Menos intentos:{" "}
                    <span className="tabular-nums text-slate-200">{bestAttempts ?? "--"}</span>
                </p>
            )}
        </Modal>
    );
}

export default VictoryModal;
