import { useLocation, useNavigate } from 'react-router-dom';
import useCustomLogin from '../../../hooks/useCustomLogin';
import { useCustomMove } from '../../../hooks/useCustomMove';
import { useEffect, useState } from 'react';
import { deleteNotice, updateNotice } from '../../../api/adminAPI';
import styles from '../Admin.module.css';

export const AdminNoticeModifyPage = ({ nno }) => {
  const { loginState } = useCustomLogin();
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();
  const locaion = useLocation();
  const initState = locaion.state?.notice || {
    title: '',
    content: '',
    isPrivate: '',
  };
  const [notice, setNotice] = useState({ ...initState });

  useEffect(() => {
    if (nno) {
      setNotice((prevNotice) => ({
        ...prevNotice,
        nno: nno,
      }));
    }
  }, [nno]);

  const handleModifyNotice = (evt) => {
    const { name, value, checked, type } = evt.target;
    setNotice((prevFaq) => ({
      ...prevFaq,
      adno: loginState.adno,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNotice = (nno) => {
    navigate('/admin', { state: { nno } });
  };

  const handleClickModifyNoticeBtn = async () => {
    if (!notice.title.trim() || !notice.content.trim()) {
      alert('제목과 내용을 입력하시오');
      return;
    }

    console.log(notice);
    console.log(notice.nno);
    try {
      const response = await updateNotice(notice.nno, notice);
      console.log('수정 성공', response);

      alert('공지사항 수정됨');
      handleNotice(notice.nno);
    } catch (error) {
      console.error('공지 수정 실패');
      alert('공지 수정중 오류 발생');
    }
  };

  const handleClickDeleteNoticeBtn = async () => {
    try {
      const res = await deleteNotice(notice.nno);
      console.error('삭제 성공', res);
      alert('질문이 삭제되었습니다');
      moveToList({ page: 1 });
    } catch {
      console.error('삭제 실패');
    }
  };

  return (
    <div className={styles.wrap}>
      <div>관리자 - 공지사항 수정 페이지</div>

      <div>
        <label>제목</label>
        <input
          name="title"
          type="text"
          value={notice.title}
          onChange={handleModifyNotice}
          placeholder="제목을 입력하시오"
        />
      </div>

      <div>
        <label>내용</label>
        <input
          name="content"
          type="text"
          value={notice.content}
          onChange={handleModifyNotice}
          placeholder="내용을 입력하시오"
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={notice.isPrivate}
          onChange={handleModifyNotice}
        />
        비공개 여부
      </label>

      <div>
        <button type="button" onClick={handleClickModifyNoticeBtn}>
          수정
        </button>

        <button type="button" onClick={handleClickDeleteNoticeBtn}>
          삭제
        </button>

        <button type="button" onClick={() => moveToList({ page: 1 })}>
          목록
        </button>
      </div>
    </div>
  );
};
