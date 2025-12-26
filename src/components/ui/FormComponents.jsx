import styles from './FormInput.module.scss';
import PropTypes from 'prop-types';

export function FormInput({ 
  label, 
  error, 
  icon, 
  required = false,
  ...props 
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <input {...props} className={error ? styles.inputError : ''} />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  required: PropTypes.bool,
};

export function FormSelect({ 
  label, 
  error, 
  icon, 
  children,
  required = false,
  ...props 
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <select {...props} className={error ? styles.inputError : ''}>
          {children}
        </select>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

FormSelect.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  required: PropTypes.bool,
};

export function FormTextarea({ 
  label, 
  error,
  required = false,
  ...props 
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea {...props} className={error ? styles.inputError : ''} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

FormTextarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
};

export function FormFile({
  label,
  error,
  onChange,
  fileName,
  required = false,
  accept = "image/*,.pdf",
  ...props
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input 
        type="file" 
        accept={accept}
        onChange={onChange}
        className={error ? styles.inputError : ''}
        {...props}
      />
      {fileName && (
        <span className={styles.fileName}>📎 {fileName}</span>
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

FormFile.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  fileName: PropTypes.string,
  required: PropTypes.bool,
  accept: PropTypes.string,
};
