import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { breakLine } from '../../hooks/useCustomString';
import styles from './NoticeDetailComponent.module.css';
import { format } from 'date-fns';

const BoardDetailComponent = () => {
  const { nno } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state;

  console.log(notice);
  

  const handleClickListBtn = () => {
    //navigate('/board/notice');
    navigate(-1);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.titleWrap}>
        <h3 className={styles.title}>{notice.title}</h3>
        <p className={styles.date}>{format((new Date(notice.regDate)), "yyyy.MM.dd")}</p>
      </div>
      <p className={styles.contentWrap}>
        {breakLine(notice.content)}
      </p>
      <div className={styles.btnWrap}>
        <div
          onClick={handleClickListBtn}
          className={styles.listBtn}
        >
          목록보기
        </div>
      </div>
    </div>
  );
}

export default BoardDetailComponent;