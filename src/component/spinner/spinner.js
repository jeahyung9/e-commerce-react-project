import styles from './spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.spinnerWrap}>
      <span className={styles.loadingIndicator}>
        <span className={styles.circularProgress}>
          <svg
            viewBox="22 22 44 44"
            className={styles.svg}
          >
            <circle
              cx="44"
              cy="44"
              r="20.2"
              fill="none"
              stroke-width="3.6"
              className={styles.svgCircle}
            />
          </svg>
        </span>
      </span>
    </div>
  );
}

export default Spinner;