import { useEffect, useState } from 'react';
import styles from './AddCartModalComponent.module.css';
import { getOne } from '../../api/productAPI';
import { addComma } from '../../hooks/useCustomString';
import { API_SERVER_HOST } from '../../api/hostAPI';

export const AddCartModalComponent = ({mno, modal, setModal, setCart}) => {
    
    const [ product, setProduct ] = useState([]);
    const [ option, setOption ] = useState([]);
    const [ cnt, setCnt ] = useState([]);
    const [ totalPrice, setTotalPrice ] = useState(0);

    useEffect(() => {
        if(modal.isOpen){
            getOne(modal.pno).then(data => {
                setProduct(data);
                setOption(data.optionDetail);
                
                setCnt(data.optionDetail.length > 1 ? data.optionDetail.map(() => 0) : data.optionDetail.map(() => 1));
            })
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [modal]);

    useEffect(() => {
        let total = 0;
        option.map((data, index) => {
            total += (data.od_price + Math.ceil((product.pPrice * (100 - product.pSalePer) / 100) * 100) / 100) * cnt[index];
        })
        setTotalPrice(total);
    }, [cnt])
    
    if(!modal.isOpen) return null;

    const onIncrease = (index, stock) => {
        const newCnt = [...cnt];
        if(newCnt[index] < stock){
            newCnt[index] = newCnt[index] + 1;
        }
        setCnt(newCnt);
    }
    
    const onDecrease = (index) => {
        const newCnt = [...cnt];
        if(newCnt[index] > 0){
            newCnt[index] = newCnt[index] - 1;
        }
        setCnt(newCnt);
    }

    const modalClose = () => {
        setModal(false);
        setProduct([]);
        setOption([]);
    }

    const onCartAdd = () => {
        const newCart = [];
        let check = false;
        cnt.map((i, index) =>
            {
                if(i !== 0){
                    newCart.push({mno : mno, odno: option[index].odno, c_cnt: i});
                    check = true;
                }
            }
        );
        if(check){
            setModal(false);
        }else{
            alert("최소 하나 이상 선택해야합니다.")
        }
        setCart(newCart);
    }

    const optionComponent = option.length !== 0 ?
        option.map((data, index) =>             
            <div className={styles.optionWrap}>
                <p className={styles.optionName}>
                    <span>{data.od_name}</span>
                    <span className={styles.optionPrice}> &#40; &#43; {addComma(data.od_price)} 원 &#41;</span>
                </p>
                <div className={styles.optionTotalWrap}>
                    <p className={styles.optionTotal}>{addComma((data.od_price + (Math.ceil((product.pPrice * (100 - product.pSalePer) / 100) * 100) / 100)) * cnt[index])} 원</p>
                    <div className={styles.alterWrap}>
                        <button className={styles.alterBtn} onClick={() => onDecrease(index)}>&#8722;</button>
                        <div className={styles.alterText}>{cnt[index]}</div>
                        <button className={styles.alterBtn} onClick={() => onIncrease(index, data.od_stock)}>&#43;</button>
                    </div>
                </div>
            </div>
        ) : <></>
    ; 

    return(
        <div className={styles.addCartModalWrap}>
            <div className={styles.bg} onClick={modalClose}></div>
            <div className={styles.addCartModalContent}>
                <div className={styles.productWrap}>
                    {product.productImage?.length > 0 ? (
                        <div className={styles.pImg}>
                            <img src={`${API_SERVER_HOST}/${product.productImage?.[0]?.pi_name}`} alt="상품 이미지"></img>
                        </div>
                    ) : (
                        <div className={styles.noImg}>이미지 없음</div>
                    )}
                    <div className={styles.title}>
                        <p className={styles.seller}>픽앤딜</p>
                        <p className={styles.pName}>{product.pName}</p>
                        <p className={styles.originalPrice}>{addComma(product.pPrice)}원</p>
                        <p className={styles.pPrice}>
                            <span className={styles.salesPer}>-{product.pSalePer}&#37;</span>
                            <span className={styles.afterPrice}>&nbsp;{addComma(Math.ceil((product.pPrice * (100 - product.pSalePer) / 100) * 100) / 100)}원</span>
                        </p>
                    </div>
                </div>
                {optionComponent}
                <div className={styles.priceWrap}>
                    <div className={styles.totalPrice}>합계</div>
                    <div className={styles.totalValue}>
                        <span className={styles.totalPriceNum}>{addComma(totalPrice)}</span>
                        <span>&nbsp;원</span>
                    </div>
                </div>
                <div className={styles.btnWrap}>
                    <button className={styles.cancleBtn} onClick={modalClose}>취소</button>
                    <button className={styles.submitBtn} onClick={onCartAdd}>장바구니 담기</button>
                </div>
            </div>
        </div>
    )
};