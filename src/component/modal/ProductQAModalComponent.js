import { useEffect, useState } from 'react';
import styles from './ProductQAModalComponent.module.css';
import { addQA, changeQA } from '../../api/productQAAPI';
import { IconButton, TextField } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import Checkbox from '../../component/checkbox/checkbox';

const initState = {
    title: "",
    content: "",
    replyCheck: false,
    secret: false,
    mno: 0,
    pno: 0,
};

export const ProductQAModalComponent = ({mno, modal, setModal, pno, setReload}) => {
    const [ qa, setQA ] = useState(initState);

    useEffect(() => {
        if(modal.isOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
        if(modal.qa){
            setQA(modal.qa);
        }
    }, [modal])

    useEffect(() => {
        console.log(qa);
        
    }, [qa])

    if(!modal.isOpen) return null;

    const closeModal = () => {
        setModal({isModal : false});
        setQA(initState);
    }

    const onAddQA = () => {
        if(!qa.title || qa.title === ""){
            alert("제목을 입력해주세요.");
            return;
        }else if(!qa.content || qa.content === ""){
            alert("내용을 입력해주세요.");
            return;
        }

        if(modal.qa){
            changeQA(qa);
            alert("문의가 정상적으로 수정되었습니다.");
        }else{
            addQA(qa);
            alert("문의가 정상적으로 등록되었습니다.");
        }
        setModal({isModal : false});
        setQA(initState);
        setReload(true);
    }

    const secretSelect = () => {
        if(qa.secret){
            setQA(prevQA => ({...prevQA, secret: false}));
        }else{
            setQA(prevQA => ({...prevQA, secret: true}));
        }
    }

    const change = (e) => {
        setQA(prevQA => ({...prevQA, [e.target.name]: e.target.value, mno: mno, pno: pno}));
    }

    return(
        <>
            <div className={styles.QAModalWrap}>
                <div onClick={closeModal} className={styles.bg}></div>
                <div className={styles.modalContent}>
                    <div className={styles.contentTop}>
                        <div className={styles.contentTitle}>상품 문의하기</div>
                        <IconButton onClick={closeModal} className={styles.modalClose}>
                            <CloseRounded />
                        </IconButton>
                    </div>
                    <div className={styles.inputWrap}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputLabel}>제목</div>
                            <TextField fullWidth placeholder="제목을 입력" name="title" onChange={change} value={qa.title}></TextField>
                        </div>
                        <div className={styles.inputRow}>
                            <div className={styles.inputLabel}>내용</div>
                            <TextField fullWidth multiline rows={10} placeholder="내용을 입력" name="content" onChange={change} value={qa.content}></TextField>
                        </div>
                        <Checkbox label="비밀글로 문의하기" checked={qa.secret} onChange={secretSelect}/>
                    </div>
                    <div className={styles.modalButtonWrap}>
                        <button onClick={closeModal}>취소</button>
                        <button onClick={onAddQA}>확인</button>
                    </div>
                </div>
            </div>
        </>
    )
}