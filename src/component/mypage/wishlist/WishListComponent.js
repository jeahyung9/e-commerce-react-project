import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishList, deleteWishList } from "../../../api/wishListAPI";
import styles from './WishListComponent.module.css';
import MyPageContainer from "../MyPageContainer";
import { RemoveModalComponent } from "../../modal/RemoveModalComponent";
import { AddCartModalComponent } from "../../modal/AddCartModalComponent";
import { addCartItem } from "../../../api/cartAPI";
import { useLocation } from "react-router-dom";
import useCustomLogin from "../../../hooks/useCustomLogin";
import { addComma } from "../../../hooks/useCustomPrice";
import { Button } from "@mui/material";
import { ReactComponent as Heart } from "../../../assets/icon/heart.svg";
import { getCookie } from "../../../util/cookieUtil";
import { API_SERVER_HOST } from "../../../api/hostAPI";
import { getOne } from "../../../api/productAPI";

const WishListComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLogin } = useCustomLogin();
    const mno = getCookie("member")?.mno;
    const [ wishList, setWishList ] = useState([]);
    const [ removeModal, setRemoveModal] = useState({isOpen: false});
    const [ addCartModal, setAddCartModal ] = useState({isOpen : false, mno: 0, pno: 0});
    const [ cart, setCart ] = useState([]);
    const [ isRemove, setIsRemove ] = useState(false);
    const [ wno, setWno ] = useState(0);
    const [ product, setProduct ] = useState([]);

    useEffect(() => {
        if(isLogin){
        }else{
            alert("로그인 후 이용");
        }
    }, [isLogin])

    useEffect(() => {
        console.log(mno);

        if(mno){
            getWishList(mno).then(data => {
                setWishList(data);
            })
        }
        
    }, [mno])

    useEffect(() => {
        console.log(wishList);
        const products = [];
        if(wishList){
            const productPromises = wishList.map(data => getOne(data.pno));
            
            Promise.all(productPromises).then(products => {
                setProduct(products);
            });
        }
    }, [wishList])

    useEffect(() => {
        console.log(product);
        if(product){
            console.log(product[0]);
        }
    }, [product])

    useEffect(() => {
        if(isRemove){
            removeWish();
        }
    }, [isRemove])

    useEffect(() => {
        //console.log(cart);
        if(cart.length !== 0){
            cart.map(item => addCartItem(item));
        }
    }, [cart]);

    const handleClickProduct = (pno) => {
        navigate('/product/' + pno);
    }

    const removeClick = (wno) => {
        setRemoveModal({isOpen: true})
        setWno(wno);
    }

    const removeWish = () => {
        deleteWishList(wno, mno).then(data => {
            setWishList(data);
        })
        setRemoveModal({isOpen: false});
    }

    const addClick = (mno, pno) => {
        setAddCartModal({isOpen: true, mno, pno});
    }

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.parentNode.className = styles.noImg;
        e.target.parentNode.innerText = '이미지 없음';
    }

    const list = wishList.length !== 0 ? 
        wishList.map((data, index) => 
            (<div className={styles.wishWrap}>
                <div onClick={() => handleClickProduct(data.pno)} className={styles.pImg}>
                    {
                        product[index]?.productImage.length === 0 ?
                        (<div className={styles.noImg}>이미지 없음</div>)
                        :
                        (<img src={`${API_SERVER_HOST}/${product[index]?.productImage[0]?.pi_name}`} alt="상품 이미지" onError={handleImageError}></img>)
                    }
                </div>
                <div className={styles.textBtnWrap}>
                    <div onClick={() => handleClickProduct(data.pno)} className={styles.productText}>
                        <p className={styles.pName}>{data.p_name}</p>
                        <p className={styles.oPrice}>{addComma(data.p_price)}원</p>
                        <p className={styles.dPrice}>
                            <span className={styles.discount}>{data.p_salePer}%</span>
                            <span className={styles.final}>&nbsp;{addComma(Math.ceil((data.p_price * ((100 - data.p_salePer) / 100)) / 10) * 10)}원</span>
                        </p>
                    </div>
                    <div className={styles.btnWrap}>
                        <Button fullWidth color="textDarkgray" variant="outlined" onClick={() => removeClick(data.wno, data.mno)}>삭제</Button>
                        <Button fullWidth variant="outlined" onClick={() => addClick(data.mno, data.pno)}>담기</Button>
                    </div>
                </div>
            </div>
            )
        ) : (
            <div className={styles.noWish}>
                <div className={styles.wishIcon}>
                    <Heart />
                </div>
                <p className={styles.noWishText}>찜한 상품이 없습니다.</p>
            </div>
        );

    return(
        <MyPageContainer>
            <div className={styles.wishListWrap}>
                <h2 className={styles.wishListTitle}>찜한 상품</h2>
                <p className={styles.wishCnt}>
                    <span>전체&nbsp;&nbsp;</span>
                    <span className={styles.coloredText}>{wishList.length}</span>
                    <span>&nbsp;개</span>
                </p>
                {list}
            </div>
            <RemoveModalComponent modal={removeModal} setModal={setRemoveModal} setIsRemove={setIsRemove}/>
            <AddCartModalComponent mno={mno} modal={addCartModal} setModal={setAddCartModal} setCart={setCart}/>
        </MyPageContainer>
    )
}

export default WishListComponent;