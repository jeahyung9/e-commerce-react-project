import { Cookies } from 'react-cookie';

const cookies = new Cookies();

// 쿠키에 저장할 때 빈 객체일 경우 ""로 저장되지 않도록 처리
export const setCookie = (name, value, hours) => {
  const expires = new Date();

  expires.setHours(expires.getHours() + hours);

  if(name === "member"){
    localStorage.setItem("expires", expires.getTime());
  }
  
  cookies.set(name, value, {expires:expires,path:'/'});
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  localStorage.removeItem("expires")
};