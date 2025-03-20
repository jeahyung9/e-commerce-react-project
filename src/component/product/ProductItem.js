import { Link, useNavigate } from 'react-router-dom';
import styles from './ProductItem.module.css';
import { ChatBubbleOutline, ShoppingCartOutlined } from '@mui/icons-material';
import { Button, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { getReviewCnt } from '../../api/reviewAPI';
import { AddCartModalComponent } from '../modal/AddCartModalComponent';
import { addCartItem, getCartItems } from '../../api/cartAPI';
import { API_SERVER_HOST } from '../../api/hostAPI';
import { addComma } from '../../hooks/useCustomPrice';
import { getCookie } from '../../util/cookieUtil';
import { useAppContext } from '../../context/Context';

const ProductItem = ({ product, loading }) => {
  const navigate = useNavigate();
  const [ addCartModal, setAddCartModal ] = useState({isOpen : false, mno: 0, pno: 0});
  const [ cart, setCart ] = useState([]);
  const [ reviewCnt, setReviewCnt ] = useState(0);
  const mno = getCookie("member")?.mno;
  const { setCartCnt } = useAppContext();

  useEffect(() => {
    getReviewCnt(product.pno).then(data => setReviewCnt(data));
  }, [product]);
  
  useEffect(() => {
    if(cart.length !== 0){
      Promise.all(cart.map(item => addCartItem(item))).then(() => 
        getCartItems(mno).then(data => {
          setCartCnt(data.length);
        })
      );
    }
  }, [cart]);

  const addClick = () => {
    if(mno) {
      setAddCartModal({isOpen: true, mno: mno, pno: product.pno});
    } else {
      alert("로그인 후 이용");
      navigate("/member/login");
      return;
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.parentNode.className = styles.noImg;
    e.target.parentNode.innerText = '이미지 없음';
  }

  return (
    <div className={styles.productCard}>
      {loading ? (
        <div className={styles.productContainer}>
          <Skeleton
            sx={{
              height: 250,
            }}
            variant="rounded"
            animation="wave"
          />
          <div className={styles.productText}>
            <Skeleton
              sx={{
                fontSize: 30,
                width: 200,
              }}
              animation="wave"
            />
            <Skeleton
              sx={{
                fontSize: 24,
                width: 100,
              }}
              animation="wave"
            />
            <Skeleton
              sx={{
                fontSize: 24,
                width: 70,
              }}
              animation="wave"
            />
          </div>
        </div>
      ) : (
        <Link
          to={`/product/${product.pno}`}
          key={product.pno}
          className={styles.productContainer}
        >
          <div className={styles.imgWrap}>
            {product.productImage.length === 0 ? (
              <div className={styles.noImg}>이미지 없음</div>
            ) : (
              <div className={styles.imgBox}>
                <img className={styles.img} src={`${API_SERVER_HOST}/${product.productImage[0]?.pi_name}`} alt={product.productImage[0]?.pi_name} onError={handleImageError} />
              </div>
            )}
            <Button
              variant="outlined"
              startIcon={<ShoppingCartOutlined />}
              size="medium"
              sx={{
                fontSize: 14,
                backgroundColor: 'var(--color-white)',
              }}
              color="primary"
              className={styles.cartBtn}
              onClick={(e) => {
                e.preventDefault();
                addClick();
              }}
            >
              담기
            </Button>
          </div>
          <div className={styles.productText}>
            <div className={styles.pName}>{product.pName}</div>
            <div className={styles.pPrice}>
              {product.pSalePer > 0 ? (
                <>
                  <p className={styles.oPrice}>
                    {addComma(product.pPrice)}원
                  </p>
                  <p className={styles.dPrice}>
                    <span className={styles.discount}>-{product.pSalePer}%</span>
                    <span className={styles.final}>
                      {addComma(Math.ceil((product.pPrice * ((100 - product.pSalePer) / 100)) / 10) * 10)}원
                    </span>
                  </p>
                </>
              ) : (
                <p className={styles.final}>{product.pPrice.toLocaleString()}원</p>
              )}
            </div>
            <div className={styles.review}>
              <ChatBubbleOutline className={styles.reviewIcon} />
              <span>리뷰 {reviewCnt}</span>
            </div>
          </div>
        </Link>
      )}
      {mno ?
        <AddCartModalComponent mno={mno} modal={addCartModal} setModal={setAddCartModal} setCart={setCart}/> :
        <></>
      }
    </div>
  );
};

export default ProductItem;
