import React, { useState, useEffect } from 'react';
import { fetchAllOrders, fetchUserOrders, approveRefund } from '../../api/paymentApi';
import styles from './SellerOrderListPage.module.css';

const SellerOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterMember, setFilterMember] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'ono', direction: 'ascending' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      console.log("Fetched orders:", data);
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    applyFilters(status, filterMember);
  };

  const handleMemberFilterChange = async (e) => {
    const memberNumber = e.target.value;
    setFilterMember(memberNumber);
    if (memberNumber) {
      try {
        const data = await fetchUserOrders(memberNumber);
        setFilteredOrders(data);
      } catch (err) {
        setError(err.message);
      }
    } else {
      applyFilters(filterStatus, '');
    }
  };

  const applyFilters = (status, memberNumber) => {
    let filtered = orders;
    if (status !== 'ALL') {
      filtered = filtered.filter(order => order.status === status);
    }
    if (memberNumber) {
      filtered = filtered.filter(order => order.mno.toString() === memberNumber);
    }
    setFilteredOrders(filtered);
  };

  const sortOrders = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredOrders(sorted);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  const handleApproveRefund = async (rfno) => {
    console.log("환불 승인 시도 - rfno:", rfno);
    
    if (!rfno) {
      console.error("유효하지 않은 환불 번호");
      alert('유효하지 않은 환불 번호입니다.');
      return;
    }

    try {
      setLoading(true);
      console.log("환불 승인 API 호출 시작");
      const result = await approveRefund(rfno);
      console.log("환불 승인 결과:", result);
      alert(result);
      
      console.log("주문 목록 새로고침 시작");
      await loadOrders();
    } catch (err) {
      console.error("환불 승인 처리 중 오류:", err);
      alert(`환불 승인 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loadingSpinner}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.orderListContainer}>
      <div className={styles.orderListHeader}>
        <h2>판매자 주문 목록</h2>
        <p>주문 내역을 확인하세요.</p>
      </div>

      <div className={styles.filterContainer}>
        <label htmlFor="statusFilter">결제 상태 필터: </label>
        <select id="statusFilter" value={filterStatus} onChange={handleStatusFilterChange}>
          <option value="ALL">전체</option>
          <option value="ORDER_COMPLETE">결제 완료 - 환불 대기</option>
          <option value="CANCEL">환불 완료</option>
        </select>

        <label htmlFor="memberFilter">회원 번호 필터: </label>
        <input
          id="memberFilter"
          type="text"
          value={filterMember}
          onChange={handleMemberFilterChange}
          placeholder="회원 번호 입력"
        />
      </div>

      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th onClick={() => sortOrders('ono')}>주문번호 {getSortArrow('ono')}</th>
            <th onClick={() => sortOrders('orderDate')}>주문일시 {getSortArrow('orderDate')}</th>
            <th onClick={() => sortOrders('o_totalPrice')}>총금액 {getSortArrow('o_totalPrice')}</th>
            <th onClick={() => sortOrders('status')}>결제상태 {getSortArrow('status')}</th>
            <th onClick={() => sortOrders('mno')}>회원번호 {getSortArrow('mno')}</th>
            <th>배송지</th>
            <th>수령인</th>
            <th>수령인 전화번호</th>
            <th>환불 승인</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <tr key={order.ono}>
                <td>{order.ono}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.o_totalPrice.toLocaleString()}원</td>
                <td>{order.status}</td>
                <td>{order.mno}</td>
                <td>{order.o_address}</td>
                <td>{order.o_reciver}</td>
                <td>{order.o_reciverPhoNum}</td>
                <td>
                  <button
                    onClick={() => {
                      if (order.refundDTO && order.refundDTO.rfno) {
                        console.log("환불 승인 버튼 클릭 - 주문:", order);
                        console.log("환불 정보:", order.refundDTO);
                        handleApproveRefund(order.refundDTO.rfno);
                      } else {
                        console.log("환불 정보 없음 - 주문:", order);
                        alert('환불 정보가 없습니다.');
                      }
                    }}
                    disabled={order.status === 'CANCEL' || order.status === 'REFUND_COMPLETE'} // 상태가 CANCEL이거나 환불 승인된 경우 비활성화
                    className={order.status === 'CANCEL' || order.status === 'REFUND_COMPLETE' ? styles.disabledButton : styles.approveButton}
                  >
                    {order.status === 'CANCEL' ? '환불 완료' : '환불 승인'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className={styles.noOrders}>주문 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SellerOrderListPage;