import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { snsLogin } from "../../slice/LoginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getMemberWithAccessTokenNaver, getNaverToken } from "../../api/NaverApi";

const NaverRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('code');
  console.log("authcode : " + authCode);
  const receivedState = searchParams.get("state");
  console.log("Received state : " + receivedState)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("searchParams:", searchParams);
  console.log("authCode:", authCode);

  useEffect(()=>{
    console.log("호출됨?");
    console.log("authcode : " + authCode);

    getNaverToken(authCode).then(data => {
      console.log(data);
      
      getMemberWithAccessTokenNaver(data.access_token).then(memberInfo => {
        dispatch(snsLogin(memberInfo));

        if(memberInfo && !memberInfo.formSns){
          navigate('/', { replace: true });
        }else{
          navigate('/member/modify', { replace: true });
        }
      })
      
    })
}, []);

  return (
    <div>
    </div>
  );
};

export default NaverRedirectPage;