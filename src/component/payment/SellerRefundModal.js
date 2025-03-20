import React from 'react';
import styles from './SellerRefundModal.module.css';

const SellerRefundModal = ({ show, onClose, onConfirm, refundReason, setRefundReason, loading }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>환불 요청</h3>
        <textarea
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          placeholder="환불 사유를 입력하세요"
          rows="4"
        />
        <div className={styles.modalActions}>
          <button onClick={onClose} disabled={loading}>취소</button>
          <button onClick={onConfirm} disabled={loading || !refundReason.trim()}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default SellerRefundModal;