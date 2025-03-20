import { ReactComponent as LoginImg } from '../../assets/img/loginAdmin.svg';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';
import { Button, TextField } from '@mui/material';
import styles from './AdminLogin.module.css';
import { useEffect, useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import { useDispatch } from 'react-redux';
import { adminLogout, loginPostAsynch, logout } from '../../slice/LoginSlice';

const initState = {
  email: '',
  password: '',
};

const AdminLogin = () => {
  const [adminLoginParam, setAdminLoginParam] = useState({ ...initState });
  const { doAdminLogin, isLogin } = useCustomLogin();
  const dispatch = useDispatch();

  const handleChange = (evt) => {
    adminLoginParam[evt.target.name] = evt.target.value;
    setAdminLoginParam({ ...adminLoginParam });
  };

  const handleClickLogin = (evt) => {
    console.log('관리자 로그인 : ', adminLoginParam);

    dispatch(loginPostAsynch(adminLoginParam))
      .then((data) => {
        if (data?.payload.error) {
          alert('아이디 또는 패스 워드 확인 바람');
          dispatch(adminLogout());
        } else {
          alert('로그인 성공');
          doAdminLogin(adminLoginParam);
        }
      })
      .catch((error) => {
        alert('로그인에 실패하였습니다. 다시 시도하여 주십시오');
        console.error(error);
        dispatch(adminLogout());
      });
  };

  const handleKeyDown = (e) => {
    if (
      e.key === 'Enter' &&
      adminLoginParam.email &&
      adminLoginParam.password
    ) {
      handleClickLogin();
    }
  };

  useEffect(() => {
    console.log('현재 관리자 로그인 상태', isLogin);
  }, [isLogin]);

  return (
    <div className={styles.wrap}>
      <div className={styles.bg}></div>
      <div className={styles.adminLoginWrap}>
        <div className={styles.imgContainer}>
          <LoginImg />
        </div>
        <div className={styles.loginWrap}>
          <div className={styles.loginContainer}>
            <Button
              className={styles.logo}
              href="/"
              color="primary"
              sx={{ padding: '1rem', marginBottom: '3rem' }}
            >
              <Logo />
            </Button>
            <p className={styles.loginTitle}>관리자 로그인</p>
            <TextField
              className={styles.idInput}
              color="primary"
              id="outlined-basic"
              label="아이디"
              variant="outlined"
              name="email"
              sx={{ width: '100%', font: 'inherit', marginBottom: '1rem' }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <TextField
              className={styles.pwInput}
              color="primary"
              id="outlined-adornment-password"
              label="패스워드"
              type="password"
              name="password"
              sx={{ width: '100%', font: 'inherit', marginBottom: '2rem' }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <Button
              className={styles.loginBtn}
              color="textLightblack"
              variant="contained"
              sx={{
                width: '100%',
                padding: '1rem',
                font: 'inherit',
                fontSize: '1.2rem',
              }}
              onClick={handleClickLogin}
            >
              로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
