import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 추가
import { joinMember } from '../../api/MemberApi';  // joinMember API 호출 추가
import { Button, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import styles from './JoinComponent.module.css';

const JoinComponent = () => {
  // state 초기화
  const [formData, setFormData] = useState({
    m_id: '',
    m_pw: '',
    m_name: '',
    m_nickname: '',
    m_phoNum: '',
    email: '',
    def_addr: '',
    isMan: null,
    ad_agree: false,
    info_agree: false,
    totalPay: 0,
    membership: ['USER'],
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');

  // useNavigate 훅을 사용하여 페이지 이동 기능 추가
  const navigate = useNavigate();

  const joinMemberRequest =  (e) => {
    e.preventDefault();
    
    try {
      const response = joinMember(formData);
      console.log('회원가입 성공:', response);
      alert('회원가입이 완료되었습니다!');

      // 로그인된 상태로 메인 페이지로 이동
      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(formData));

      // 회원가입 성공 후 메인 페이지로 이동
      navigate('/');  // 메인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  // input 값 변화 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'pw_confirm') {
      setPasswordConfirm(value);
    } else {
      setFormData({
        ...formData,
        [name]: name === 'isMan' ? (value === 'true') : type === 'checkbox' ? checked : value,
      });
    }
  };

  const handlePwCheck = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const validation = {
    email: (value) => {
      if (!value) return true;
      const check = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return check.test(value);
    },
    // id: (value) => {
    //   if (!value) return true;
    //   let check = /[~!@#$%^&*()_+|<>?:{}.,/;='"ㄱ-ㅎ | ㅏ-ㅣ |가-힣]/;
    //   return check.test(value);
    // },
    pw: (value) => {
      if (!value) return true;
      const check = /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+|<>?:{}.,/;='"\\[\]-])(?=.*[0-9]).{8,}$/;
      return check.test(value);
    },
    pw_confirm: (value) => {
      if (!value) return true;
      return value === formData.m_pw;
    },
    // Add validation for other fields
    name: (value) => {
      if (!value) return true;
      const check = /[~!@#$%^&*()_+|<>?:{}.,/;='"\\[\]-]/;
      return !check.test(value);
    },
    nickname: (value) => {
      if (!value) return true;
      const check = /[~!@#$%^&*()_+|<>?:{}.,/;='"\\[\]-]/;
      return !check.test(value);
    },
    phoNum: (value) => {
      if (!value) return true;
      const check = /^01[0-9]{8,9}$/;
      return check.test(value);
    },
    def_addr: (value) => {
      if (!value) return true;
      return value.length > 0;
    },
    isMan: (value) => {
      return value !== null;
    },
    ad_agree: (value) => {
      return true; // 체크박스는 필수 항목이 아니므로 항상 false 반환
    },
    info_agree: (value) => {
      return value;
    }
  };

  const isFormValid = () => {
    const requiredFields = ['email', 'm_pw', 'm_name', 'm_nickname', 'm_phoNum', 'def_addr', 'isMan', 'info_agree'];
    const allFieldsFilled = requiredFields.every(field => formData[field] !== '' && formData[field] !== null);
    const allFieldsValid = Object.keys(validation).every(key => validation[key](key === 'pw_confirm' ? passwordConfirm : formData[key]));
    return allFieldsFilled && allFieldsValid;
  };

  return (
    <div className={styles.joinWrap}>
      <div className={styles.joinCard}>
        <h2>회원가입</h2>
        <form onSubmit={joinMemberRequest} className={styles.form}>
          <div className={styles.inputRow}>
            <TextField
              label="이메일"
              type="email"
              id="email"
              name="email"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.email}
              onChange={handleChange}
              required
              error={!validation.email(formData.email)}
              helperText={!validation.email(formData.email) ? "유효한 이메일 주소를 입력하세요." : ""}
            />
          </div>
          {/* <div className={styles.inputRow}>
            <TextField 
              label="아이디" 
              type='text' 
              id='m_id' 
              name='m_id' 
              color="primary" 
              fullWidth
              variant="standard" 
              value={formData.m_id} 
              onChange={handleChange} 
              required
              error={validation.id(formData.m_id)}
              helperText={validation.id(formData.m_id) ? "특수기호나 한글은 입력하실 수 없습니다." : ""}
            />
          </div> */}

          <div className={styles.inputRow}>
            <TextField
              label="비밀번호"
              type="password"
              id="m_pw"
              name="m_pw"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.m_pw}
              onChange={handleChange}
              required
              error={!validation.pw(formData.m_pw)}
              helperText={!validation.pw(formData.m_pw) ? "최소 8자 이상, 영문자, 숫자, 특수기호가 포함되어야 합니다." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <TextField
              label="비밀번호 확인"
              type="password"
              id="pw_confirm"
              name="pw_confirm"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={passwordConfirm}
              onChange={handlePwCheck}
              required
              error={!validation.pw_confirm(passwordConfirm)}
              helperText={!validation.pw_confirm(passwordConfirm) ? "위 비밀번호와 다릅니다." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <TextField
              label="이름"
              type="text"
              id="m_name"
              name="m_name"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.m_name}
              onChange={handleChange}
              required
              error={!validation.name(formData.m_name)}
              helperText={!validation.name(formData.m_name) ? "특수기호는 입력하실 수 없습니다." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <TextField
              label="닉네임"
              type="text"
              id="m_nickname"
              name="m_nickname"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.m_nickname}
              onChange={handleChange}
              required
              error={!validation.nickname(formData.m_nickname)}
              helperText={!validation.nickname(formData.m_nickname) ? "특수기호는 입력하실 수 없습니다." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <TextField
              label="전화번호"
              type="tel"
              id="m_phoNum"
              name="m_phoNum"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.m_phoNum}
              onChange={handleChange}
              required
              error={!validation.phoNum(formData.m_phoNum)}
              helperText={!validation.phoNum(formData.m_phoNum) ? "전화번호는 01로 시작하는 10자리 또는 11자리 숫자여야 합니다." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <TextField
              label="주소"
              type="text"
              id="def_addr"
              name="def_addr"
              spellcheck="false"
              color="primary"
              fullWidth
              variant="standard"
              value={formData.def_addr}
              onChange={handleChange}
              required
              error={!validation.def_addr(formData.def_addr)}
              helperText={!validation.def_addr(formData.def_addr) ? "주소를 입력하세요." : ""}
            />
          </div>

          <div className={styles.inputRow}>
            <FormLabel id="gender" required>성별</FormLabel>
            <RadioGroup
              row
              aria-labelledby="gender"
              name="isMan"
              onChange={handleChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="남성"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="여성"
              />
            </RadioGroup>
          </div>

          <div className={styles.inputRow}>
            <FormControlLabel
              control={
                <Checkbox
                  name="ad_agree"
                  checked={formData.ad_agree}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="광고 수신 동의 (선택)"
            />
          </div>

          <div className={styles.inputRow}>
            <FormControlLabel
              control={
                <Checkbox
                  name="info_agree"
                  checked={formData.info_agree}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="개인정보 수집 동의 (필수)"
            />
          </div>

          <Button type="submit" color="primary" variant="contained" disableElevation
          className={styles.joinBtn} disabled={!isFormValid()}>가입</Button>
        </form>
      </div>
    </div>
  );
};

export default JoinComponent;
