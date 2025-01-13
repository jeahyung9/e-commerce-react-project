import { v4 as uuidv4 } from 'uuid';
import './checkbox.css';

const checkbox = ({ label }) => {
  const id = uuidv4();

  return (
    <>
      <input type="checkbox" id={id} className="checkbox"></input>
      <label htmlFor={id}>{label}</label>
    </>
  );
};

export default checkbox;
