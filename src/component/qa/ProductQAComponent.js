import { useEffect, useState } from "react"
import classNames from 'classnames';
import styles from './ProductQAComponent.module.css';
import { deleteQA, getQAList } from "../../api/productQAAPI"
import { useCustomMove } from "../../hooks/useCustomMove";
import PageComponent from "../paging/PageComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { ProductQAModalComponent } from "../modal/ProductQAModalComponent";
import { ReactComponent as QIcon } from "../../assets/icon/qIcon.svg";
import { ReactComponent as AIcon } from "../../assets/icon/aIcon.svg";
import { LockOutlined } from "@mui/icons-material";
import { RemoveModalComponent } from "../modal/RemoveModalComponent";

export const ProductQAComponent = ({pno, mno}) => {
    const { page, size, moveToList, component } = useCustomMove();
    const [ productQA, setProductQA ] = useState([]);
    const [ serverData, setServerData ] = useState([]);
    const [ modal, setModal ] = useState({isOpen: false, qa: []});
    const [ isRemove, setIsRemove ] = useState(false);
    const [ removeModal, setRemoveModal] = useState({isOpen: false});
    const [ expandedQa, setExpandedQa ] = useState(null);
    const [ reload, setReload ] = useState(true);
    const [ qno, setQno] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        moveToList({ page: 1, size: 10 })
    },[]);

    useEffect(() => {
        //console.log(productQA);
        
    }, [productQA])

    useEffect(() => {
        setReload(true);
    }, [page, component]);

    useEffect(() => {
        //console.log(reload);
        //console.log(component);
        
        if(reload){
            if(!component || component === "qa"){
                getQAList(pno, [page, size]).then(data => {
                    setProductQA(data.dtoList);
                    setServerData(data);
                    console.log(data);
                });
            }
            setReload(false);
        }
        // else{
        //     getQAList(pno, [1, size]).then(data => {
        //         setProductQA(data.dtoList);
        //         setServerData(data);
        //     });
        // }
    }, [reload]);

    useEffect(() => {
        if(isRemove){
            removeQA();
        }
    }, [isRemove])

    const handleClickAdd = () => {
        if(mno) {
            setModal({isOpen:true})
        }else{
            alert("로그인 후에 이용 가능합니다.");
            navigate("/member/login");
        }
    }

    const handleClickTab = (qno) => {
        setExpandedQa(expandedQa === qno ? null : qno);
    }

    const handleClickModify = (qa) => {
        setModal({isOpen: true, qa: qa});
    }

    const handleClickDelete = (qno) => {
        setRemoveModal({isOpen: true});
        setQno(qno);
    }

    const removeQA = () => {
        deleteQA(qno).then(
            setReload(true)
        );
        setIsRemove(false);
    }

    const productQAComponent = productQA.map((qa) => 
        <>
            <tr
                onClick={!qa.secret || (qa.secret && mno === qa.mno) ? () => handleClickTab(qa.qno) : null}
                className={styles.qaTab}
            >
                {!qa.secret ?
                    <td className={styles.qaTitle}>{qa.title}</td>
                    :
                    <td className={classNames(styles.qaTitle, styles.secretTitle)}>
                        <p>
                            <LockOutlined />
                            <span className={classNames({ [styles.mySecret]: qa.secret && mno === qa.mno })}>
                                { qa.secret && mno === qa.mno ? qa.title : "비밀글입니다." }
                            </span>
                        </p>
                    </td>
                }
                <td>{qa.m_nickName}</td>
                <td>{format((new Date(qa.regDate)), "yyyy.MM.dd")}</td>
                {qa.replyCheck ? 
                    <td className={styles.answered}>답변완료</td>
                    :
                    <td>답변대기</td>
                }
            </tr>
            <tr className={classNames(
                styles.qaTabContentRow,
                { [styles.expanded]: expandedQa === qa.qno }
            )}>
                <td colSpan={4} className={styles.qaTabContent}>
                    <div className={styles.questionWrap}>
                        <div className={styles.iconWrap}>
                            <QIcon />
                        </div>
                        <p className={styles.question}>{qa.content}</p>
                    </div>
                    {qa.proQAReply && (
                        <div className={styles.answerWrap}>
                            <div className={styles.iconWrap}>
                                <AIcon />
                            </div>
                            <p className={styles.answer}>
                                {qa.proQAReply.qr_content}
                                <br/>
                                {format((new Date(qa.proQAReply.regDate)), "yyyy.MM.dd")}
                            </p>
                        </div>
                    )}
                    {mno === qa.mno && (
                        <div className={styles.btnWrap}>
                            <button
                                className={styles.modifyBtn}
                                onClick={() => handleClickModify(qa)}
                            >
                                수정
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleClickDelete(qa.qno)}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        </>
    );
    
    return(
        <>
            <div className={styles.headerWrap}>
                <div className={styles.headerText}>
                    <h3 className={styles.sectionTitle}>상품 문의</h3>
                    <p className={styles.sectionSubtitle}>
                        - 상품에 대한 문의를 남기는 공간입니다. 해당 게시판의 성격과 다른 글은 사전동의 없이 담당 게시판으로 이동될 수 있습니다.<br />
                        - 배송 관련, 주문(취소/교환/환불) 관련 문의 및 요청은 픽앤딜 내 1:1문의에 남겨주세요.
                    </p>
                </div>
                <Button
                    size="large"
                    variant="contained"
                    color="primaryDark"
                    disableElevation
                    onClick={handleClickAdd}
                >
                    문의하기
                </Button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.title}>제목</th>
                        <th className={styles.author}>작성자</th>
                        <th className={styles.createDate}>작성일</th>
                        <th className={styles.status}>답변상태</th>
                    </tr>
                </thead>
                <tbody>
                    {productQAComponent}
                </tbody>
            </table>
            <PageComponent
                serverData={serverData}
                movePage={moveToList}
                component={"qa"}
            />
            <ProductQAModalComponent 
                mno={mno}
                modal={modal}
                setModal={setModal}
                pno={pno}
                setReload={setReload}
            />
            <RemoveModalComponent 
            modal={removeModal}
            setModal={setRemoveModal}
            setIsRemove={setIsRemove}/>
        </>
    )
}