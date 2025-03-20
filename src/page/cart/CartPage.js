import styles from './CartPage.module.css';
import { useEffect, useState } from "react";
import { CartComponent } from "../../component/cart/CartComponent";
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { addComma } from '../../hooks/useCustomString';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getCookie } from '../../util/cookieUtil';
import Checkbox from '../../component/checkbox/checkbox';

export const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const mno = getCookie("member")?.mno;
    const { isLogin } = useCustomLogin();
    const [ cartItemsCnt, setCartItemsCnt ] = useState(0);
    const [ selectCnt, setSelectCnt ] = useState(0);
    const [ allSelect, setAllSelect ] = useState(true);
    const [ selectRemoveModal, setSelectRemoveModal ] = useState(false);
    const [ selCartItem, setSelCartItem ] = useState([]);
    const [ totalPrice, setTotalPrice ] = useState(0);
    const [ totalSalePrice, setTotalSalePrice ] = useState(0);

    let finalPrice = addComma(totalSalePrice + 0);

    useEffect(() => {
        if(!isLogin){
            alert("로그인 시 이용가능");
            navigate("/member/login");
        }
    }, [isLogin])

    useEffect(() => {
        console.log(selCartItem);
        
    }, [selCartItem])

    const onAllSelect = (e) => {
        if(e.target.checked){
            setAllSelect(true);
        }else{
            setAllSelect(false);
        }
    }
    
    const selectRemove = () => {
        if(selectCnt > 0){
            setSelectRemoveModal(true);
        }
    }

    const moveToPayment = () => {
        if(selCartItem.length === 0){
            alert("결제할 상품을 선택해주세요.");
            return;
        }
        navigate("../payment/form", {state: {selCartItem: selCartItem}});
        console.log(location.state ? location.state.selCartItem : 0);
        
    }

    return(
        <div className={styles.wrap}>
            <div className={styles.cartWrap}>
                <h2 className={styles.title}>장바구니</h2>
                <div className={styles.sectionContainer}>
                    <section className={styles.selection}>
                        <div className={classNames(styles.tab, styles.deleteTab)}>
                            <Checkbox label={`전체선택 ${selectCnt}/${cartItemsCnt}`} checked={allSelect} name="allSelect" onChange={(e) => onAllSelect(e)} />
                            <button type="button" className={styles.delBtn} onClick={selectRemove}>선택삭제</button>
                        </div>
                        <div className={classNames(styles.tab, styles.productTab)}>
                            <div className={styles.productTitle}>
                                <h3 className={styles.tabTitle}>배송상품</h3>
                            </div>
                            <CartComponent mno={mno}
                            setSelectCnt={setSelectCnt}
                            setCartItemsCnt={setCartItemsCnt}
                            setAllSelect={setAllSelect}
                            allSelect={allSelect}
                            setSelectRemoveModal={setSelectRemoveModal}
                            selectRemoveModal={selectRemoveModal}
                            setTotalPrice={setTotalPrice}
                            setTotalSalePrice={setTotalSalePrice}
                            setSelCartItem={setSelCartItem}/>
                        </div>
                    </section>
                    <section className={styles.order}>
                        <div className={styles.stickyObj}>
                            <div className={classNames(styles.tab, styles.priceTab)}>
                                <h3 className={styles.tabTitle}>결제금액</h3>
                                <div className={styles.priceRow}>
                                    <span>상품금액</span>
                                    <span className={styles.price}>{addComma(totalPrice)}원</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span>상품할인금액</span>
                                    <span className={classNames(styles.price, styles.discount)}>-{addComma(totalPrice - totalSalePrice)}원</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span>배송비</span>
                                    <span className={styles.price}>{0}원</span>
                                </div>
                                <div className={styles.horLine}></div>
                                <div className={styles.priceRow}>
                                    <span>결제예정금액</span>
                                    <span className={styles.price}>{finalPrice}원</span>
                                </div>
                            </div>
                            <button className={styles.purchaseBtn} onClick={moveToPayment}>{finalPrice}원 주문하기</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}