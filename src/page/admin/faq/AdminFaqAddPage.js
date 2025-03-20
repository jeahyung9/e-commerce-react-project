import { useState } from 'react';
import { useCustomMove } from '../../../hooks/useCustomMove';
import { addFaq } from '../../../api/adminAPI';
import useCustomLogin from '../../../hooks/useCustomLogin';
import styles from '../Admin.module.css';

const initState = {
  question: '',
  answer: '',
  isPrivate: false,
  adno: 0,
};

const AdminFaqAddPage = () => {
  const [faq, setFaq] = useState({ ...initState });
  const { moveToList } = useCustomMove();
  const { loginState } = useCustomLogin();

  const handleAddFaq = (evt) => {
    const { name, value, checked, type } = evt.target;
    setFaq((prevFaq) => ({
      ...prevFaq,
      adno: loginState.adno,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClickAddFaqBtn = async () => {
    if (!faq.question.trim() || !faq.answer.trim()) {
      alert('질문과 답변 모두 입력하시오');
      return;
    }

    try {
      const response = await addFaq(faq);
      console.log('등록 성공', response);

      alert('질문이 등록되었음');
      moveToList({ page: 1 });
    } catch (error) {
      console.error('FAQ 등록 실패', error);
      alert('질문 등록 중 오류 발생');
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
          onChange={handleAddFaq}
          placeholder="질문을 입력하시오"
        />
      </div>

      <div>
        <label>답변</label>
        <input
          name="answer"
          type="text"
          value={faq.answer}
          onChange={handleAddFaq}
          placeholder="답변을 입력하시오"
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={faq.isPrivate}
          onChange={handleAddFaq}
        />
        비공개 여부
      </label>

      <div>
        <button type="button" onClick={handleClickAddFaqBtn}>
          등록
        </button>

        <button type="button" onClick={() => moveToList({ page: 1 })}>
          목록
        </button>
      </div>
    </div>
  );
};

export default AdminFaqAddPage;
