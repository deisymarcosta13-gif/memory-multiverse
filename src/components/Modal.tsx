import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalTone = "portal" | "warning" | "danger";

type ModalProps = {
    tone?: ModalTone;
    icon?: ReactNode;
    eyebrow: string;
    title: string;
    children?: ReactNode;
    actions: ReactNode;
    onEscape?: () => void;
};

// solo los detalles cambian según el tipo de modal
const TONES: Record<ModalTone, { accent: string; eyebrow: string; icon: string }> = {
    portal: {
        accent: "from-lime-400/0 via-lime-400 to-cyan-400/0",
        eyebrow: "text-lime-300",
        icon: "bg-lime-400/10 text-lime-300 ring-lime-400/30",
    },
    warning: {
        accent: "from-amber-400/0 via-amber-400 to-amber-400/0",
        eyebrow: "text-amber-300",
        icon: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    },
    danger: {
        accent: "from-rose-400/0 via-rose-400 to-rose-400/0",
        eyebrow: "text-rose-300",
        icon: "bg-rose-400/10 text-rose-300 ring-rose-400/30",
    },
};

function Modal({ tone = "portal", icon, eyebrow, title, children, actions, onEscape }: ModalProps) {
    const titleId = useId();
    const styles = TONES[tone];
    const dialogRef = useRef<HTMLDivElement>(null);

    // si ningún botón tiene autoFocus, el foco va al propio diálogo
    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.contains(document.activeElement)) {
            dialog.focus();
        }
    }, []);

    // cerrar con Escape (solo en los modales que lo permiten)
    useEffect(() => {
        if (!onEscape) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onEscape();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onEscape]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="panel w-full max-w-md outline-none max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-7
                            animate-modal-in motion-reduce:animate-none"
            >
                <div className={`panel-accent ${styles.accent}`} />

                <div className="flex items-start gap-4">
                    {icon && (
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${styles.icon}`}>
                            {icon}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.eyebrow}`}>
                            {eyebrow}
                        </p>
                        <h2 id={titleId} className="mt-1 text-xl sm:text-2xl font-bold text-white">
                            {title}
                        </h2>
                    </div>
                </div>

                {children && <div className="mt-5 text-slate-300">{children}</div>}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    {actions}
                </div>
            </div>
        </div>
    );
}

export default Modal;
