import { ArrowForwardIosRounded } from '@mui/icons-material';
import styles from './visualBanner.module.css';

const visualBanner = ({ title, subTitle, imgSrc, imgAlt }) => {
  return (
    <div className={styles.visualBanner}>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subTitle}>
          <span>{subTitle}</span>
          <ArrowForwardIosRounded />
        </p>
      </div>
      <img className={styles.img} src={imgSrc} alt={imgAlt}></img>
    </div>
  );
};

export default visualBanner;
