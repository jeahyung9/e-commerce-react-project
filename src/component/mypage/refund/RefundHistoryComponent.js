import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RefundHistoryComponent.module.css';
import { fetchRefunds } from '../../../api/paymentApi';
import classNames from 'classnames';

const RefundHistoryComponent = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, pending, completed, rejected
  const [sortBy, setSortBy] = useState('requestDate'); // requestDate, amount
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  useEffect(() => {
    const loadRefunds = async () => {
      try {
        setLoading(true);
        const data = await fetchRefunds(currentPage, filter, sortBy, sortDirection);
        setRefunds(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRefunds();
  }, [currentPage, filter, sortBy, sortDirection]);

  const handleRefundClick = (orderId) => {
    navigate(`/payment/orders/${orderId}`);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusBadgePending;
      case 'COMPLETED':
        return styles.statusBadgeSuccess;
      case 'REJECTED':
        return styles.statusBadgeRejected;
      default:
        return styles.statusBadge;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.refundHistoryContainer}>
      {loading && refunds.length === 0 ? (
        <div className={styles.loadingSpinner}>로딩 중...</div>
      ) : error ? (
        <div className={styles.errorMessage}>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.refundHistoryHeader}>
            <h2>환불 내역</h2>
            <p>환불 신청 및 처리 현황을 확인할 수 있습니다.</p>
          </div>
  
          <div className={styles.refundHistoryControls}>
            <div className={styles.filterButtons}>
              <button
                className={classNames(styles.filterButton, {
                  [filter === "all"]: styles.active,
                })}
                onClick={() => handleFilterChange("all")}
              >
                전체
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [filter === "PENDING"]: styles.active,
                })}
                onClick={() => handleFilterChange("PENDING")}
              >
                처리중
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [filter === "COMPLETED"]: styles.active,
                })}
                onClick={() => handleFilterChange("COMPLETED")}
              >
                완료
              </button>
              <button
                className={classNames(styles.filterButton, {
                  [filter === "REJECTED"]: styles.active,
                })}
                onClick={() => handleFilterChange("REJECTED")}
              >
                거절
              </button>
            </div>
          </div>
  
          <div className={styles.refundHistoryTable}>
            <table>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th onClick={() => handleSort("requestDate")}>
                    신청일시
                    {sortBy === "requestDate" && (
                      <span
                        className={classNames(
                          styles.sortArrow,
                          styles[sortDirection]
                        )}
                      >
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>상품정보</th>
                  <th onClick={() => handleSort("amount")}>
                    환불금액
                    {sortBy === "amount" && (
                      <span
                        className={classNames(
                          styles.sortArrow,
                          styles[sortDirection]
                        )}
                      >
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>처리상태</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr
                    key={refund.refundId}
                    onClick={() => handleRefundClick(refund.orderId)}
                    className={styles.refundRow}
                  >
                    <td>{refund.orderId}</td>
                    <td>{formatDate(refund.requestDate)}</td>
                    <td>
                      <div className={styles.productInfo}>{refund.productName}</div>
                    </td>
                    <td className={styles.amount}>
                      {refund.amount.toLocaleString()}원
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(refund.status)}>
                        {refund.status === "PENDING" && "처리중"}
                        {refund.status === "COMPLETED" && "완료"}
                        {refund.status === "REJECTED" && "거절"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {refunds.length === 0 && (
            <div className={styles.noRefunds}>
              <p>환불 내역이 없습니다.</p>
            </div>
          )}
  
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span className={styles.pageInfo}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RefundHistoryComponent;