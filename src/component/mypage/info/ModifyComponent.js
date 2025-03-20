import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMember, loginPost, modifyMember, updateMember } from '../../../api/MemberApi';
import { getCookie } from '../../../util/cookieUtil';
import MyPageContainer from '../MyPageContainer';
import styles from './ModifyComponent.module.css';
import { TextField, FormControlLabel, RadioGroup, Radio, Button } from '@mui/material';
import useCustomLogin from '../../../hooks/useCustomLogin';

const ModifyComponent = () => {
  const userData = useSelector((state) => {
    console.log("전체 Redux 상태:", state);  // 전체 상태 확인
    return state.LoginSlice;  // LoginSlice의 상태만 반환
  });

  const [ info, setInfo ] = useState({}); //회원정보
  const { doLogout } = useCustomLogin();
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [isEditing, setIsEditing] = useState(true);  // 수정 모드 상태

  useEffect(() => {
    getMember(getCookie("member").email)
      .then((data) => {
        console.log('API 호출 결과:', data);  // 데이터가 제대로 받아졌는지 확인
        console.log("ModifyComponent email : " + data.email);
        setInfo({...data, m_pw: ""});
      })
      .catch((err) => {
        console.log('API 호출 에러:', err);  // API 호출 에러 확인
        setError('회원 정보를 불러오는 데 실패했습니다.');
      });
  }, []);

  useEffect(() => { 
  
    setIsLoading(true);  // 로딩 시작
    
    console.log("22222" + userData);

    if (userData) {  // userData.email이 존재하는 경우
      console.log("userData.m_id2222" + userData.email);
      // setUserInfo({
      //   // m_id: userData.id,  // 여기서는 이메일을 ID로 사용하거나 실제 `m_id`가 필요하면 다른 값으로 설정
      //   //m_name: userData.name || '',  // userData에 name이 있을 경우에만 설정
      //   // m_nickName: userData.nickname || '',  // nickName도 마찬가지
      //   // def_addr: userData.def_addr || '',
      //   // birth: userData.birth || '',
      //   // isMan: userData.isMan || false,
      //   // m_phoNum: userData.m_phoNum || '',
      //   // m_email: userData.email,
      //   //m_pw: '',  // 초기 비밀번호는 공백
      // });
  
      // userInfo 상태가 업데이트되면 로딩 상태를 false로 변경
      setIsLoading(false);
    } else {
      // userData가 없다면 로딩 상태를 false로 변경
      setIsLoading(false);
      setError("로그인 정보가 없습니다.");
    }
  }, [userData]);  // userData 변경 시마다 실행

  useEffect(() => {
    console.log("-------userInfo : " + userInfo);
    console.log("=======info : " + JSON.stringify(info));
    
  }, [userInfo, info]);

  const infoModify = () => {
    if(!userInfo){
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    if(!info.now_pw && !info.m_pw && !info.new_m_pw){
      modifyMember(userInfo);
      alert("회원 정보가 수정되었습니다.");
    }else{
      if(!info.m_pw && !info.new_m_pw){
        alert("비밀번호를 수정하시려면 새 비밀번호를 입력해주세요.");
        return;
      }
      if(info.m_pw !== info.new_m_pw){
        alert("새 비밀번호가 서로 다릅니다.");
      }else{
        loginPost({email: info.email, password: info.now_pw}).then(data => 
          {
            console.log(data);
            if(!data.error){
              try{
                modifyMember(userInfo).then(data => {
                  alert("회원 정보가 수정되었습니다. 비밀번호가 변경되어 로그아웃됩니다.");
                  doLogout();
                });
              }catch(e){
                console.error(e);
                alert("회원 정보 수정에 실패했습니다. 다시 시도해 주세요.");
              }
            }else{
              alert("입력한 정보가 틀렸습니다. 다시 입력해주세요.");
            }
          }
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name !== "now_pw" && name !== "new_m_pw"){
      setUserInfo(prevInfo => ({...prevInfo, email: info.email, [name]: value}));
    }
    setInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', (userInfo));  // 제출된 값 로그

    // 서버에 수정된 정보 보내는 로직 추가
    // 예시로 alert 사용
    alert('정보가 수정되었습니다!');
    
    // 수정 완료 후 수정 모드 종료
    setIsEditing(false);
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MyPageContainer>
      <div className={styles.modifyContainer}>
        <h2 className={styles.title}>개인 정보 수정</h2>

        <div className={styles.inputForm}>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이메일</div>
            <TextField
              type="email"
              id="m_email"
              name="m_email"
              fullWidth
              value={info.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이름</div>
            <TextField
              type="text"
              id="m_name"
              name="m_name"
              fullWidth
              value={info.m_name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>닉네임</div>
            <TextField
              type="text"
              id="m_nickname"
              name="m_nickname"
              fullWidth
              value={info.m_nickname}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>주소</div>
            <TextField
              type="text"
              id="def_addr"
              name="def_addr"
              fullWidth
              value={info.def_addr || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>생일</div>
            <TextField
              type="text"
              id="birth"
              name="birth"
              fullWidth
              value={info.birth || ''}
              disabled
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>성별</div>
            <RadioGroup
              aria-label="gender"
              name="isMan"
              row
              fullWidth
              value={info.isMan ? '남자' : '여자'}
              onChange={(e) => handleInputChange({ target: { name: 'isMan', value: e.target.value === '남자' } })}
            >
              <FormControlLabel value="남자" control={<Radio />} label="남자" />
              <FormControlLabel value="여자" control={<Radio />} label="여자" />
            </RadioGroup>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>전화번호</div>
            <TextField
              type="text"
              id="m_phoNum"
              name="m_phoNum"
              fullWidth
              value={info.m_phoNum || ''} 
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>현재 비밀번호</div>
            <TextField
              type="password"
              id="now_pw"
              name="now_pw"
              fullWidth
              value={info.now_pw || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>새 비밀번호</div>
            <TextField
              type="password"
              id="m_pw"
              name="m_pw"
              fullWidth
              value={info.m_pw || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>새 비밀번호 확인</div>
            <TextField
              type="password"
              id="new_m_pw"
              name="new_m_pw"
              fullWidth
              value={info.new_m_pw || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.buttonWrap}>
            <Button variant="contained" disableElevation type="button" onClick={infoModify}>
                수정하기
              </Button>
          </div>
        </div>
      </div>
    </MyPageContainer>
  );
};

export default ModifyComponent;