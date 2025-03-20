import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMember, loginPost } from "../../../api/MemberApi";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { TextField, Button } from "@mui/material";
import styles from "./InfoComponent.module.css";
import MyPageContainer from "../MyPageContainer";

export const InfoComponent = () => {
    const navigate = useNavigate();
    const { isLogin, loginState } = useCustomLogin();
    const [ loginParam, setLoginParam ] = useState({email:"",password:""});
    const [ loginData, setLoginData ] = useState();
    const [ member, setMember ] = useState();

    useEffect(() => {
        if(!isLogin){
            navigate("/");
        }else{
            const email = loginState.email || loginState.m_email;
            getMember(email).then(data => {
                setMember(data);
            });
        }
    }, [isLogin])

    useEffect(() => {
        console.log(member);
    }, [member])

    if(member?.formSns){
        alert("SNS 로그인은 정보 수정이 불가능합니다.");
        navigate("../");
    }

    useEffect(() => {
        if(loginData){
            navigate("./modify")
        }
    }, [loginData])

    const handleChange = (e) => {
        setLoginParam({email: member?.email, password: e.target.value})
    }

    const submit = () => {
        loginPost(loginParam).then(data => 
            {
                if(!data.error){
                    setLoginData(data);
                }else{
                    alert("입력한 정보가 틀렸습니다. 다시 입력해주세요.");
                }
            }
        );
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    }

    return(
        <MyPageContainer>
            <div className={styles.infoContainer}>
                <div className={styles.infoHeader}>
                    <h2>개인 정보 수정</h2>
                    <h3>비밀번호 재확인</h3>
                    <p>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해주세요.</p>
                </div>
                <div className={styles.inputWrap}>
                    <div className={styles.inputRow}>
                        <div className={styles.inputLabel}>아이디</div>
                        <TextField value={member?.email} readOnly fullWidth onKeyDown={handleKeyPress} className={styles.input}></TextField>
                    </div>
                    <div className={styles.inputRow}>
                        <div className={styles.inputLabel}>비밀번호</div>
                        <TextField type={"password"} onChange={handleChange} onKeyDown={handleKeyPress} fullWidth className={styles.input}></TextField>
                    </div>
                </div>
                <div className={styles.buttonWrap}>
                    <Button variant="contained" disableElevation onClick={submit}>확인</Button>
                </div>
            </div>
        </MyPageContainer>
    )
}