import { useEffect, useState } from "react";
import styles from "./ReviewModalComponent.module.css";
import { addReview, getReviewOne } from "../../api/reviewAPI";
import { TextField, Rating, Button } from "@mui/material";

const ReviewModalComponent = ({modal, setModal, setIsAdd, rno, mno}) => {
  const [ review, setReview ] = useState();
  const orno = modal.orno;
  const odno = modal.odno;

  useEffect(() => {
    if(modal.isOpen){
        document.body.style.overflow = 'hidden';
    }else{
        document.body.style.overflow = 'auto';
    }
    if(rno){
        getReviewOne(rno).then(data => {
          setReview(data);
        });
    }else{
      setReview({mno: mno, odno: odno})
    }
  }, [modal])

  useEffect(() => {
    console.log(review);
  }, [review])
  
  if(!modal.isOpen) return;

  const change = (e) => {
    setReview({...review, [e.target.name]: e.target.value});
  }

  const closeModal = () => {
    setModal({isOpen: false});
  }

  const addReviewHandler = () => {
    if(!review.title){
      alert("제목을 입력해주세요.")
    }else if(!review.rate){
      alert("평점을 선택해주세요.")
    }else if(!review.content){
      alert("내용을 입력해주세요.")
    }else{
      addReview(orno, review).then(() =>{
        alert("리뷰가 등록되었습니다.")
        setIsAdd(true);
        setModal({isOpen: false});
      });
    }
  }

  return (
    <>
      <div className={styles.reviewModalWrap}>
        <div onClick={closeModal} className={styles.bg}></div>
        <div className={styles.modalContent}>
          <h1 className={styles.modalName}>후기 작성</h1>
          <div className={styles.container}>
            <div className={styles.titleWrap}>
              <div className={styles.inputLabel}>후기 제목</div>
              <div className={styles.inputWrap}>
                <TextField spellCheck="false" fullWidth name="title" placeholder="제목을 입력해주세요" onChange={change} />
              </div>
            </div>
            <div className={styles.ratingWrap}>
              <div className={styles.inputLabel}>평점</div>
              <div className={styles.inputWrap}>
                <Rating name="rate" defaultValue="0" min={1} onChange={change} />
              </div>
            </div>
            <div className={styles.contentWrap}>
              <div className={styles.inputLabel}>후기 내용</div>
              <div className={styles.inputWrap}>
                <TextField spellCheck="false" multiline maxRows={10} fullWidth name="content" placeholder="좋은 후기는 다른 소비자 분들께 큰 도움이 됩니다" onChange={change} />
              </div>
            </div>
          </div>
          <div className={styles.buttonWrap}>
            <Button variant="outlined" color="textLightblack" onClick={closeModal}>취소</Button>
            <Button variant="outlined" onClick={addReviewHandler}>작성완료</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewModalComponent;