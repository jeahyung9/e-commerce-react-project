import { useEffect } from 'react';
import styles from './RemoveModalComponent.module.css';

export const RemoveModalComponent = ({ modal, setModal, setIsRemove, setSelectRemoveModal}) => {

    
    useEffect(() => {
        if (modal.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    },[modal.isOpen]);
    
    if(!modal.isOpen) return null;
    
    const remove = () => {
        setIsRemove(true);
        setModal({isOpen: false});
        if(setSelectRemoveModal){
            setSelectRemoveModal(false);
        }
    }

    const modalClose = () => {
        setModal({isOpen: false});
        if(setSelectRemoveModal){
            setSelectRemoveModal(false);
        }
    }
    

    return(
        <div className={styles.removeModalWrap}>
            <div className={styles.bg} onClick={modalClose}></div>
            <div className={styles.removeModalContent}>
                <p>정말 삭제하시겠습니까?</p>
                <div className={styles.btnWrap}>
                    <button className={styles.cancleBtn} onClick={modalClose}>취소</button>
                    <button className={styles.submitBtn} onClick={remove}>확인</button>
                </div>
            </div>
        </div>
    )
}