import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFaq } from '../../../api/adminAPI';
import { useCustomMove } from '../../../hooks/useCustomMove';
import styles from '../Admin.module.css';

export const AdminFaqDetailPage = () => {
  const location = useLocation();
  const fno = location.state?.fno;
  const [faq, setFaq] = useState();
  const navigate = useNavigate();
  const { moveToList } = useCustomMove();

  useEffect(() => {
    getFaq(fno).then((data) => {
      console.log(data);
      setFaq(data);
    });
  }, [fno]);

  const handleModifyFaq = () => {
    console.log('modifyFaq');
    navigate('/admin', { state: { modifyFaq: true, faq } });
  };

  return (
    <div className={styles.wrap}>
      <div>{fno}</div>
      <div>{faq?.question}</div>
      <div>{faq?.answer}</div>
      <button onClick={() => handleModifyFaq(faq.fno)}>수정 및 삭제</button>
      <button type="button" onClick={() => moveToList({ page: 1 })}>
        목록
      </button>
    </div>
  );
};
