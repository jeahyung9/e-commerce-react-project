import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import { loginPostAsynch, logout, setEmailCookie, removeEmailCookie } from "../../slice/LoginSlice";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from '../../component/checkbox/checkbox';
import { ReactComponent as VerLine } from '../../assets/icon/verticalLine.svg';
import { ReactComponent as Google } from '../../assets/icon/googleLogin.svg';
import { ReactComponent as Kakao } from '../../assets/icon/kakaoLogin.svg';
import { ReactComponent as Naver } from '../../assets/icon/naverLogin.svg';
import { Button } from "@mui/material";
import styles from './LoginComponent.module.css';
import { getCookie } from "../../util/cookieUtil";
import { getKakaoLoginLink } from "../../api/kakaoApi";
import { getNaverLoginLink } from "../../api/NaverApi";
import { getGoogleLoginLink } from "../../api/GoogleApi";

const initState = {
  email: '',
  password: '',
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { doLogin, isLogin, doLogout } = useCustomLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveEmail, setSaveEmail] = useState(false); // 이메일 저장 여부 상태

  useEffect(() => {
    // 컴포넌트 마운트 시 이메일 저장 쿠키 확인
    const savedEmail = getCookie('savedEmail');
    if (savedEmail) {
      setSaveEmail(true);
      setLoginParam({ ...loginParam, email: savedEmail }); // 쿠키에 저장된 이메일로 초기화
    }
  }, []);

  const handleChange = (evt) => {
    loginParam[evt.target.name] = evt.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = (evt) => {
    //console.log("로그인ㅇㅇㅇㅇ : ", loginParam);

    dispatch(loginPostAsynch(loginParam))
      .then(data => {
        if (data?.payload.error) {
          alert('이메일과 패스워드 확인 바람');
          // 로그인 실패 시 상태를 false로 설정
          dispatch(logout());
        } else {
          alert("로그인 성공");
          doLogin(loginParam); // 로그인 후 상태 업데이트

          // 이메일 저장 여부에 따라 쿠키 생성 또는 제거
          if (saveEmail) {
            dispatch(setEmailCookie(loginParam.email));
          } else {
            dispatch(removeEmailCookie());
          }
        }
      })
      .catch((error) => {
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        console.error(error);
        // 로그인 실패 시 상태를 false로 설정
        dispatch(logout());
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && loginParam.email && loginParam.password) {
      handleClickLogin();
    }
  };

  const handleClickJoin = () => {
    navigate('/member/join'); // 회원가입 페이지로 이동
  }

  const handleLogout = () => {
    doLogout();
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  const modify = () => {
    navigate('/member/modify'); // 수정페이지 이동
  };

  const mypage = () => {
    navigate('/member/mypage'); // 마이페이지로 이동
  };

  const google = () => {
    const link = getGoogleLoginLink();
    window.location.href = link;
  }

  const kakao = () => {
    const link = getKakaoLoginLink();
    window.location.href = link;
  };

  const naver = () => {
    const link = getNaverLoginLink();
    window.location.href = link;
  };

  const link = getKakaoLoginLink();

  useEffect(() => {
    //console.log("현재 로그인 상태:", isLogin);  // 디버깅용
  }, [isLogin]);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h2>로그인</h2>
        <div className={styles.idInput}>
          <input
            name="email"
            type="email"
            value={loginParam.email}
            placeholder="이메일 입력"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.pwInput}>
          <input
            name="password"
            type="password"
            value={loginParam.password}
            placeholder="비밀번호 8자~20자"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.loginStatus}>
          <div className={styles.keepCheck}>
            <Checkbox label="이메일 저장" checked={saveEmail} onChange={() => setSaveEmail(!saveEmail)} />
          </div>
          <div className={styles.findMember}>
            <span>이메일 찾기</span>
            <VerLine />
            <span>비밀번호 찾기</span>
          </div>
        </div>
        <Button className={styles.loginBtn} onClick={handleClickLogin}>로그인</Button>
        <Button className={styles.signupBtn} onClick={handleClickJoin}>회원가입</Button>
        <div className={styles.socialTitle}>
          <div className={styles.horLine} />
          <span className={styles.socialText}>소셜 로그인</span>
          <div className={styles.horLine} />
        </div>
        <div className={styles.socialLogin}>
          <Link className={styles.socialBtn} onClick={google}>
            <Google />
          </Link>
          <Link className={styles.socialBtn}  onClick={kakao}>
            <Kakao />
          </Link>
          <Link className={styles.socialBtn} onClick={naver}>
            <Naver />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;