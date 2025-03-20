import { useEffect, useState } from "react";
import { fetchUserOrders } from "../../../api/paymentApi";
import classNames from "classnames";
import styles from "./MyReviewComponent.module.css";
import MyPageContainer from "../MyPageContainer";
import { Rating, Skeleton } from "@mui/material";
import { breakLine } from "../../../hooks/useCustomString";
import ReviewModalComponent from "../../modal/ReviewModalComponent";
import { getCookie } from "../../../util/cookieUtil";
import { getReviewOne } from "../../../api/reviewAPI";

const MyReviewComponent = () => {
    const [ order, setOrder ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const mno = getCookie("member")?.mno;
    const [ selected, setSelected ] = useState(0);
    const [ modal, setModal ] = useState({isOpen: false});
    const [ rno, setRno ] = useState();
    const [ cnt, setCnt] = useState([]);
    const [ reviewData, setReviewData ] = useState({});
    const [ filteredOrders, setFilteredOrders ] = useState([]);
    const [ isAdd, setIsAdd ] = useState(false);

    useEffect(() => {
        if(mno){
            setLoading(true);
            fetchUserOrders(mno).then(data => {
                setOrder(data);
                setLoading(false);
            })
        }
    }, [mno])

    useEffect(() => {
        if(mno && isAdd){
            setLoading(true);
            fetchUserOrders(mno).then(data => {
                setOrder(data);
                setLoading(false);
                setIsAdd(false);
            })
        }
    }, [isAdd])

    useEffect(() => {
        if(order){
            setFilteredOrders(order.filter(data => data.status === "ORDER_COMPLETE"));
        }
    }, [order])

    useEffect(() => {
        console.log(filteredOrders);
        let reviewCnt = 0;
        let notReviewCnt = 0;
        filteredOrders.map(data => {
            data.orderDetails.map(detail => {
                if (!detail.rno) reviewCnt++;
                else {
                    notReviewCnt++;
                    getReviewOne(detail.rno).then(data => {
                        setReviewData(({...reviewData, [detail.rno] : data}));
                    });
                }
            });
        });
        setCnt([reviewCnt, notReviewCnt]);
    }, [filteredOrders])

    useEffect(() => {
        console.log(reviewData);
    }, [reviewData])

    const handleClickWrite = () => {
        setSelected(0);
    };

    const handleClickWritten = () => {
        setSelected(1);
    };

    const countComponent = (cnt) => {
        return (
            <p className={styles.totalCnt}>
                <span>총&nbsp;&nbsp;</span>
                <span className={styles.num}>{cnt}</span>
                <span>&nbsp;개</span>
            </p>
        );
    }

    const handleOpenReview = (orno, odno) => {
        setModal({isOpen: true, orno: orno, odno: odno});
    };

    const availableOrderComponent = filteredOrders.length > 0 ?
        filteredOrders.map(data => (
            <>
                {data.orderDetails.length > 0 ?
                    data.orderDetails.filter(detail => !detail.rno).map(item => (
                        <div className={styles.card}>
                            <div className={styles.orderWrap}>
                                <div className={styles.imgWrap}>
                                    <img src="" alt="상품 이미지" />
                                </div>
                                <div className={styles.textWrap}>
                                    <div className={styles.orderText}>
                                        <p className={styles.productName}>픽앤딜 {item.p_name}({item.od_name})</p>
                                        <p className={styles.orderDate}>{new Date(data.orderDate).toLocaleDateString()} 주문완료</p>
                                    </div>
                                    <div className={styles.reviewBtnWrap}>
                                        <button onClick={() => handleOpenReview(item.orno, item.odno)} className={styles.reviewBtn}>후기작성</button>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    )
                    :
                    <div className={styles.noReview}>
                        <span>작성 가능한 후기가 없습니다.</span>
                    </div>
                }
            </>)
        )
        :
        <div className={styles.noReview}>
            <span>작성 가능한 후기가 없습니다.</span>
        </div>
    ;

    const writtenOrderComponent = filteredOrders.length > 0 ?
        filteredOrders.map(data => (
            <>
                {data.orderDetails.length > 0 ?
                    data.orderDetails.filter(detail => detail.rno).map(item => {
                        const review = reviewData[item.rno];

                        return (
                        <div className={styles.card}>
                            <div className={styles.orderWrap}>
                                <div className={styles.imgWrap}>
                                    <img src="" alt="상품 이미지" />
                                </div>
                                <div className={styles.textWrap}>
                                    <div className={styles.orderText}>
                                        <p className={styles.productName}>픽앤딜 {item.p_name}({item.od_name})</p>
                                        <p className={styles.orderDate}>{new Date(data.orderDate).toLocaleDateString()} 주문완료</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.reviewItemWrap}>
                                <p className={styles.reviewTitle}>{review?.title}</p>
                                <div className={styles.rating}>
                                    <Rating value={review?.rate} readOnly />
                                </div>
                                <p className={styles.reviewContent}>{breakLine(review?.content)}</p>
                            </div>
                            <div className={styles.btnWrap}>
                                <button>수정</button>
                                <div className={styles.verLine}></div>
                                <button>삭제</button>
                            </div>
                        </div>)}
                    )
                    :
                    <div className={styles.noReview}>
                        <span>작성한 후기가 없습니다.</span>
                    </div>
                }
            </>)
        )
        :
        <div className={styles.noReview}>
            <span>작성한 후기가 없습니다.</span>
        </div>
    ;

    return (
        <>
            <MyPageContainer>
                <div className={styles.topWrap}>
                    <h2 className={styles.title}>상품 후기</h2>
                    <div className={styles.menuBtnWrap}>
                        <button
                            onClick={handleClickWrite}
                            className={classNames(styles.menuBtn, {[styles.active]: selected === 0})}
                        >
                            작성 가능 후기
                        </button>
                        <button
                            onClick={handleClickWritten}
                            className={classNames(styles.menuBtn, {[styles.active]: selected === 1})}
                        >
                            작성한 후기
                        </button>
                    </div>
                    <ul className={classNames(styles.description, {[styles.active]: selected === 0})}>
                        <li>&#183; 주간 베스트 후기로 선정 시 5,000원 추가 적립</li>
                        <li>&#183; 후기 50원 적립</li>
                        <li>&#183; 동일 상품의 후기는 월 1회만 적립금을 지급해드립니다.</li>
                        <li>&#183; 후기 작성 후 일주일 이내에 적립금이 지급됩니다.</li>
                    </ul>
                </div>
            </MyPageContainer>
            <div className={styles.box}></div>
            <MyPageContainer>
                <div className={styles.bottomWrap}>
                    {loading ? (
                        <>
                            <Skeleton animation="wave" width={60} height={30} className={styles.totalCnt} />
                            <div className={styles.card}>
                                <div className={styles.orderWrap}>
                                    <Skeleton variant="rounded" animation="wave" width={60} height={60} className={styles.imgWrap} />
                                    <div className={styles.textWrap}>
                                        <div className={styles.orderText}>
                                            <Skeleton animation="wave" width={200} className={styles.productName} />
                                            <Skeleton animation="wave" width={100} className={styles.orderDate} />
                                        </div>
                                        {selected === 0 &&
                                            <div className={styles.reviewBtnWrap}>
                                                <Skeleton variant="rounded" animation="wave" width={70} height={30} />
                                            </div>
                                        }
                                    </div>
                                </div>
                                {selected === 1 &&
                                    <div className={styles.reviewItemWrap}>
                                        <Skeleton animation="wave" width={200} className={styles.reviewTitle} />
                                        <div className={styles.rating}>
                                            <Rating value="0" readOnly />
                                        </div>
                                        <div className={styles.reviewContent}>
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" width="70%" />
                                        </div>
                                    </div>
                                }
                            </div>
                        </>
                    ) : (
                        <>
                            {filteredOrders.length > 0 && (
                                selected === 0 ?
                                (selected === 0 && countComponent(cnt[0])) :
                                (selected === 1 && countComponent(cnt[1]))
                            )}
                            {selected === 0 && availableOrderComponent}
                            {selected === 1 && writtenOrderComponent}
                        </>
                    )}
                </div>
            </MyPageContainer>
            <ReviewModalComponent
                modal = {modal}
                setModal = {setModal}
                setIsAdd = {setIsAdd}
                rno = {rno}
                mno = {mno}
            />
        </>
    );
}

export default MyReviewComponent;