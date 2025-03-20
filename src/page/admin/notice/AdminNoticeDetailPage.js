import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNotice } from '../../../api/adminAPI';
import styles from './AdminNoticeDetailPage.module.css';
import { useCustomMove } from '../../../hooks/useCustomMove';
import styles2 from '../Admin.module.css';

export const AdminNoticeDetailPage = () => {
  const location = useLocation();
  const nno = location.state?.nno;
  const [notice, setNotice] = useState();
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();

  useEffect(() => {
    getNotice(nno).then((data) => {
      console.log(data);
      setNotice(data);
    });
  }, [nno]);

  const handleModifyNotice = () => {
    console.log('modifyNotice');
    navigate('/admin', { state: { modifyNotice: true, notice } });
  };

  return (
    <div className={styles2.wrap}>
      <div className={styles.noticeNum}>{nno}</div>
      <div>{notice?.title}</div>
      <div>{notice?.content}</div>
      <button onClick={() => handleModifyNotice(notice.nno)}>
        수정 및 삭제
      </button>
      <button type="button" onClick={() => moveToList({ page: 1 })}>
        목록
      </button>
    </div>
  );
};
