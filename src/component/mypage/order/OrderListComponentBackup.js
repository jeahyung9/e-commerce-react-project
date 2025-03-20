import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OrderListComponent.module.css';
import { fetchUserOrders } from '../../../api/paymentApi';
import { addComma } from '../../../hooks/useCustomString';
import useCustomLogin from '../../../hooks/useCustomLogin';
import { Button } from '@mui/material';
import { ArrowUpwardRounded, ArrowDownwardRounded } from '@mui/icons-material';
import Spinner from '../../spinner/spinner';

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

  const sortOrders = (key) => {
    console.log(`Sorting orders by: ${key}`); // 디버깅 로그 추가
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
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

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ArrowUpwardRounded /> : <ArrowDownwardRounded />;
    }
    return '';
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
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th onClick={() => sortOrders('ono')}>주문번호 {getSortArrow('ono')}</th>
            <th className={styles.date} onClick={() => sortOrders('orderDate')}>주문일시 {getSortArrow('orderDate')}</th>
            <th onClick={() => sortOrders('o_totalPrice')}>총금액 {getSortArrow('o_totalPrice')}</th>
            <th onClick={() => sortOrders('status')}>결제상태 {getSortArrow('status')}</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.ono} onClick={() => handleOrderClick(order.ono)}>
                <td>{order.ono}</td>
                <td className={styles.date}>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{addComma(order.o_totalPrice)}원</td>
                <td>
                  {
                    {
                      "ORDER_COMPLETE": "결제완료",
                      "CANCEL": "취소됨"
                    }[order.status] || null
                  }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noOrders}>주문 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

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