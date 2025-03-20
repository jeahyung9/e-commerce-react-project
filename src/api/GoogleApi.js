import axios from 'axios';
import { API_SERVER_HOST } from './hostAPI';
import { GoogleLogin } from '@react-oauth/google';

const client_id = '';
const client_secret = '';
const redirect_uri = 'https://localhost:3000/member/google/suc';
const auth_code_path = 'https://accounts.google.com/o/oauth2/auth';
const access_token_url = 'https://oauth2.googleapis.com/token'; 
const host = `${API_SERVER_HOST}/api/member`;

export const getGoogleLoginLink = () => {
  const googleURL = `${auth_code_path}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email profile`;
  return googleURL;
};


export const getGoogleAccessToken = async (authCode) => {
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_uri,
    code: authCode,
  });
  console.log("asd");
  
  try {
    console.log("성곤");
    
    const res = await axios.post(access_token_url, params, header);
    return res.data.access_token;
  } catch (error) {
    console.error('Google Access Token 요청 실패:', error);
    throw error;
  }
};

// 서버로 액세스 토큰을 보내는 함수
export const getMemberWithAccessToken = async (accessToken) => {
  console.log('서버로 전달되는 Google AccessToken: ', accessToken);
  try {
    const res = await axios.get(
      `${host}/google/suc/${accessToken}`
    );
    return res.data;
  } catch (error) {
    console.error('서버에서 회원 정보 요청 실패:', error);
    throw error;
  }
};

// Google 로그인 버튼을 렌더링하고, 로그인 후 액세스 토큰을 얻는 컴포넌트
// export const GoogleLoginComponent = () => {
//   const handleGoogleLogin = async (response) => {
//     console.log('Google 로그인 응답:', response);
//     if (response?.credential) {
//       const authCode = response.credential; // Google에서 제공한 인증 코드
//       try {
//         const accessToken = await getGoogleAccessToken(authCode);
//         const memberData = await getMemberWithAccessToken(accessToken);
//         console.log('로그인한 사용자 데이터:', memberData);
//       } catch (error) {
//         console.error('Google 로그인 처리 중 오류 발생:', error);
//       }
//     }
//   };

//   return (
//     <GoogleLogin
//       onSuccess={handleGoogleLogin}
//       onError={() => console.log('Google Login Error')}
//     />
//   );
// };
