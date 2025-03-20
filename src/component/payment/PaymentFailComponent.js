import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CancelRounded } from '@mui/icons-material';
import styles from './PaymentFailComponent.module.css';

const PaymentFailComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.errorMessage || '결제 처리 중 오류가 발생했습니다.';
  const errorCode = location.state?.errorCode || '';

  const handleRetry = () => {
    navigate('/payment');
  };

  const handleGoToOrders = () => {
    navigate('/payment/orders');
  };

  const handleGoToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.paymentFailContainer}>
      <div className={styles.paymentFailContent}>
        <div className={styles.failIcon}>
          <CancelRounded color="red" sx={{ fontSize: 100 }} />
        </div>
        
        <div className={styles.paymentFailHeader}>
          <h2>결제 실패</h2>
          <p className={styles.errorMessage}>{errorMessage}</p>
          {errorCode && (
            <p className={styles.errorCode}>에러 코드: {errorCode}</p>
          )}
        </div>

        <div className={styles.suggestionText}>
          <p>다음과 같은 이유로 결제가 실패했을 수 있습니다:</p>
          <ul>
            <li>카드 한도 초과</li>
            <li>잘못된 카드 정보</li>
            <li>일시적인 네트워크 오류</li>
            <li>결제 시간 초과</li>
          </ul>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={styles.retryButton}
            onClick={handleRetry}
          >
            다시 시도하기
          </button>
          <button 
            className={styles.ordersButton}
            onClick={handleGoToOrders}
          >
            주문 목록으로
          </button>
          <button 
            className={styles.mainButton}
            onClick={handleGoToMain}
          >
            메인으로 돌아가기
          </button>
        </div>

        <div className={styles.supportInfo}>
          <p>문제가 지속되면 고객센터로 문의해주세요.</p>
          <p className={styles.supportContact}>고객센터: 1234-5678</p>
          <p className={styles.supportHours}>운영시간: 평일 09:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailComponent;