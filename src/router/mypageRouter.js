import OrderListComponent from "../component/mypage/order/OrderListComponent"
import OrderDetailComponent from "../component/mypage/order/OrderDetailComponent"
import MyReviewComponent from "../component/mypage/review/MyReviewComponent"
import PaymentMethodComponent from "../component/mypage/payment/PaymentMethodComponent"
import RefundHistoryComponent from "../component/mypage/refund/RefundHistoryComponent"
import WishListComponent from "../component/mypage/wishlist/WishListComponent"
import MyPage from "../page/mypage/MyPage"
import AddrComponent from "../component/mypage/addr/AddrComponent"
import MyQAComponent from "../component/mypage/qa/MyQAComponent"
import { InfoComponent } from "../component/mypage/info/InfoComponent"
import ModifyComponent from "../component/mypage/info/ModifyComponent"
import { Navigate } from "react-router-dom"

export const mypageRouter = () => {
    return[
        {
            path: '',
            element: <MyPage />,
            children: [
                {
                    path: "",
                    element: <Navigate replace to="order" />
                },
                {
                    path: "order",
                    children: [
                        {
                            path: '',
                            element: <OrderListComponent />,
                        },
                        {
                            path: ':ono',
                            element: <OrderDetailComponent />
                        },
                    ],
                },
                {
                    path: "wishlist",
                    element: <WishListComponent />,
                },
                {
                    path: "payment-method",
                    element: <PaymentMethodComponent />,
                },
                {
                    path: "refund",
                    element: <RefundHistoryComponent />,
                },
                {
                    path: "review",
                    element: <MyReviewComponent/>,
                },
                {
                    path: "qa",
                    element: <MyQAComponent/>,
                },
                {
                    path: "addr",
                    element: <AddrComponent />
                },
                {
                    path: "info",
                    children: [
                        {
                            path: "",
                            element: <InfoComponent />
                        },
                        {
                            path: "modify",
                            element: <ModifyComponent />,
                        },
                    ]
                },
            ]
        },
    ]
}