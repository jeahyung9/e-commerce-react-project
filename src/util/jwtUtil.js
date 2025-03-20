import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/hostAPI";

/*
 *  Axios 의 인터셉터 : 서버에 요청/응답시에 추가적인 작업을 수행 할 수 있는 기능의 메서드 객체
이를 통해서 쿠키로 보관된 Access Token 값을 처리하는 작업이나, 자동으로 Refresh Token 을 사용하는 처리를 할 수 있음. 
 */

const jwtAxios = axios.create();

//JWT Token 을 갱신할 수 있는 기능 정의.
//갱신을 수행하는 서버 API 에 토큰과 리프레쉬 토큰을 같이 보냄.

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;

  const header = {headers:{
    "Authorization":`Bearer ${accessToken}`,
  },
};

const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`);

console.log("...............................토큰 갱신.............................");
console.log(res.data);

return res.data;
};

//요청시 처리 함수 정의
const beforeReq = (config) => {
  //console.log('요청 전 처리 함수...');

  //요청을 처리하기 전에, 쿠키를 얻어내고, Authorization 헤더를 구성하고, 추가해서 요청을 보내고,
  //만약 쿠키가 없다면, 그냥 예외를 발생시킴.
  let memberInfo = null;
  if(getCookie("member")){
    memberInfo = getCookie('member');
  }else if(getCookie("admin")){
    memberInfo = getCookie('admin');
  }else{
    memberInfo = getCookie("seller");
  }
  // if (!memberInfo) {
  //   console.log('Member Not Founded');
  //   return Promise.reject({
  //     response: {
  //       data: { err: 'REQUIRED_LOGIN' },
  //     },
  //   });
  // }
  const accessToken = memberInfo.accessToken;

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

//요청 실패 시 처리 함수
const requestFail = (err) => {
  console.log('요청 실패 처리 함수...');

  return Promise.reject(err);
};

//응답 전 처리 함수
const befeoreRes = async (res) => {
  //console.log('응답 전 처리 함수' + res.data);
  
  const data = res.data;
  if (data && data.error === 'ERROR_TOKEN_ACCESS') {
    const memberCookieValue = null;
    
    if(getCookie("member")){
      memberCookieValue = getCookie('member');
    }else if(getCookie("admin")){
      memberCookieValue = getCookie('admin');
    }else{
      memberCookieValue = getCookie("seller");
    }

    // Refresh Token을 사용하여 새로운 Access Token 요청
    console.log(memberCookieValue);
    const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken);
    console.log("RefreshJWT Result -------->", result);

    // 쿠키에 새로운 토큰 정보 저장
    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;
    //setCookie('member', JSON.stringify(memberCookieValue), 1);

    // 재요청을 위한 기존 요청 헤더에 새로운 Access Token 삽입
    const originalRequest = res.config;
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    // 토큰 갱신 후 재요청
    return axios(originalRequest);
  }

  return res;
};

//응답 오류 처리 함수
const resonseFail = (err) => {
  console.log('응답 오류 처리 함수');
  return Promise.reject(err);
};

//interceptor 객체를 통한 요청/응답 처리
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(befeoreRes, resonseFail);

export default jwtAxios;