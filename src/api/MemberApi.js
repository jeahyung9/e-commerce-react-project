import axios from 'axios';
import jwtAxios from '../util/jwtUtil';
import { API_SERVER_HOST } from './hostAPI';

const host = `${API_SERVER_HOST}/api/member`;

export const loginPost = async (loginParam) => {
  const header = { headers: { 'Content-Type': 'application/json' } };

  const form = new FormData();

  console.log(loginParam);

  form.append('username', loginParam.email);
  form.append('password', loginParam.password);

  try {
    const res = await axios.post(`${host}/login`, form);
    console.log('서버 응답 전체:', res);
    if (res.status === 200) {
      return res.data; // 로그인 성공
    } else {
      throw new Error('로그인 실패');
    }
  } catch (error) {
    throw error; // 로그인 실패 시 에러 발생
  }
};

export const modifyMember = async (member) => {
  const res = await jwtAxios.put(`${host}/modify`, member);
  return res.data;
};

export const getMember = async(email) => {
  const res = await jwtAxios.get(`${host}/info/${email}`);
  //console.log("email : " + email)
  return res.data;
}

export const getMemberList = async() => {
  const res = await jwtAxios.get(`${host}/list`);
  return res.data;
}

export const updateMember = async(modifyinfo) => {
  const res = await jwtAxios.put(`${host}/modify`, modifyinfo);
  return res.data;
}

export const joinMember = async(joinMember) => {
  console.log(joinMember);
  const res = await axios.post(`${host}/join`, joinMember);
  return res.data;
}

