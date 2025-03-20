// src/router/paymentRouter.js

import { Navigate } from 'react-router-dom';
import PaymentForm from '../component/payment/PaymentForm';
import PaymentCompleteComponent from '../component/payment/PaymentCompleteComponent';
import PaymentFailComponent from '../component/payment/PaymentFailComponent';

/**
 * 결제 관련 라우터 설정
 * 
 * 라우트 구조:
 * /payment/
 * ├── form                - 결제 진행 페이지
 * ├── orders             - 전체 주문 목록
 * ├── orders/:ono        - 개별 주문 상세 정보
 * ├── refund/history     - 환불 내역 목록
 * ├── complete/:ono      - 결제 완료 페이지
 * ├── fail               - 결제 실패 페이지
 * └── (기본 경로)         - form으로 자동 리다이렉트
 */

const paymentRouter = () => {
  return [
    {
      path: 'form',
      element: <PaymentForm />,
    },
    {
      path: 'complete/:ono',
      element: <PaymentCompleteComponent />,
    },
    {
      path: 'fail',
      element: <PaymentFailComponent />,
    },
    {
      path: '',
      element: <Navigate replace to={'form'} />,
    }
  ];
};

export default paymentRouter;