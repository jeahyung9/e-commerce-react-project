import { v4 as uuidv4 } from 'uuid';
import styles from './checkbox.module.css';

const Checkbox = ( props ) => {
  const id = uuidv4();

  return (
    <>
      <input type="checkbox" id={id} className={styles.checkbox} {...props} />
      <label htmlFor={id}>{props.label}</label>
    </>
  );
};

export default Checkbox;
