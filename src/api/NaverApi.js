import axios from 'axios';
import { API_SERVER_HOST } from './hostAPI';
import qs from 'qs';

const client_id = 'UwTwxxopvCbJN7NMCtn6';
const redirect_uri =  process.env.REACT_APP_SNS_REDIRECT_IP + '/member/naver/suc';
const auth_code_path = 'https://nid.naver.com/oauth2.0/authorize';
const access_token_url = 'https://nid.naver.com/oauth2.0/token';
const client_secret = 'vFo6vebdiX';
const state = "cors";
const host = `${API_SERVER_HOST}/api/member`;

const generateState = () => {
  return Math.random().toString(36).substring(2);
};

export const getNaverLoginLink = () => {
  const state = generateState();
  const naverURL = `${auth_code_path}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`;
  return naverURL;
};

export const getNaverToken = async (authCode) => {
  const res = await axios.post(`${host}/naver/token/${authCode}`, 
    { headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },}
  );
  return res.data;
};

// export const getAccessTokenNaver = async (authCode) => {
//   if (!authCode) {
//     console.log("authCode가 없습니다!");
//     return;
//   }

//   // 'qs' 라이브러리로 데이터를 urlencoded 형식으로 변환
//   const body = qs.stringify({
//     grant_type: 'authorization_code',
//     client_id: client_id,
//     client_secret: client_secret,
//     redirect_uri: redirect_uri,
//     code: authCode,
//     state: generateState(), // 여기서 state 값도 새로 생성
//   });

//   const header = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded', // 요청 헤더 수정
//     },
//   };

//   try {
//     // 네이버 액세스 토큰 요청
//     console.log("네이버 액세스 토큰 요청...");
//     const res = await axios.post('https://nid.naver.com/oauth2.0/token', body, header);

//     console.log("Response status:", res.status); // 응답 상태 코드 확인
//     console.log("Response data:", res.data);    // 응답 데이터 확인

//     // 액세스 토큰이 정상적으로 반환되었는지 확인
//     if (res.status === 200 && res.data.access_token) {
//       const accessToken = res.data.access_token;
//       console.log("Access token:", accessToken);
//       return accessToken;
//     } else {
//       console.error("액세스 토큰을 받을 수 없습니다.");
//       return;
//     }
//   } catch (error) {
//     console.error("액세스 토큰 가져오기 실패 : ", error.response?.data || error.message);
//     throw error;
//   }
// };

export const getMemberWithAccessTokenNaver = async (accessToken) => {
  if (!accessToken) {
    console.log("유효한 accessToken이 없습니다.");
    return;
  }

  // console.log("NaverAPI");
  // console.log('서버로 전달되는 accessToken : ', accessToken);

  try {
    const res = await axios.get(
      `${API_SERVER_HOST}/api/member/naver/suc/${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    //console.log("서버 응답 : " + JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error("네이버 API 호출 실패 : ", error);
  }
};