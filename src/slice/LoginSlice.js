/*
store 가 App 에서 Context 역할을 담당한다면(모든 컴포넌트가 참조 가능한 전역 상태 데이터 관리 context), 
이를 처리하는 애는 reducer 라는 함수임. 즉 reducer 는 context 의 상태 데이터를 가공하는 역할을 담당함.

각 컴포넌트들은 Action 을 이용해서 리듀서를 호출하고, 리듀서는 액션의 지정된 값을 처리해서, 보관될 앱 상태 데이터를 반환함

이를 처리하기 위해 reducer 를 정의하는데, 내부적으로는 리듀서이름(컴포에서 참조할), 관리할 상태명, 액션명을 설정해서 초기화 함
이를 외부에 export 해서 각 컴포넌트가 사용하는 형태를 취하도록 설계됨.
*/

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie, removeCookie, setCookie } from '../util/cookieUtil';
import { loginPost } from '../api/MemberApi';

//이 리듀서는 로그인/아웃을 처리하는 목적으로, email 의 상태 값을 초기값으로 갖고, 이 값이 존재 하는지의 여부에 따라서
//리액트에서 로긴 여부를 판별할 거임.

//초기 상태 데이터..email..
const initialState = {
  m_id: '',
  m_name: '',
  m_nickName: '',
  def_addr: '',
  birth: '',
  isMan: false,
  m_phoNum: '',
  m_email: '',
};

//쿠키가 있는지를 먼저 찾아보고, 없는 경우엔 기본값을 가지도록 구성함. 어플리케이션이 초기화될때 slice 도 초기화 되므로
//member쿠키가 있는 상태가 된 후엔 리프레쉬를 해도 로그인 상태가 유지됨.
//이를 위한 코드

//쿠키에서 로그인 정보를 가져오는 함수
const loadMemberCookie = () => {
  const memberInfo = getCookie('member');  // 쿠키 이름 member 의 값을 가져옴
  
  if (memberInfo) {
    try {
      return memberInfo;  // JSON 문자열을 객체로 변환
    } catch (error) {
      console.log('쿠키 정보 파싱 실패:', error);
    }
  }

  return {};  // 쿠키가 없으면 빈 객체 반환
};

//비동기 로그인 요청 처리 함수
export const loginPostAsynch = createAsyncThunk(
  'login/post', 
  async (loginParam, { rejectWithValue }) => {      //로그인파람 , 에러 처리 콜백을 전달
    try {
      const response = await loginPost(loginParam);  // 위에서 수정한 loginPost 호출
      console.log('서버 응답 : ' + JSON.stringify(response));

      //  const userData = response.data;
      //  console.log("+++++++++++++++" + response + "-------------------" + userData);

      return response;                              // 성공한 경우
    } catch (error) {
      console.log('로그인 요청 실패:', error);
      return rejectWithValue(error.response.data);  // 에러가 발생하면 rejectWithValue로 에러 처리
    }
  }
);

//로그인 상태 관리
const loginSlice = createSlice({
  name: 'LoginSlice',
  initialState: loadMemberCookie(),                  // 쿠키에서 로그인 정보 불러오기
  reducers: {
    snsLogin: (state, action) => {
      const data = action.payload;
      setCookie('member', data, 1);

      return data;
    },
    login: (state, action) => {
      //console.log('로그인.....', action.payload);
      const data = action.payload;                    //action.payload에서 데이터 추출
      
      // 로그인 성공 시 쿠키에 저장
      setCookie('member', JSON.stringify(state), 1);  // 쿠키에 로그인 정보 저장

      return data;  // 상태 업데이트
    },
    adminLogin: (state, action) => {
      const data = action.payload;
      console.log('adminLogin, LoginSlice');
      console.log(data);
      console.log(data?.accessToken, '--------------------------------');
      if (data?.accessToken) {
        setCookie('admin', JSON.stringify(data), 1);
      }
      return data;
    },
    sellerLogin: (state, action) => {
      const data = action.payload;

      if (data?.accessToken) {
        setCookie('seller', JSON.stringify(data), 1);
      }

      return data;
    },
    //로그아웃
    logout: (state) => {
      //console.log('로그아웃.....');
      removeCookie('member');  // 로그아웃 시 쿠키 삭제

      return {};  // 상태 초기화
    },
    adminLogout: (state) => {
      removeCookie('admin');
      return {};
    },
    sellerLogout: (state) => {
      removeCookie('seller');
      return {};
    },
    // 이메일 저장 쿠키 생성
    setEmailCookie: (state, action) => {
      const email = action.payload;
      setCookie('savedEmail', email, 365); // 1년 동안 쿠키 유지
    },
    // 이메일 저장 쿠키 제거
    removeEmailCookie: (state) => {
      removeCookie('savedEmail');
    },
  },
  //비동기 요청
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsynch.fulfilled, (state, action) => {
        //console.log(JSON.stringify(state) + " ---------------------- " + JSON.stringify(action));
        
        //console.log('로그인 성공 후 처리');
        const payload = action.payload;
        //console.log("서버에서 받은 " + payload);
        console.log("서버에서 받은 롤 셋 " + payload.roleSet);
        if(payload.accessToken){
          if(payload.roleSet[0] === "ADMIN"){
            console.log("Admin 로그인 성공");
            
            setCookie('admin',payload, 1);
          }else if(payload.roleSet[0] === "SELLER"){
            console.log("Seller 로그 인 성공");
            
            setCookie('seller',payload, 1);
          }else{
            console.log("일반 로그인 성공");
            setCookie('member',payload, 1);  // 로그인 성공 후 쿠키에 저장
          }
        }

        return payload;
      })
      .addCase(loginPostAsynch.rejected, (state, action) => {
        //console.log('로그인 실패 처리');
        return {};  // 로그인 실패 시 초기 상태로 설정
      });
  },
});
export const { login, logout, setEmailCookie, removeEmailCookie, snsLogin, adminLogin, sellerLogin, adminLogout, sellerLogout } = loginSlice.actions;
export default loginSlice.reducer;

//여기까지 slicer 를 작성하면, 이를 store 에 등록 함.