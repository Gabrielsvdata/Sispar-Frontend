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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <header className={styles.modalHeader}>
          <h3>{title}</h3>
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

export default ModalConfirmacao;