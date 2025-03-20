import { useEffect, useState } from 'react';
import { getNaverLoginLink } from '../../api/NaverApi';

const NaverLoginComponent = () => {
  const [link, setLink] = useState();

  // 네이버 로그인 링크가 제대로 반환되는지 확인하는 로그
  useEffect(() => {
    try{
      const naverLoginUrl = getNaverLoginLink();
      setLink(naverLoginUrl);
      console.log("네이버 로그인 URL :", naverLoginUrl);
    }catch(error){
      console.error("네이버 로그인 에러 : " + error);
      
    }
  }, []);

  const handleNaverLogin = () => {
    if(link) {
      console.log("네이버 로그인 링크로 리디렉션" , link);
      window.location.href = link;
    }else {
      console.log("네이버 로그인 링크  업슴");
      alert("dddddddddddd");
    }
    
  };

  return (
    <div className="flex flex-col">
      <div className="text-center text-blue-500">
      </div>
      <div className="flex justify-center  w-full">
        <div className="text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-yellow-500 shadow-sm rounded p-2" onClick={handleNaverLogin}>
          Naver LOGIN
        </div>
      </div>
    </div>
  );
};
export default NaverLoginComponent;
