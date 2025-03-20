import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getQAListBymno } from "../../../api/productQAAPI";
import { getOne } from "../../../api/productAPI";
import MyPageContainer from "../MyPageContainer";
import styles from './MyQAComponent.module.css';
import { ReactComponent as QIcon } from "../../../assets/icon/qIcon.svg";
import { ReactComponent as AIcon } from "../../../assets/icon/aIcon.svg";
import { getCookie } from "../../../util/cookieUtil";
import { LockOutlined, ExpandMoreRounded } from "@mui/icons-material";
import { format } from "date-fns";

const MyQAComponent = () => {
  const mno = getCookie("member").mno;
  const [ productQA, setProductQA ] = useState([]);
  const [ product, setProduct ] = useState([]);

  useEffect(() => {
    getQAListBymno(mno).then(data => {
      setProductQA(data);
    });
  }, [mno]);

  useEffect(() => {
    Promise.all(productQA.map(qa => getOne(qa.pno)))
    .then(data => setProduct(data))
    .catch(e => {console.error(e)});

    console.log(productQA);
  }, [productQA]);

  useEffect(() => {
    console.log(product);
  }, [product])

  return (
    <MyPageContainer>
      <div className={styles.wrap}>
        <h2 className={styles.title}>상품 문의</h2>
        <div className={styles.qaWrap}>
          {/* div.qaCard을 반복 출력 */}
          {
            product.length > 0 ?
            product.map((item, index) => {
              const qa = productQA[index];
              return (
                <div className={styles.qaCard}>
                  <div className={styles.qaThumbnail}>
                    <div className={styles.thumbLeft}>
                      <div className={styles.imgWrap}>
                        <img src="" alt="제품 사진" />
                      </div>
                      <div className={styles.thumbText}>
                        <p>[픽앤딜] {item.pName}</p>
                        <p>{qa.title}<LockOutlined /></p>
                        <p>
                          <span>답변완료</span>
                          <span className={styles.verLine}></span>
                          <span>2025.03.10</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.thumbRight}>
                      <ExpandMoreRounded />
                    </div>
                  </div>
                  <div className={styles.qaContent}>
                    <div className={styles.questionWrap}>
                      <div className={styles.iconWrap}>
                        <QIcon />
                      </div>
                      <p className={styles.question}>{qa.content}</p>
                    </div>
                    {
                      qa.proQAReply ?
                      <div className={styles.answerWrap}>
                        <div className={styles.iconWrap}>
                          <AIcon />
                        </div>
                        <p className={styles.answer}>
                          {qa.proQAReply.qr_content}
                          <br/>
                          {format((new Date(qa.proQAReply.regDate)), "yyyy.MM.dd")}
                        </p>
                      </div>
                      :
                      <></>
                    }
                    <div className={styles.btnWrap}>
                      <button
                        className={styles.modifyBtn}
                        onClick={null}
                      >
                        수정
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={null}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
            :
            <></>
          }
        </div>
      </div>
    </MyPageContainer>
  );
};

export default MyQAComponent;