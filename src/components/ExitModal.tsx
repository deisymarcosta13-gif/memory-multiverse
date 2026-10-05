import { LogOut } from "lucide-react";
import Modal from "./Modal";

type ExitModalProps = {
    onCancel: () => void;
    onExit: () => void;
};

function ExitModal({ onCancel, onExit }: ExitModalProps) {
    return (
        <Modal
            tone="warning"
            icon={<LogOut size={20} strokeWidth={1.75} aria-hidden="true" />}
            eyebrow="Abandonar misión"
            title="¿Salir de la partida?"
            onEscape={onCancel}
            actions={
                <>
                    <button onClick={onExit} className="btn-danger">
                        Salir
                    </button>

                    <button onClick={onCancel} className="btn-primary" autoFocus>
                        Continuar
                    </button>
                </>
            }
        >
            <p>Perderás el progreso de esta partida y volverás a la selección de nivel.</p>
        </Modal>
    );
}

export default ExitModal;
