import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ModalConfirmacao.module.scss";

function ModalConfirmacao({
  isOpen,
  title,
  children,
  onConfirm,
  onClose,
  // 👇 NOVAS PROPS COM VALORES PADRÃO PARA FLEXIBILIDADE
  confirmText = "Confirmar",
  showCancelButton = true,
  confirmButtonType = "danger", // 'danger' para vermelho, 'primary' para azul
}) {
  // Fecha modal com tecla ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    // Previne scroll do body quando modal está aberto
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Lógica para definir a classe do botão principal com base na prop
  const confirmButtonClass =
    confirmButtonType === "primary"
      ? styles.buttonPrimary
      : styles.buttonConfirm;

  // Impede que o clique dentro do conteúdo do modal o feche
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContent} onClick={handleContentClick}>
        <header className={styles.modalHeader}>
          <h3 id="modal-title">{title}</h3>
          {onClose && (
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Fechar modal"
              type="button"
            >
              ✕
            </button>
          )}
        </header>

        <main className={styles.modalBody}>
          <p>{children}</p>
        </main>

        <footer className={styles.modalFooter}>
          {/* LÓGICA CORRIGIDA: Renderiza o botão "Cancelar" apenas se necessário */}
          {showCancelButton && (
            <button className={styles.buttonCancel} onClick={onClose}>
              Cancelar
            </button>
          )}

          {/* LÓGICA CORRIGIDA: Usa as props para definir o texto e o estilo do botão */}
          <button className={confirmButtonClass} onClick={onConfirm}>
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
}

ModalConfirmacao.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  showCancelButton: PropTypes.bool,
  confirmButtonType: PropTypes.oneOf(["danger", "primary"]),
};

export default ModalConfirmacao;