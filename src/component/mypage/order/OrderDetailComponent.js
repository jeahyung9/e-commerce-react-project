import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import RefundModal from './RefundModal';
import styles from './OrderDetailComponent.module.css';
import { fetchOrderDetails, requestRefund, fetchPaymentByOrderNumber } from '../../../api/paymentApi';
import { addComma } from '../../../hooks/useCustomString';
import classNames from 'classnames';
import { API_SERVER_HOST } from "../../../api/hostAPI";
import Spinner from '../../spinner/spinner';

const OrderDetailComponent = () => {
  const navigate = useNavigate();
  const { ono } = useParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [imp_uid, setImpUid] = useState('');
  const [merchant_uid, setMerchantUid] = useState('');

  const mno = location.state?.mno;

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching order details for ono:", ono); // 디버깅 로그 추가
        const orderData = await fetchOrderDetails(ono);
        console.log("Order details:", orderData); // 응답 데이터 구조 확인
        setOrderDetails(orderData);

        const paymentData = await fetchPaymentByOrderNumber(ono);
        console.log("Payment", paymentData);
        setImpUid(paymentData.imp_uid || ''); // 수정된 부분
        setMerchantUid(paymentData.merchant_uid || ''); // 수정된 부분

      } catch (err) {
        console.error("Error fetching order or payment details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [ono, mno]);

  const handleRefundRequest = async (refundReason) => {
    setLoading(true);
    try {
      console.log("Refund request data:", refundReason, imp_uid, merchant_uid); // 수정된 부분
      const result = await requestRefund(ono, refundReason, imp_uid, merchant_uid); // 수정된 부분
      console.log("Refund response:", result);

      if (result && typeof result === 'object') {
        setShowRefundModal(false);
        setRefundReason('');
        alert('환불 요청이 접수되었습니다. 환불이 완료되기까지 시간이 걸릴 수 있습니다.');
        navigate('/mypage/order', { state: { mno } }); // 환불 요청 후 목록으로 이동
      } else {
        alert('환불 요청에 실패했습니다. 응답이 비어 있거나 잘못되었습니다.');
      }
    } catch (err) {
      console.error("Refund request error:", err);
      alert('환불 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className={styles.loadingSpinner}>
  //       <div className={styles.spinner}></div>
  //       <p>주문 정보를 불러오는 중...</p>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner />
        <p>주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/mypage/order', { state: { mno } })}>
          주문 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!orderDetails.length) {
    return (
      <div className={styles.errorContainer}>
        <h3>주문 정보를 찾을 수 없습니다</h3>
        <button onClick={() => navigate('/mypage/order', { state: { mno } })}>
          주문 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailContainer}>
      <div className={styles.orderHeader}>
        <h2>주문 상세</h2>
        <p>최근 주문하신 내역을 확인하실 수 있습니다.</p>
      </div>
      {orderDetails.map((detail, index) => (
        <div key={index} className={styles.orderInfoCard}>
          <div className={styles.orderInfo}>
            {detail.productImage?.length > 0 ?
              <div className={styles.imgWrap} onClick={() => {navigate(`/product/${detail.pno}`)}}>
                <img src={`${API_SERVER_HOST}/${detail.productImage[0]?.pi_name}`} alt="상품 이미지" />
              </div>
            :
              <div className={styles.noImg}>이미지 없음</div>
            }
            <div className={styles.orderText}>
              <p className={styles.optionName}>{detail.od_name}</p>
              <p className={styles.productName}>{detail.p_name}</p>
              <p className={styles.infoItem}>{detail.or_count}개</p>
              <p className={styles.price}>
                <span className={styles.priceNum}>{addComma(detail.or_price)}</span>
                <span>원</span>
              </p>
            </div>
          </div>
          <div className={styles.orderSection}>
          </div>
        </div>
      ))}
      <div className={styles.orderActions}>
        <button 
          onClick={() => navigate('/mypage/order', { state: { mno } })} 
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
      />
    </div>
  );
};

export default OrderDetailComponent;