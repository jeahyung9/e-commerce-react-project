import axios from 'axios';
import { API_SERVER_HOST } from './hostAPI';

const rest_api_key = `4c3b4dda36d074948c1a27348094a15d`;
const redirect_uri = `https://localhost:3000/member/kakao/suc`;
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
const access_token_url = `https://kauth.kakao.com/oauth/token`;
const host = `${API_SERVER_HOST}/member`;

export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&scope=account_email`;
  console.log("콘솔체크 kakaoApi", kakaoURL);
  return kakaoURL;
};

export const getAccessToken = async (authCode) => {
  console.log("호출됨?");

  if (!authCode) {
    console.error("authCode가 없습니다!");
    return;
  }
  
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    
  };  
  console.log("authCode:", authCode);

  const body = {
    grant_type: 'authorization_code',
    client_id: rest_api_key,
    redirect_uri: redirect_uri,
    code: authCode
  };

  try{
  const res = await axios.post(access_token_url, body, header);
  const accessToken = res.data.access_token;
  return accessToken;
}catch (error){
  console.error("액세스 토큰 가져오기 실패 : ", error.response.data);
  throw error;
}
};


export const getMemberWithAccessToken = async (accessToken) => {
  console.log("kakaoAPI");
  console.log('서버로 전달되는 accessToken: ', accessToken);
  const res = await axios.get(
    `${API_SERVER_HOST}/api/member/kakao/suc/${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
}