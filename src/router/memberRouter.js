import GoogleLoginComponent from "../component/member/GoogleLoginComponent";
import GoogleRedirectPage from "../component/member/GoogleRedirectPage";
import KakaoRedirectPage from "../component/member/KakaoRedirectpage";
import NaverRedirectPage from "../component/member/NaverRedirectpage";
import JoinPage from "../page/member/JoinPage";
import KakaoPage from "../page/member/KakaoPage";
import LoginPage from "../page/member/LoginPage";
import NaverPage from "../page/member/NaverPage";

const memberRouter = () => {
  return [
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'join',
      element: <JoinPage />,
    },
    {
      path: 'kakao/suc',
      element: <KakaoRedirectPage />,
    },
    {
      path: 'naver/suc',
      element: <NaverRedirectPage />,
    },
    {
      path: 'google/suc',
      element: <GoogleRedirectPage />,
    }
  ];
};

export default memberRouter;