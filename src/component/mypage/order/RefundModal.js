import React, { useEffect, useRef } from 'react';
import styles from './RefundModal.module.css';

const RefundModal = ({ show, onClose, onConfirm, refundReason, setRefundReason, loading }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (show) {
      modalRef.current?.focus();
    }
  }, [show]);

  if (!show) return null;

  const isReasonValid = refundReason.length >= 10;

  const handleConfirm = async () => {
    if (!isReasonValid) {
      alert('환불 사유를 최소 10자 이상 입력해주세요.');
      return;
    }
  
    try {
      const response = await onConfirm(refundReason);
      if (response) {
        console.log('Refund response:', response);
      } else {
        console.error('응답이 비어 있습니다.');
      }
    } catch (error) {
      console.error('Refund request error:', error);
      alert(`환불 요청 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.refundModal}>
        <div className={styles.modalHeader}>
          <h3>환불 신청</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.refundForm}>
            <label htmlFor="refundReason">환불 사유</label>
            <textarea
              id="refundReason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="환불 사유를 자세히 작성해 주세요. (최소 10자)"
              rows={4}
              maxLength={500}
            />
            <div className={styles.textLength}>{refundReason.length} / 500자</div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton} aria-label="Cancel">취소</button>
          <button onClick={handleConfirm} className={styles.confirmButton} disabled={loading || !isReasonValid}>
            {loading ? '처리중...' : '환불 신청'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;