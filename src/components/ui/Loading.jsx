import styles from './Loading.module.scss';
import PropTypes from 'prop-types';

export function Loading({ fullScreen = false, message = 'Carregando...' }) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenLoader}>
        <div className={styles.spinner}></div>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.inlineLoader}>
      <div className={styles.spinner}></div>
      <span>{message}</span>
    </div>
  );
}

Loading.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
};

export function ButtonLoading({ children, loading, disabled, ...props }) {
  return (
    <button {...props} disabled={loading || disabled}>
      {loading ? (
        <>
          <span className={styles.buttonSpinner}></span>
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

ButtonLoading.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};
