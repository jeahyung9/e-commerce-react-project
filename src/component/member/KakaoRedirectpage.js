import { useEffect } from "react";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { snsLogin } from "../../slice/LoginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "../member/KakaoLoginComponent";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('code');
  // const authCode = useParams("code");
  console.log("authcode : " + authCode);
  const dispatch = useDispatch();
  const { moveTopath } = useCustomLogin();
  const navigate = useNavigate();
  console.log("searchParams:", searchParams);
  console.log("authCode:", authCode);

  useEffect(()=>{
    console.log("authcode : " + authCode);
    getAccessToken(authCode).then((access_token) => {
      console.log("+++++++++++++++++++++++++++++++++ " + access_token);

      // if (authCode) {
      //   getAccessToken(authCode).then((access_token) => {
      //     console.log('---------------------------------------------acc코드 ' + access_token);
      //     // 이하 생략
      //   }).catch(error => { 
      //     console.error('액세스 토큰 가져오기 실패 : ', error);
      //   });
      // }

      getMemberWithAccessToken(access_token).then((memberInfo) => {
        console.log('------------------------' + JSON.stringify(memberInfo));

        dispatch(snsLogin(memberInfo));

        if(memberInfo && !memberInfo.formSns){
          navigate('/', { replace: true });
        }else{
          navigate('/member/modify', { replace: true });
        }
      }).catch(error => {
        console.error('회원 정보 가져오기 실패 : ', error);
      });
    });
}, []);

  return (
    <div>
    </div>
  );
};

export default KakaoRedirectPage;