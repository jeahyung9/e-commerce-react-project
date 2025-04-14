import axios from "axios";
import { API_SERVER_HOST } from "./hostAPI";
import jwtAxios from "../util/jwtUtil";

const prefix = `${API_SERVER_HOST}/api/product`;

export const getOption = async(pno) => {
  const encodedPno = btoa(pno);
    const res = await axios.get(`${prefix}/option/${encodedPno}`);

    return res.data;
}

// 삭제
export const deleteOne = async (pno) => {
    const encodedPno = btoa(pno);
    const res = await axios.delete(`${prefix}/${encodedPno}`);
    return res.data;
  };
  
  // 수정
  export const putOne = async (pno, product) => {
    const encodedPno = btoa(pno);
    const res = await axios.put(`${prefix}/${encodedPno}`, product);
    return res.data;
  };
  
  // 신규 등록
  export const postAdd = async (product, ctnoList, images, opts) => {
    try {
      const formData = new FormData();
  
      const ctnotoList = JSON.stringify(ctnoList.map((item) => item.ctno));
      const optsList = opts.map((item) => ({
        od_name: item.od_name,
        od_stock: item.od_stock,
        od_price: item.od_price,
      }));
  
      console.log(product);
      console.log(ctnoList);
      console.log(images);
      console.log(opts);
  
      // 🔹 JSON 데이터를 문자열로 변환하여 formData에 추가
      formData.append(
        'dto',
        new Blob([JSON.stringify(product)], { type: 'application/json' })
      );
      // 🔹 카테고리 리스트 추가
      formData.append('ctnoList', ctnotoList);
  
      // 🔹 이미지 파일 추가
      images.forEach((image) => {
        formData.append('images', image);
      });
  
      formData.append('opts', JSON.stringify(optsList));
  
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const res = await jwtAxios.post(`${prefix}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('상품 등록 성공', res.data);
      return res.data;
    } catch (error) {
      console.error('상품 등록 실패', error);
      throw error;
    }
  };
  
  export const getOne = async (pno) => {
    const encodedPno = btoa(pno);
    const res = await axios.get(`${prefix}/${encodedPno}`);
    return res.data;
  };
  
  export const getList = async ([page, size], { sort, ctno, order, keyword }) => {
    const params = {
      page: page,
      size: size,
      sortBy: sort,
      sort: sort,
      ctno: ctno,
      order: order,
      keyword: keyword,
    };
  //console.log(params);
    const res = await axios.get(`${prefix}/list`, { params });
  
    return res.data;
  };
  
  export const decreaseOptionStock = async(odno, cnt) => {
    const encodedOdno = btoa(odno);
    const res = await axios.put(`${prefix}/${encodedOdno}/decreaseStock/${cnt}`);
    
    return res.data;
  };

  export const increaseOptionStock = async(odno, cnt) => {
    const encodedOdno = btoa(odno);
    const res = await axios.put(`${prefix}/${encodedOdno}/increaseStock/${cnt}`);
    
    return res.data;
  };