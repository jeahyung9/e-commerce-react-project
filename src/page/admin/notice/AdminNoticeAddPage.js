import { useState } from 'react';
import { useCustomMove } from '../../../hooks/useCustomMove';
import useCustomLogin from '../../../hooks/useCustomLogin';
import { addNotice } from '../../../api/adminAPI';
import styles from '../Admin.module.css';

const initState = {
  title: '',
  content: '',
  isPrivate: false,
  adno: 0,
  // imgPath: '',
};

const AdminNoticeAddPage = () => {
  const [notice, setNotice] = useState({ ...initState });
  const { moveToList } = useCustomMove();
  const { loginState } = useCustomLogin();

  const handleAddNotice = (evt) => {
    const { name, value, checked, type } = evt.target;
    setNotice((prevNotice) => ({
      ...prevNotice,
      adno: loginState.adno,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClickAddNoticeBtn = async () => {
    if (!notice.title.trim() || !notice.content.trim()) {
      alert('제목과 내용을 입력하시오');
      return;
    }

    try {
      const response = await addNotice(notice);
      console.log('등록 성공', response);

      alert('공지사항이 등록되었음');
      moveToList({ page: 1 });
    } catch (error) {
      console.error('공지사항 등록 실패', error);
      alert('공지사항 등록 중 오류 발생');
    }
  };

  return (
    <div className={styles.wrap}>
      <h2>관리자 - 공지 사항 추가 페이지</h2>

      <div>
        <label>제목</label>
        <input
          name="title"
          type="text"
          value={notice.title}
          onChange={handleAddNotice}
          placeholder="제목을 입력하시오"
        />
      </div>

      <div>
        <label>내용</label>
        <input
          name="content"
          type="text"
          value={notice.content}
          onChange={handleAddNotice}
          placeholder="내용을 입력하시오"
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={notice.isPrivate}
          onChange={handleAddNotice}
        />
        비공개 여부
      </label>

      <div>
        <button type="button" onClick={handleClickAddNoticeBtn}>
          등록
        </button>

        <button type="button" onClick={() => moveToList({ page: 1 })}>
          목록
        </button>
      </div>
    </div>
  );
};
export default AdminNoticeAddPage;
