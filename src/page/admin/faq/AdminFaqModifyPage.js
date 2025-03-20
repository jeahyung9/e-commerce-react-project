import { useEffect, useState } from 'react';
import { useCustomMove } from '../../../hooks/useCustomMove';
import { deleteFaq, updateFaq } from '../../../api/adminAPI';
import useCustomLogin from '../../../hooks/useCustomLogin';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../Admin.module.css';

const AdminFaqModifyPage = ({ fno }) => {
  const { isLogin, loginState, doLogout } = useCustomLogin();
  const { page, size, sort, moveToList } = useCustomMove();
  const navigate = useNavigate();
  const location = useLocation();
  const initState = location.state?.faq || {
    question: '',
    answer: '',
    isPrivate: false,
  };

  const [faq, setFaq] = useState({ ...initState });

  useEffect(() => {
    if (fno) {
      setFaq((prevFaq) => ({
        ...prevFaq,
        fno: fno,
      }));
    }
  }, [fno]);

  const handleModifyFaq = (evt) => {
    const { name, value, checked, type } = evt.target;
    setFaq((prevFaq) => ({
      ...prevFaq,
      adno: loginState.adno,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFaq = (fno) => {
    navigate('/admin', { state: { fno } });
  };

  const handleClickModifyFaqBtn = async () => {
    if (!faq.question.trim() || !faq.answer.trim()) {
      alert('질문과 답변 모두 입력하시오');
      return;
    }
    console.info(faq);
    console.info(faq.fno);
    try {
      const response = await updateFaq(faq.fno, faq);
      console.log('등록 성공', response);

      alert('질문이 수정되었음');
      handleFaq(faq.fno);
    } catch (error) {
      console.error('FAQ 등록 실패', error);
      alert('질문 수정 중 오류 발생');
    }
  };

  const handleClickDeleteFaqBtn = async () => {
    try {
      const res = await deleteFaq(faq.fno);
      console.log('삭제 성공', res);
      alert('질문이 삭제 되었음');
      moveToList({ page: 1 });
    } catch (error) {
      console.error('삭제 실패');
    }
  };

  return (
    <div className={styles.wrap}>
      <h2>관리자 - FAQ 추가 페이지</h2>

      <div>
        <label>질문</label>
        <input
          name="question"
          type="text"
          value={faq.question}
          onChange={handleModifyFaq}
          placeholder="제목을 입력하시오"
        />
      </div>

      <div>
        <label>답변</label>
        <input
          name="answer"
          type="text"
          value={faq.answer}
          onChange={handleModifyFaq}
          placeholder="답변을 입력하시오"
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={faq.isPrivate}
          onChange={handleModifyFaq}
        />
        비공개 여부
      </label>

      <div>
        <button type="button" onClick={handleClickModifyFaqBtn}>
          수정
        </button>

        <button type="button" onClick={handleClickDeleteFaqBtn}>
          삭제
        </button>

        <button type="button" onClick={() => moveToList({ page: 1 })}>
          목록
        </button>
      </div>
    </div>
  );
};

export default AdminFaqModifyPage;
