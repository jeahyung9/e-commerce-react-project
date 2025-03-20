import React, { useState, useEffect } from 'react';
import { getMember, updateMember } from '../../../api/MemberApi';
import { getCookie } from '../../../util/cookieUtil';
import { Navigate, useNavigate } from 'react-router-dom';
import MyPageContainer from '../MyPageContainer';
import { TextField, Button } from '@mui/material';
import styles from './AddrComponent.module.css';

const AddrComponent = () => {
  const [postcode, setPostcode] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [guideText, setGuideText] = useState('');
  const [ info, setInfo ] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Daum Postcode API 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script); 
    };
  }, []);

  useEffect(() => {
      getMember(getCookie("member").email)
        .then((data) => {
          console.log('주소 계정:', data);  // 데이터가 제대로 받아졌는지 확인
          console.log("주소 계정 email : " + data.email);
          setInfo(data);
        })
        .catch((err) => {
          console.log('API 호출 에러:', err);  // API 호출 에러 확인
        });
    }, []);

    const toggleEditMode = () => {
      // 우편번호와 도로명 주소가 충분히 입력되지 않은 경우, 수정할 주소를 입력하라는 알림을 띄우도록 변경
      if (!roadAddress || roadAddress.length <= 2) {
        alert("변경할 주소를 입력해주세요.");
      } else {
        // 수정 모드 상태 전환
        setIsEditing(!isEditing);
        
        // 주소가 유효한 경우에만 updateMember 호출
        const updatedInfo = { ...info, def_addr: '(' + postcode + ')' +  roadAddress + ' ' + detailAddress }; // 예시로 도로명주소와 상세주소를 결합하여 업데이트
        
        // `updateMember` API 호출 (주소 업데이트)
        updateMember(updatedInfo)
          .then((response) => {
            console.log('회원 정보가 성공적으로 업데이트되었습니다:', response);
          })
          .catch((error) => {
            console.error('회원 정보 업데이트 실패:', error);
          });
          alert("회원 정보가 수정되었습니다.")
          navigate('/mypage');
      }
    };

  // Daum 우편번호 API 실행
  const sample4ExecDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소와 참고 항목 처리
        let roadAddr = data.roadAddress;  // 도로명 주소
        let extraRoadAddr = '';  // 참고 항목

        // 법정동명이 있을 경우 추가
        if (data.bname && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        
        // 건물명이 있고, 공동주택일 경우 추가
        if (data.buildingName && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr ? ', ' : '') + data.buildingName;
        }

        // 참고 항목이 있을 경우 괄호까지 추가
        if (extraRoadAddr) {
          extraRoadAddr = ` (${extraRoadAddr})`;
        }

        // 필드에 값 설정
        setPostcode(data.zonecode);
        setRoadAddress(roadAddr);
        setJibunAddress(data.jibunAddress);
        setExtraAddress(roadAddr ? extraRoadAddr : '');

        // 예상 주소 처리
        if (data.autoRoadAddress) {
          const expRoadAddr = data.autoRoadAddress + extraRoadAddr;
          setGuideText(`(예상 도로명 주소 : ${expRoadAddr})`);
        } else if (data.autoJibunAddress) {
          const expJibunAddr = data.autoJibunAddress;
          setGuideText(`(예상 지번 주소 : ${expJibunAddr})`);
        } else {
          setGuideText('');
        }
      },
    }).open();
  };

  return (
    <MyPageContainer>
      <div className={styles.addrContainer}>
        <div className={styles.addrHeader}>
          <h2>배송지 관리</h2>
          <p>픽앤딜에서 고객님께 상품을 보내드릴 주소를 관리하세요.</p>
        </div>
        <div className={styles.inputForm}>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>기존 주소</div>
            <TextField
              type="text"
              id="def_addr"
              name="def_addr"
              size="small"
              fullWidth
              value={info.def_addr || ''}
              disabled
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>우편번호</div>
            <TextField
              type="text"
              value={postcode}
              readOnly
              size="small"
              fullWidth
              onClick={sample4ExecDaumPostcode}
            />
            <Button
              variant="outlined"
              onClick={sample4ExecDaumPostcode}
              className={styles.findBtn}
            >
              우편번호 찾기
            </Button>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>도로명주소</div>
            <TextField
              type="text"
              value={roadAddress}
              readOnly
              size="small"
              fullWidth
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>지번주소</div>
            <TextField
              type="text"
              value={jibunAddress}
              readOnly
              size="small"
              fullWidth
            />
          </div>
          <p style={{ color: '#999', display: guideText ? 'block' : 'none' }}>
            {guideText}
          </p>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>상세주소</div>
            <TextField
              type="text"
              value={detailAddress}
              size="small"
              fullWidth
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>참고항목</div>
            <TextField
              type="text"
              value={extraAddress}
              readOnly
              size="small"
              fullWidth
            />
          </div>
        </div>
        <div className={styles.buttonWrap}>
          {isEditing ? (
            <Button variant="contained" disableElevation type="submit">
              수정하기
            </Button>
          ) : (
            <Button variant="contained" disableElevation type="button" onClick={toggleEditMode}>
              수정하기
            </Button>
          )}
        </div>
      </div>
    </MyPageContainer>
  );
};

export default AddrComponent;
