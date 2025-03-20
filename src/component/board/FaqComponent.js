import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { breakLine } from '../../hooks/useCustomString';
import PageComponent from '../paging/PageComponent';
import styles from './FaqComponent.module.css';
import { getFaqList } from '../../api/adminAPI';
import { useCustomMove } from '../../hooks/useCustomMove';

const FaqComponent = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ faqList, setFaqList ] = useState([]);
  const [ serverData, setServerData ] = useState([]);
  const { page, moveToList } = useCustomMove();

  useEffect(() => {
    getFaqList({page:page, size:10}).then(data => {
      setFaqList(data.dtoList);
      setServerData(data);
    });
  }, [page])

  const handleClick = (fno) => {
    setExpandedFaq(expandedFaq === fno ? null : fno);
  }

  return (
    <div className={styles.contentWrap}>
      <div className={styles.titleWrap}>
        <h2 className={styles.boardTitle}>자주 묻는 질문</h2>
        <h3 className={styles.boardSubtitle}>고객님들께서 가장 자주 하시는 질문들을 모두 모았습니다.</h3>
      </div>
      <div className={styles.boardContainer}>
        <table className={styles.boardTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {faqList.length > 0 ?
              faqList.map((faq) => (
                <Fragment key={faq.fno}>
                  <tr
                    onClick={() => handleClick(faq.fno)}
                    className={styles.tableContent}
                  >
                    <td>{faq.fno}</td>
                    <td className={styles.contentTitle}>{faq.question}</td>
                    <td>픽앤딜</td>
                  </tr>
                  <tr className={classNames(
                    styles.answer,
                    { [styles.expanded]: expandedFaq === faq.fno }
                  )}>
                    <td colSpan="4">
                      {breakLine(faq.answer)}
                    </td>
                  </tr>
                </Fragment>
              ))
              :
              <></>
            }
          </tbody>
        </table>
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </div>
  );
}

export default FaqComponent;