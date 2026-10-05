import { RefreshCw, TriangleAlert } from "lucide-react";
import Modal from "./Modal";

type ErrorModalProps = {
    message: string;
    onRetry: () => void;
    onExit: () => void;
};

function ErrorModal({ message, onRetry, onExit }: ErrorModalProps) {
    return (
        <Modal
            tone="danger"
            icon={<TriangleAlert size={20} strokeWidth={1.75} aria-hidden="true" />}
            eyebrow="Error de conexión"
            title="No se pudo abrir el portal"
            actions={
                <>
                    <button onClick={onExit} className="btn-secondary">
                        Volver al inicio
                    </button>

                    <button onClick={onRetry} className="btn-primary" autoFocus>
                        <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
                        Reintentar
                    </button>
                </>
            }
        >
            <p>{message}</p>
            <p className="mt-1 text-sm text-slate-400">Comprueba tu conexión e inténtalo de nuevo.</p>
        </Modal>
    );
}

export default ErrorModal;
