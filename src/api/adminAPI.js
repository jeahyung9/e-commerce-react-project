import axios from 'axios';
import JWTAxios from '../util/jwtUtil';
import { API_SERVER_HOST } from './hostAPI';

const host = `${API_SERVER_HOST}`;

export const logVisitor = async () => {
  // post로 등록
  try {
    const response = await JWTAxios.post(
      `${host}/api/admin/visitor/log`,
      null,
      {
        withCredentials: true,
      }
    );
    console.log('방문자 기록 성공:', response);
    return response; // 서버 응답 반환
  } catch (error) {
    console.error('방문자 기록 실패:', error.message);
    throw error;
  }
};

export const visitorCount = async () => {
  try {
    const res = await JWTAxios.get(`${host}/api/admin/visitor/count`);
    console.log(res.data);
    return res.data; // JSON 데이터 반환
  } catch (error) {
    console.error('방문자 수 조회 실패:', error.message);
    throw error;
  }
};

export const visitorHourCount = async () => {
  try {
    const res = await JWTAxios.get(`${host}/api/admin/visitor/count/hour`);
    console.log(res.data);
    return res.data; // JSON 데이터 반환
  } catch (error) {
    console.error('시간대별 방문자 수 조회 실패:', error.message);
    throw error;
  }
};

export const getUserList = async (params) => {
  try {
    const res = await JWTAxios.get(`${host}/api/member/list`, { params });
    return res.data;
  } catch (error) {
    console.error('유저 리스트 오류 : ', error.message);
    throw error;
  }
};

export const getAdmin = async (adno) => {
  const encodedId = btoa(adno);
  try {
    const res = await JWTAxios.get(`${host}/api/admin/${encodedId}`);
    return res.data;
  } catch (error) {
    console.error('멤버 정보를 찾을 수 없음');
    throw error;
  }
};

export const getAdminById = async (id) => {
  try {
    const res = await JWTAxios.get(`${host}/api/admin/id/${id}`);
    return res.data;
  } catch (error) {
    console.error('멤버 정보를 찾을 수 없음');
    throw error;
  }
};

// 밴 처리
export const banUser = async (mno) => {
  const encodedId = btoa(mno);
  try {
    const res = await JWTAxios.put(`${host}/api/admin/ban/${encodedId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('밴 처리 실패:', error.message);
    throw error;
  }
};

// 밴 해제
export const unbanUser = async (mno) => {
  const encodedId = btoa(mno);
  try {
    const res = await JWTAxios.put(`${host}/api/admin/unban/${encodedId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('밴 해제 실패:', error.message);
    throw error;
  }
};

export const changeProductStatus = async (pno, status) => {
  const encodedId = btoa(pno);
  console.log(pno);
  console.log(status);
  try {
    const res = await JWTAxios.put(
      `${host}/api/admin/delStatus/${encodedId}`,
      null,
      {
        params: { status },
      }
    );
    return res.data;
  } catch (error) {
    console.error('상품 상태 변경 실패:', error.message);
    throw error;
  }
};

export const getFaq = async (fno) => {
  const encodedId = btoa(fno);
  try {
    const res = await axios.get(`${host}/api/faq/${encodedId}`);
    return res.data;
  } catch (error) {
    console.error('FAQ 조회 실패:', error.message);
    throw error;
  }
};

// FAQ 리스트
export const getFaqList = async (params) => {
  try {
    const res = await axios.get(`${host}/api/faq/list`, { params });
    return res.data;
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error.message);
    throw error;
  }
};

// FAQ 등록
export const addFaq = async (faqData) => {
  try {
    const res = await JWTAxios.post(`${host}/api/faq/`, faqData);
    return res.data;
  } catch (error) {
    console.error('FAQ 등록 실패:', error.message);
    throw error;
  }
};

// FAQ 수정
export const updateFaq = async (fno, faqData) => {
  const encodedId = btoa(fno);
  try {
    const res = await JWTAxios.put(`${host}/api/faq/${encodedId}`, faqData);
    return res.data;
  } catch (error) {
    console.error('FAQ 수정 실패:', error.message);
    throw error;
  }
};

// FAQ 삭제
export const deleteFaq = async (fno) => {
  const encodedId = btoa(fno);
  try {
    const res = await JWTAxios.delete(`${host}/api/faq/${encodedId}`);
    return res.data;
  } catch (error) {
    console.error('FAQ 삭제 실패:', error.message);
    throw error;
  }
};

// 특정 공지사항 조회
export const getNotice = async (nno) => {
  const encodedId = btoa(nno);
  try {
    const res = await axios.get(`${host}/api/notice/${encodedId}`);
    return res.data;
  } catch (error) {
    console.error('공지사항 조회 실패:', error.message);
    throw error;
  }
};

// 공지사항 목록 조회
export const getNoticeList = async (params) => {
  try {
    const res = await axios.get(`${host}/api/notice/list`, { params });
    return res.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error.message);
    throw error;
  }
};

// 공지사항 모든 목록 조회
export const getNoticeListAll = async () => {
  try {
    const res = await JWTAxios.get(`${host}/api/notice/list/all`);
    return res.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error.message);
    throw error;
  }
};

// 공지사항 등록
export const addNotice = async (noticeData) => {
  try {
    const res = await JWTAxios.post(`${host}/api/notice/`, noticeData);
    return res.data;
  } catch (error) {
    console.error('공지사항 등록 실패:', error.message);
    throw error;
  }
};

// 공지사항 수정
export const updateNotice = async (nno, noticeData) => {
  const encodedId = btoa(nno);
  try {
    const res = await JWTAxios.put(
      `${host}/api/notice/${encodedId}`,
      noticeData
    );
    return res.data;
  } catch (error) {
    console.error('공지사항 수정 실패:', error.message);
    throw error;
  }
};

// 공지사항 삭제
export const deleteNotice = async (nno) => {
  const encodedId = btoa(nno);
  try {
    const res = await JWTAxios.delete(`${host}/api/notice/${encodedId}`);
    return res.data;
  } catch (error) {
    console.error('공지사항 삭제 실패:', error.message);
    throw error;
  }
};

export const getSuperProductList = async (
  pageParam,
  { ctno = null, delFlag = null, keyword = '' }
) => {
  try {
    const [page, size] = pageParam;
    const params = {
      page,
      size,
      ctno,
      delFlag,
      keyword,
    };

    const res = await JWTAxios.get(`${host}/api/admin/productList`, { params });

    return res.data;
  } catch (error) {
    console.error('상품 리스트  실패:', error.message);
    throw error;
  }
};

// 판매 상품 상태 변경 (복구 또는 삭제)
export const changeSellerProductStatus = async (pno, status) => {
  const encodedId = btoa(pno);
  console.log(pno);
  console.log(status);
  try {
    const res = await JWTAxios.put(
      `${host}/api/admin/delStatus/${encodedId}`,
      null,
      {
        params: { status },
      }
    );
    return res.data;
  } catch (error) {
    console.error('상품 상태 변경 실패:', error.message);
    throw error;
  }
};
