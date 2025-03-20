import React, { useEffect } from "react";
import JoinComponent from "../../component/member/JoinComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
  const { isLogin } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if(isLogin){
      alert("로그인 중");
      navigate('/');
    }
  }, []);

  return (
    <JoinComponent />
  );
};

export default JoinPage;