import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getGoogleAccessToken, getMemberWithAccessToken } from '../../api/GoogleApi';
import { snsLogin } from '../../slice/LoginSlice';

const GoogleRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('code'); // URL에서 'code' 파라미터 추출
  const dispatch = useDispatch();
  const { moveToPath } = useCustomLogin();

  useEffect(() => {
    if (authCode) {
      getGoogleAccessToken(authCode).then((access_token) => {
        console.log('구글 액세스 토큰:', access_token);

        getMemberWithAccessToken(access_token).then((memberInfo) => {
          console.log('회원 정보:', memberInfo);

          dispatch(snsLogin(memberInfo));

          // 소셜 회원 여부에 따른 페이지 이동
          if (memberInfo && !memberInfo.formSns) {
            moveToPath('/', { replace: true }); // 소셜 로그인 회원이 아니면 홈으로
          } else {
            moveToPath('/member/modify', { replace: true }); // 소셜 로그인 회원이면 회원 수정 페이지로
          }
        });
      }).catch((error) => {
        console.error('구글 로그인 처리 중 오류 발생:', error);
      });
    }
  }, []);

  return (
    <div>
    </div>
  );
};
export default GoogleRedirectPage;
