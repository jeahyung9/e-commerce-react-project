// PaymentCompletePage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleRounded } from '@mui/icons-material';
import { addComma } from '../../hooks/useCustomString';
import styles from './PaymentCompleteComponent.module.css';

const PaymentCompleteComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mno = location.state?.mno;
  const orderInfo = location.state?.orderInfo || {};
  const { o_reciver, o_address, o_reciverPhoNum, o_totalPrice, orderDetails } = orderInfo;

  // 데이터가 올바르게 전달되었는지 확인하기 위한 콘솔 로그
  console.log("Order Info:", orderInfo);

  const handleGoToOrders = () => {
    navigate('/mypage/order', { state: { mno } });
  };

  const handleGoToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.paymentCompleteContainer}>
      <div className={styles.paymentCompleteContent}>
        <div className={styles.successIcon}>
          <CheckCircleRounded color="primary" style={{ fontSize: 100 }} />
        </div>
        
        <div className={styles.paymentCompleteHeader}>
          <h2>결제 완료</h2>
          <p>주문이 성공적으로 완료되었습니다.</p>
        </div>

        <div className={styles.orderInfo}>
          <p><strong>수령인:</strong> {o_reciver || '정보 없음'}</p>
          <p><strong>배송지:</strong> {o_address || '정보 없음'}</p>
          <p><strong>연락처:</strong> {o_reciverPhoNum || '정보 없음'}</p>
          <p><strong>결제 금액:</strong> {o_totalPrice ? `${addComma(Number(o_totalPrice))}원` : '정보 없음'}</p>
          {orderDetails && orderDetails.map((detail, index) => (
            <p key={index}><strong>옵션 번호:</strong> {detail.odno || '정보 없음'}</p>
          ))}
        </div>

        <div className={styles.actionButtons}>
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
          <p>문제가 있으면 고객센터로 문의해주세요.</p>
          <p className={styles.supportContact}>고객센터: 1234-5678</p>
          <p className={styles.supportHours}>운영시간: 평일 09:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleteComponent;