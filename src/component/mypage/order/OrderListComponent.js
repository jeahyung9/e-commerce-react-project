import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OrderListComponent.module.css';
import { fetchUserOrders } from '../../../api/paymentApi';
import { addComma } from '../../../hooks/useCustomString';
import useCustomLogin from '../../../hooks/useCustomLogin';
import Spinner from '../../spinner/spinner';
import classNames from 'classnames';
import { API_SERVER_HOST } from "../../../api/hostAPI";

const OrderListComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, loginState } = useCustomLogin();
  const [orders, setOrders] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // 로그인된 사용자의 mno를 가져옵니다.
  const mno = location.state?.mno || loginState?.mno;
  console.log("User mno:", mno); // 디버깅 로그 추가

  useEffect(() => {
    
    if (mno) {
      const loadOrders = async () => {
        try {
          setLoading(true);
          const data = await fetchUserOrders(mno);
          console.log("Orders data:", data); // 디버깅 로그 추가
          data.forEach(order => {
            console.log("Order details:", order.orderDetails); // 주문 상세 정보 출력
          });
          setOrders(data || []);
          setSortedOrders(data || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError(err.message);
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    } else {
      setError("사용자 정보를 불러올 수 없습니다.");
    }
  }, [isLogin, mno, navigate]);

  const handleOrderClick = (ono) => {
    console.log(`Navigating to order: ${ono}`); // 디버깅 로그 추가
    navigate(`/mypage/order/${ono}`, { state: { mno } });
  };

  const sortOrders = (key, direction) => {
    console.log(`Sorting orders by: ${key}, direction: ${direction}`); // 디버깅 로그 추가
    setSortConfig({ key, direction });

    const sorted = [...orders].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortedOrders(sorted);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className={styles.orderListContainer}>
        <div className={styles.loading}>
          <Spinner />
          <p>주문 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.orderListContainer}>
        <div className={styles.errorMessage}>
          <p>오류가 발생했습니다</p>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
            }} 
            className={styles.retryButton}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderListContainer}>
      <div className={styles.orderListHeader}>
        <h2>주문 내역</h2>
        <p>최근 주문하신 내역을 확인하실 수 있습니다.</p>
      </div>
      <div className={styles.orderSort}>
        <button
          className={classNames(styles.sortBtn, {[styles.active]: sortConfig.direction === 'descending'})}
          onClick={() => sortOrders('orderDate', 'descending')}
        >
          최근순
        </button>
        <button
          className={classNames(styles.sortBtn, {[styles.active]: sortConfig.direction === 'ascending'})}
          onClick={() => sortOrders('orderDate', 'ascending')}
        >
          과거순
        </button>
      </div>
      <div className={styles.orderList}>
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div key={order.ono} onClick={() => handleOrderClick(order.ono)} className={styles.orderCard}>
              <div className={styles.orderLeft}>
                {order.orderDetails[0].productImage?.length > 0 ? (
                  <div className={styles.imgWrap}>
                    <img src={`${API_SERVER_HOST}/${order.orderDetails[0].productImage[0]?.pi_name}`} alt="상품 이미지" />
                  </div>
                ) : (
                  <div className={styles.noImg}>이미지 없음</div>
                )}
                <div className={styles.orderText}>
                  <p className={styles.optionName}>{order.orderDetails[0].od_name}</p>
                  <p className={styles.productName}>{order.orderDetails[0].p_name}</p>
                  {order.orderDetails?.length > 1 &&
                    <p className={styles.productCnt}>외 {order.orderDetails?.length - 1}개</p>
                  }
                  <p className={styles.orderDate}>{new Date(order.orderDate).toLocaleString()} 주문됨</p>
                </div>
              </div>
              <div className={classNames(styles.orderRight, styles.orderText)}>
                <p className={styles.productPrice}>{addComma(order.o_totalPrice)}원</p>
                <p className={styles.paidStatus}>
                  {{
                    "ORDER_COMPLETE": "결제완료",
                    "CANCEL": "취소됨"
                  }[order.status] || null}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noOrder}>주문 내역이 없습니다.</div>
        )
        }
      </div>
      <div className={styles.pagination}>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          이전
        </button>
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={indexOfLastOrder >= sortedOrders.length}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OrderListComponent;