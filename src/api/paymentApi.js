const API_BASE_URL = 'http://localhost:8080';

/**
 * 주문 상세 정보 가져오기
 * 사용 파일: OrderDetailPage.js
 */
export const fetchOrderDetails = async (ono) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/order-details/order/${ono}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('주문 상세 정보를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching order details:", err);
    throw err;
  }
};

export const fetchPaymentByOrderNumber = async (ono) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/order/${ono}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('결제 정보를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching payment by order number:", err);
    throw err;
  }
};

export async function requestRefund(ono, refundReason, impUid, merchantUid) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${ono}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rf_reason: refundReason,
        imp_uid: impUid,
        merchant_uid: merchantUid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refund request error:', errorText);
      throw new Error('서버 응답이 올바르지 않습니다.');
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      throw new Error('응답이 비어 있거나 올바르지 않습니다.');
    }
    return data;
  } catch (error) {
    console.error('Refund request error:', error);
    throw error;
  }
}

/**
 * 결제 내역 가져오기
 * 사용 파일: PaymentHistoryPage.js
 */
export const fetchPayments = async (currentPage, filter, searchTerm, dateRange) => {
  try {
    const queryParams = new URLSearchParams({
      page: currentPage - 1,
      size: 10,
      status: filter,
      search: searchTerm,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });

    const response = await fetch(`${API_BASE_URL}/api/payments?${queryParams}`, {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('결제 내역을 불러오는데 실패했습니다.');

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching payments:", err);
    throw err;
  }
};

/**
 * 환불 내역 가져오기
 * 사용 파일: RefundHistoryPage.js
 */
export const fetchRefunds = async (currentPage, filter, sortBy, sortDirection) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/refunds?page=${currentPage-1}&size=10&sort=${sortBy},${sortDirection}&status=${filter}`,
      {
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error('환불 내역을 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching refunds:", err);
    throw err;
  }
};

/**
 * 주문 및 주문상세 저장
 * 사용 파일: PaymentForm.js
 */
export const saveOrder = async (orderData) => {
  try {
    console.log('Order data:', orderData);
    
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        throw new Error(`주문 저장 실패: 서버 응답이 JSON 형식이 아닙니다. 상태 코드: ${response.status}`);
      }
      throw new Error(`주문 저장 실패: ${JSON.stringify(errorData)}`);
    }
    
    let savedOrder;
    try {
      savedOrder = await response.json();
    } catch (jsonError) {
      throw new Error('응답을 JSON으로 파싱하는 데 실패했습니다.');
    }
    
    return savedOrder;
  } catch (err) {
    console.error("Order save error:", err);
    throw err;
  }
};

/**
 * 결제 정보 저장
 * 사용 파일: PaymentForm.js
 */
export const savePayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`결제 저장 실패: ${JSON.stringify(errorData)}`);
    }

    const savedPayment = await response.json();
    return savedPayment;
  } catch (err) {
    console.error("Payment save error:", err);
    throw err;
  }
};

/**
 * 상품 정보 가져오기
 * 사용 파일: PaymentForm.js
 */
export const fetchProductInfo = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('상품 정보를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching product info:", err);
    throw err;
  }
};

//지훈판매자페이지

/**
 * 모든 주문 가져오기
 * 사용 파일: SellerOrderListPage.js
 */
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching all orders:', errorText);
      throw new Error('모든 주문을 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    throw err;
  }
};

/**
 * 회원의 주문 목록 가져오기
 * 사용 파일: OrderListPage.js , SellerOrderListpage.js
 */
export const fetchUserOrders = async (mno) => {
  try {
    console.log("Fetching orders for mno:", mno);
    const response = await fetch(`${API_BASE_URL}/api/orders/member/${mno}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('회원 주문 목록을 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log("Fetched orders data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching user orders:", err);
    throw err;
  }
};

/**
 * 주문 상태별 조회
 * 사용 파일: SellerOrderListPage.js
 */
export const fetchOrdersByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/status?status=${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching orders by status:', errorText);
      throw new Error('주문 상태별 조회에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching orders by status:", err);
    throw err;
  }
};

/**
 * 회원별 주문 상태 조회
 * 사용 파일: SellerOrderListPage.js
 */
export const fetchUserOrdersByStatus = async (mno, status) => {
  try {
    const url = status 
      ? `${API_BASE_URL}/api/orders/user/${mno}/status?status=${status}`
      : `${API_BASE_URL}/api/orders/user/${mno}/status`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching user orders by status:', errorText);
      throw new Error('회원별 주문 상태 조회에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching user orders by status:", err);
    throw err;
  }
};

/**
 * 환불 처리
 * 사용 파일: SellerOrderListPage.js
 */
export const processRefund = async (ono) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${ono}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refund processing error:', errorText);
      throw new Error('환불 처리에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

/**
 * 환불 승인 요청
 * 사용 파일: SellerOrderListPage.js
 */
export const approveRefund = async (rfno) => {
  try {
    console.log(`환불 승인 요청 시작 - rfno: ${rfno}`);
    const response = await fetch(`${API_BASE_URL}/api/refunds/${rfno}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    console.log('서버 응답:', response.status);
    const responseText = await response.text();
    console.log('응답 내용:', responseText);

    if (!response.ok) {
      console.error('환불 승인 에러:', responseText);
      throw new Error(responseText || '환불 승인에 실패했습니다.');
    }

    return responseText;
  } catch (error) {
    console.error('환불 승인 처리 중 오류:', error);
    throw error;
  }
};