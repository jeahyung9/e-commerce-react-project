import axios from 'axios';
import { API_SERVER_HOST as host } from './hostAPI';
const prefix = `${host}/api/categories`;

// depth별 카테고리 조회
export const getCategoriesByDepth = async (depth) => {
  const res = await axios.get(`${prefix}/depth/${depth}`);
  return res.data;
};

// 랜덤으로 불러오기
export const getRandomCategories = async (count = 15, depth = 3) => {
  const res = await axios.get(`${prefix}/random`, { params: { count, depth } });
  return res.data;
};

// 상위 카테고리의 하위 카테고리 목록 조회
export const getSubCategories = async (ctno) => {
  const res = await axios.get(`${prefix}/sub/${ctno}`);
  return res.data;
};

// 하위 카테고리의 상위 카테고리 조회
export const getSuperCategory = async (ctno) => {
  const res = await axios.get(`${prefix}/super/${ctno}`);
  return res.data;
};

// 카테고리 삭제
export const deleteCategory = async (ctno) => {
  const res = await axios.delete(`${prefix}/${ctno}`);
  return res.data;
};
