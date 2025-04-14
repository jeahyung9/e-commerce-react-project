import { useNavigate } from 'react-router-dom';
import LoginComponent from '../../component/member/LoginComponent';
import useCustomLogin from '../../hooks/useCustomLogin';
import { useEffect } from 'react';

const LoginPage = () => {
  const { isLogin } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    //console.log(isLogin);
    
    if(isLogin){
      alert("로그인 중");
      navigate(-1);
    }
  }, []);

  return (
      <div>
        <LoginComponent />
      </div>
  );
};
export default LoginPage;