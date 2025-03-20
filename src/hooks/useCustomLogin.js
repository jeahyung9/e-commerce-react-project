import { createSearchParams, Navigate, useNavigate } from "react-router-dom";
import { adminLogin, adminLogout, login, loginPostAsynch, logout, sellerLogin, sellerLogout } from "../slice/LoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.LoginSlice);
  const isLogin = loginState && Object.keys(loginState).length > 0 ? true : false;
  const [ member, setMember ] = useState([]);

  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsynch(loginParam));
    dispatch(login(loginParam));
    navigate(-1);
    return action.payload;
  };

  const doAdminLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsynch(loginParam));
    dispatch(adminLogin(loginParam));
    navigate('/admin');
    return action.payload;
  };

  const doSellerLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsynch(loginParam));
    dispatch(sellerLogin(loginParam));
    navigate('/seller');
    return action.payload;
  };

  const doLogout = () => {
    dispatch(logout());
  };
  const doAdminLogout = () => {
    dispatch(adminLogout());
  };
  const doSellerLogout = () => {
    dispatch(sellerLogout());
  };

  const moveToPath = (path) => {
    navigate(path, { replace: true });  // navigate 수정
  };
  const moveToLogin = () => {
    navigate('/member/login', { replace: true });  // navigate 수정
  };
  const moveToLoginReturn = () => {
    return <Navigate replace to="/member/login" />;  // 여기서는 <Navigate />를 그대로 사용
  };

  const exceptionHandle = (e) => {
    console.log('인증 에러..');
    console.log(e);

    const errMsg = e.response.data.err;
    console.log(e);
    const errStr = createSearchParams({ error: errMsg }).toString();

    if (errMsg === 'REQUIRED_LOGIN') {
      console.log('gggggg');
      alert('로그인이 필요합니다.');
      navigate({ pathname: '/member/login', search: errStr });
      return;
    }
    if (errMsg === 'ERROR_TOKEN_ACCESS') {
      console.log('GGGGG');
    }
    if (errMsg === 'ERROR_ACCESS_DENIED') {
      alert('해당 메뉼 사용할 수 있는 권한이 없음.');
      navigate({ pathname: '/member/login', search: errStr });
      return;
    }
  };

  return {
    member,
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
    doAdminLogin,
    doSellerLogin,
    doAdminLogout,
    doSellerLogout,
  };
};
export default useCustomLogin;