import { useEffect, useState } from "react"
import { changeCartItem, deleteCartItem, getCartItems } from "../../api/cartAPI"
import styles from "./CartComponent.module.css";
import { RemoveModalComponent } from "../modal/RemoveModalComponent";
import { API_SERVER_HOST } from "../../api/hostAPI";
import { addComma } from "../../hooks/useCustomString";
import Checkbox from "../checkbox/checkbox";
import { useAppContext } from "../../context/Context";

export let selectCnt = 0;

export const CartComponent = ({mno, setSelectCnt, setCartItemsCnt, setAllSelect, allSelect, setSelectRemoveModal, selectRemoveModal, setTotalPrice, setTotalSalePrice, setSelCartItem}) => {
    const [ cart, setCart ] = useState([]);
    const [ soldOutCart, setSoldOutCart ] = useState([]);
    const [ modal, setModal ] = useState({isOpen: false});
    const [ removeCino, setRemoveCino ] = useState([]);
    const [ itemSelect, setItemSelect ] = useState([]);
    const [ isRemove, setIsRemove ] = useState(false);
    const { setCartCnt } = useAppContext();

    useEffect(() => {
        if(mno){
            getCartItems(mno).then(data => {
                console.log(data);
                // data.map(item => {
                //     item.od_stock === 0 ?
                //     setSoldOutCart(prev => [...prev, item])
                //     : setCart(prev => [...prev, item]);
                // })
                setCart(data);
                setItemSelect(data.map(item => item.cino));
            });
        }
    }, [mno]);

    useEffect(() => {
        console.log(cart);
        
        let totalPrice = 0;
        let totalSalePrice = 0;
        let array = [];
        cart.map(item => {
            changeCartItem(item);
            if(itemSelect.includes(item.cino)){
                totalPrice += ((item.p_price + item.od_price) * item.c_cnt);
                totalSalePrice += Math.ceil((item.c_cnt * ((item.p_price * ((100 - item.p_salePer) / 100)) + item.od_price)) / 10) * 10;
                
                array.push(item);
            }
        })
        setSelCartItem(array);
        setTotalPrice(totalPrice);
        setCartItemsCnt(cart.length);
        setTotalSalePrice(totalSalePrice);
    }, [cart]);

    useEffect(() => {
        console.log(soldOutCart);
        
    }, [soldOutCart]);

    useEffect(() => {
        let totalPrice = 0;
        let totalSalePrice = 0;
        let array = [];
        setSelectCnt(itemSelect.length);
        if(itemSelect.length === cart.length){
            setAllSelect(true);
        }else{
            setAllSelect(false);
        }
        cart.map(item => {
            if(itemSelect.includes(item.cino)){
                totalPrice += ((item.p_price + item.od_price) * item.c_cnt);
                totalSalePrice += Math.ceil((item.c_cnt * ((item.p_price * ((100 - item.p_salePer) / 100)) + item.od_price)) / 10) * 10;
                array.push(item);
            }
        })
        
        setSelCartItem(array);
        setTotalPrice(totalPrice);
        setTotalSalePrice(totalSalePrice);
    }, [itemSelect]);

    useEffect(() => {
        if(allSelect){
            setItemSelect(cart.map(item => item.cino));
        }else{
            if(itemSelect.length === cart.length){
                setItemSelect([]);
            }
        }
    }, [allSelect])

    useEffect(() => {
        if(selectRemoveModal){
            setModal({isOpen: true});
            setRemoveCino(itemSelect)
        }
    }, [selectRemoveModal])

    useEffect(() => {
        if(isRemove){
            removeItem();
        }
    }, [isRemove])

    const onItemSelect = (cino, e) => {
        if(e.target.checked){
            setItemSelect(prev => [...prev, cino]);
        }else{
            setItemSelect(prev => prev.filter(item => item !== cino));
        }
    }

    const onIncrease = (cino, cnt, stock) => {
        if(cnt < stock){
            setCart(prevCart => prevCart.map(i => 
                i.cino === cino ? {...i, c_cnt: i.c_cnt + 1} : i
            ));
        }else{
            alert("최대수량입니다.")
        }
    };

    const onDecrease = (cino, cnt) => {

        if(cnt === 1){
            setModal({isOpen: true})
            setRemoveCino([cino]);
            return;
        }

        setCart(prevCart => prevCart.map(i => 
            i.cino === cino ? {...i, c_cnt: i.c_cnt - 1} : i
        ));
    }

    //모달 이벤트
    const onRemove = (cino) => {
        setModal({isOpen: true});
        setRemoveCino([cino]);
    }

    const removeItem = () => {
        if(mno){
            Promise.all(removeCino.map(i => {
                return deleteCartItem(i, mno).then(data => {
                    setItemSelect(prev => prev.filter(item => item !== i));
                    return data;
                });
            })).then(data => {
                console.log(data);
                if(data[data.length - 1].length !== 0){
                    setCart(data[data.length - 1]);
                }else{
                    setCart([]);
                }
                getCartItems(mno).then(data => {
                    setCartCnt(data.length);
                });
                setModal({isOpen: false});
                setIsRemove(false);
                setSelectRemoveModal(false);
            });
        }else{
            alert("로그인이 필요합니다.");
        }
    }

    //카트 목록 출력
    const cartItems = cart.length !== 0 ?
        cart.map((data) => (
            data.c_cnt !== 0 ?
            (<div className={styles.productCard}>
                <div className={styles.btnRow}>
                    <Checkbox checked={itemSelect.includes(data.cino)} onChange={(e) => onItemSelect(data.cino, e)} />
                    {/* <input type="checkbox" checked={itemSelect.includes(data.cino)} onChange={(e) => onItemSelect(data.cino, e)}></input> */}
                    <button type="button" className={styles.removeBtn} onClick={() => onRemove(data.cino)}>&#215;</button>
                </div>
                <div className={styles.cardInner}>
                    <div className={styles.seller}>{data.businessName}</div>
                    <div className={styles.pOpt}>{data.od_name}</div>
                    <div className={styles.pName}>{data.p_name}</div>
                    <div className={styles.pImgSelect}>
                        <div className={styles.pImg}>
                            <img src={`${API_SERVER_HOST}/${data.pi_name}`} alt="상품 이미지"></img>
                        </div>
                        <div className={styles.pSelect}>
                            <div className={styles.pPrice}>
                                {
                                    data.p_salePer !== 0 ?
                                    <>
                                        <span className={styles.dPrice}>
                                            {addComma(Math.ceil((data.c_cnt * ((data.p_price * ((100 - data.p_salePer) / 100)) + data.od_price)) / 10) * 10)}원
                                        </span>
                                        <span className={styles.oPrice}>{addComma(Math.ceil(data.c_cnt * (data.p_price + data.od_price) / 10) * 10)}원</span>
                                    </>
                                    :
                                    <span className={styles.dPrice}>
                                            {addComma(Math.ceil((data.c_cnt * ((data.p_price * ((100 - data.p_salePer) / 100)) + data.od_price)) / 10) * 10)}원
                                    </span>
                                }
                            </div>
                            <div className={styles.alterCnt}>
                                <button type="button" onClick={() => onDecrease(data.cino, data.c_cnt)}>&#8722;</button>
                                <div className={styles.pCount}>{data.c_cnt}</div>
                                <button type="button" onClick={() => onIncrease(data.cino, data.c_cnt, data.p_stock)}>&#43;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
            : <></>))
        : <div className={styles.noProduct}>장바구니에 담긴 상품이 없습니다.</div>
    ;
    
    return (
        <>
            {cartItems}
            <RemoveModalComponent modal={modal} setModal={setModal} setIsRemove={setIsRemove} setSelectRemoveModal={setSelectRemoveModal}/>
        </>
    )
}