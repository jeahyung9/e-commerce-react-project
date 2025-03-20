import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageComponent from '../paging/PageComponent';
import styles from './NoticeTableComponent.module.css';
import { getNoticeList } from '../../api/adminAPI';
import { format } from 'date-fns';
import { useCustomMove } from '../../hooks/useCustomMove';

const NoticeTableComponent = () => {
  const navigate = useNavigate();
  const [ noticeList, setNoticeList ] = useState([]);
  const [ serverData, setServerData ] = useState([]);
  const { page, moveToList } = useCustomMove();
  
  useEffect(() => {
    getNoticeList({page: page, size: 10}).then(data => {
      setNoticeList(data.dtoList);
      setServerData(data);
    });
  }, [page]);


  const handleClick = (notice) => {
    navigate(`/board/notice/detail/${notice.nno}`, { state: notice });
  }

  return (
    <>
      <table className={styles.boardTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.length > 0 ?
            noticeList.map((notice) => (
              <tr
                key={notice.nno}
                onClick={() => handleClick(notice)}
                className={styles.tableContent}
              >
                <td>{notice.nno}</td>
                <td className={styles.contentTitle}>{notice.title}</td>
                <td>픽앤딜</td>
                <td className={styles.date}>{format((new Date(notice.regDate)), "yyyy.MM.dd")}</td>
              </tr>
            ))
            :
            <></>
        }
        </tbody>
      </table>
      <PageComponent serverData={serverData} movePage={moveToList} />
    </>
  );
}

export default NoticeTableComponent;