import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RefundModal from './RefundModal';
import styles from './PaymentHistoryComponent.module.css';
import classNames from 'classnames';
import { fetchOrderDetails, requestRefund } from '../../api/paymentApi';
import { addComma } from '../../hooks/useCustomString';

const OrderDetailComponent = () => {
  const navigate = useNavigate();
  const { ono } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderDetails(ono);
        console.log("Order details:", data); // 데이터 구조 확인을 위한 콘솔 로그
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [ono]);

  const handleRefundRequest = async (refundReason) => {
    setLoading(true);
    try {
      console.log("Refund request data:", refundReason);
      const result = await requestRefund(ono, refundReason);
      console.log("Refund response:", result);

      setShowRefundModal(false);
      setRefundReason('');
      const updatedOrderDetails = await fetchOrderDetails(ono);
      setOrderDetails(updatedOrderDetails);
      alert('환불이 요청되었습니다.');
    } catch (err) {
      console.error("Refund request error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // imp_uid와 merchant_uid를 첫 번째 주문 상세 정보에서 추출
  const impUid = orderDetails.length > 0 ? orderDetails[0].imp_uid : '';
  const merchantUid = orderDetails.length > 0 ? orderDetails[0].merchant_uid : '';

  if (loading) {
    return <div className={styles.loading}>주문 정보를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/payment/orders')}>
          주문 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!orderDetails.length) {
    return (
      <div className={styles.errorContainer}>
        <h3>주문 정보를 찾을 수 없습니다</h3>
        <button onClick={() => navigate('/payment/orders')}>
          주문 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailContainer}>
      <div className={styles.orderHeader}>
        <h2>주문 상세 정보</h2>
      </div>
      {orderDetails.map((detail, index) => (
        <div key={index} className={styles.orderInfoCard}>
          <div className={styles.orderInfo}>
            <span className={styles.orderNumber}>주문번호: {detail.ono}</span>
            <span className={styles.orderDate}>주문 상세 번호: {detail.orno}</span>
            <span className={classNames(styles.orderStatus, { [styles.reviewed]: detail.review_flag, [styles.notReviewed]: !detail.review_flag })}>
              {detail.review_flag ? '리뷰 완료' : '리뷰 미완료'}
            </span>
          </div>
          <div className={styles.orderSection}>
            <h3>상품 정보</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>수량</label>
                <span>{detail.or_count}</span>
              </div>
              <div className={styles.infoItem}>
                <label>가격</label>
                <span className={styles.price}>{addComma(detail.or_price)}원</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className={styles.orderActions}>
        <button 
          onClick={() => navigate('/payment/orders')} 
          className={styles.backButton}
        >
          주문 목록으로
        </button>
        {orderDetails.some(detail => !detail.review_flag) && (
          <button 
            onClick={() => setShowRefundModal(true)} 
            className={styles.refundButton}
          >
            환불 요청
          </button>
        )}
      </div>

      <RefundModal
        show={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setRefundReason('');
        }}
        onConfirm={handleRefundRequest}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        loading={loading}
        impUid={impUid} // imp_uid 전달
        merchantUid={merchantUid} // merchant_uid 전달
      />
    </div>
  );
};

export default OrderDetailComponent;