import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from '../hooks/ScrollToTop';
import MainPage from '../page/main/MainPage';
import BasicLayout from "../layouts/basicLayout/BasicLayout";
import { cartRouter } from "./cartRouter";
import { mypageRouter } from "./mypageRouter";
import memberRouter from "./memberRouter";
import boardRouter from "./boardRouter";
import productRouter from "./productRouter";
import adminRouter from "./adminRouter";
import paymentRouter from "./paymentRouter";
import sellerRouter from "./sellerRouter";

export const root = createBrowserRouter([
    {
        path: '',
        element: (
          <>
            <ScrollToTop />
            <BasicLayout />
          </>
        ),
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: 'product',
            children: productRouter(),
          },
          {
            path: 'cart',
            children: cartRouter(),
          },
          {
            path: 'mypage',
            children: mypageRouter(),
          },
          {
            path: 'payment',
            children: paymentRouter(),
          },
          {
            path: 'board',
            children: boardRouter(),
          },
          {
            path: 'member',
            children: memberRouter(),
          },
        ],
      },
      {
        path: "admin",
        children: adminRouter(),
      },
      {
        path: "seller",
        children: sellerRouter(),
      },
    
]);