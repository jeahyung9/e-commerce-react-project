import { useNavigate, useParams } from 'react-router-dom';
import { ReviewComponent } from '../../../component/review/ReviewComponent';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { getOne } from '../../../api/productAPI';
import { getReviewCnt } from '../../../api/reviewAPI';
import { addComma } from '../../../hooks/useCustomString';
import { IconButton, FormControl, Select, MenuItem, Button } from '@mui/material';
import { ShareOutlined, FavoriteBorderRounded, FavoriteRounded, ShoppingCartRounded } from '@mui/icons-material';
import styles from './ProductDetail.module.css';
import { addWishList, checkWishList, deleteWishList } from '../../../api/wishListAPI';
import useCustomLogin from '../../../hooks/useCustomLogin';
import { addCartItem, getCartItems } from '../../../api/cartAPI';
import { getQAList } from '../../../api/productQAAPI';
import { ProductQAComponent } from '../../../component/qa/ProductQAComponent';
import { getCookie } from '../../../util/cookieUtil';
import { API_SERVER_HOST } from '../../../api/hostAPI';
import { useAppContext } from '../../../context/Context';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { pno } = useParams();
  const { isLogin, loginState } = useCustomLogin();
  const [product, setProduct] = useState({productImage:[],});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [ wno, setWno ] = useState();
  const [ checkWish, setCheckWish ] = useState(false);
  const [currentSection, setCurrentSection] = useState('info');
  const infoRef = useRef();
  const infoDetailedRef = useRef();
  const reviewRef = useRef();
  const productMenuRef = useRef();
  const qaRef = useRef();
  const [ reviewCnt, setReviewCnt ] = useState(0);
  const mno = getCookie("member")?.mno;
  const [ isCopied, setIsCopied ] = useState(false);
  const { setCartCnt } = useAppContext();

  useEffect(() => {
    console.log(mno);
  }, [mno])

  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
    });
    getQAList(pno, [1, 10]).then(data => {
      console.log(data);
    });
    getReviewCnt(pno).then(data => {
      setReviewCnt(data)
    });
  }, [pno]);

  useEffect(() => {
    if(mno){
      checkWishList(mno, pno).then(data => {
        setWno(data);
        if(data){
          setCheckWish(true);
        }else{
          setCheckWish(false);
        }
      });
    }
  }, [mno, checkWish]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      if (!infoRef.current || !infoDetailedRef.current || !reviewRef.current || !productMenuRef.current || !qaRef.current) {
        return;
      }
      
      const infoOffset = infoRef.current.offsetTop - productMenuRef.current.offsetHeight - 60;
      const detailedOffset = infoDetailedRef.current.offsetTop - productMenuRef.current.offsetHeight - 60;
      const reviewOffset = reviewRef.current.offsetTop - productMenuRef.current.offsetHeight - 60;
      const qaOffset = qaRef.current.offsetTop - productMenuRef.current.offsetHeight - 60;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= qaOffset) {
        setCurrentSection('qa');
      } else if (scrollPosition >= reviewOffset) {
        setCurrentSection('review');
      } else if (scrollPosition >= detailedOffset) {
        setCurrentSection('detailed');
      } else if (scrollPosition >= infoOffset) {
        setCurrentSection('info');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAddWishList = () => {
    if(isLogin){
      if(wno){
        alert("찜이 취소되었습니다.");
        deleteWishList(wno, mno);
        setCheckWish(false);
      }else{
        addWishList(mno, pno);
        alert("찜이 등록되었습니다.");
        setCheckWish(true);
      }
    }else{
      alert("로그인 이후에 이용 가능합니다.")
    }
  }
  
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (e.target.parentNode) {
      e.target.parentNode.className = styles.noImg;
      e.target.parentNode.innerText = '이미지 없음';
    }
  }

  const handleChange = (e) => {
    const selectedOption = {...product.optionDetail.find((data) => data.od_name === e.target.value), pno: product.pno, mno: mno};
    
    addOrUpdateOption(selectedOption);
  };

  const addOrUpdateOption = (option) => {
    setSelectedOptions((prevOptions) => {
      const existingOption = prevOptions.find((opt) => opt.odno === option.odno);
      if (!existingOption){
        return [...prevOptions, { ...option, c_cnt: 1 }];
      }else{
        return prevOptions;
      }
    });
  };

  const handleRemoveOption = (optionName) => {
    setSelectedOptions((prevOptions) => prevOptions.filter((option) => option.od_name !== optionName));
  };

  const handleClickScroll = (section) => {
    const sectionRef = {
      info: infoRef,
      detailed: infoDetailedRef,
      review: reviewRef,
      qa: qaRef,
    }[section];

    window.scrollTo({
      top: sectionRef.current.offsetTop - productMenuRef.current.offsetHeight - 58,
    });

    setCurrentSection(section);
  };

  const incrementQuantity = (odno) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((opt) =>
        opt.odno === odno ? { ...opt, c_cnt: opt.c_cnt + 1 } : opt
      )
    );
  };

  const decrementQuantity = (odno) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((opt) =>
        opt.odno === odno && opt.c_cnt > 1 ? { ...opt, c_cnt: opt.c_cnt - 1 } : opt
      )
    );
  };

  const onCartAdd = () => {
    const newCart = [];
    let check = false;
    console.log(selectedOptions);
    if(isLogin){
      if(selectedOptions.length !== 0){
        Promise.all(selectedOptions.map(item => addCartItem(item))).then(() => 
        getCartItems(mno).then(data => {
          setCartCnt(data.length);
          })
        );
        // selectedOptions.map(item => addCartItem(item));
        // setSelectedOptions([]);
      }else{
        alert("하나 이상 옵션을 선택해 주세요.");
      }
    }else{
      alert("로그인 이후에 이용 가능합니다.");
      navigate("../../member/login");
    }
  }

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }).catch(err => {
      console.error('주소 복사 실패:', err);
    });
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.productIntro}>
          {product.productImage.length === 0 ? (
              <div className={styles.noImg}>이미지 없음</div>
            ) : (
            <div className={styles.productImgWrap}>
              <img
                src={`https://pickdeal-image.s3.ap-northeast-2.amazonaws.com/product/${product.productImage[0]?.pi_name}`}
                alt="이미지"
                className={styles.productImg}
                onError={handleImageError}
                />
            </div>
            )}
          <div className={styles.productInfo}>
            <div className={styles.productInfoTop}>
              <h2 className={styles.pNameTopWrap}>
                <h2 className={styles.productName}>{product.pName}</h2>
                <div className={styles.shareIconWrap}>
                  <IconButton className={styles.productShare} onClick={!isCopied ? handleShareClick : null}>
                    <ShareOutlined />
                  </IconButton>
                  <div className={classNames(styles.copiedMsg, {[styles.copied]: isCopied})}>
                    <div className={styles.pointer}></div>
                    <p>링크가 복사되었습니다.</p>
                  </div>
                </div>
              </h2>
              <div className={styles.productPrice}>
                {product.pSalePer !== 0 &&
                  <p className={styles.beforePrice}>
                    <span className={styles.priceNum}>{addComma(product.pPrice)}</span>
                    <span className={styles.won}>원</span>
                  </p>
                }
                {product.pSalePer !== 0 ?
                  <p className={styles.afterPrice}>
                    <span className={styles.salePer}>{product.pSalePer}%</span>
                    <span className={styles.priceNum}>{addComma(Math.ceil((product.pPrice * ((100 - product.pSalePer) / 100)) / 10) * 10)}</span>
                    <span className={styles.won}>원</span>
                  </p>
                :
                  <p className={styles.afterPrice}>
                    <span className={styles.priceNum}>{addComma(product.pPrice)}</span>
                    <span className={styles.won}>원</span>
                  </p>
                }
              </div>
            </div>
            <div className={styles.productInfoBottom}>
              <div className={styles.infoRow}>
                <p className={styles.title}>상품 소개</p>
                <p className={styles.content}>{product.pContent}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.title}>판매자</p>
                <p className={styles.content}>{product.businessName}</p>
              </div>
              <div className={classNames(styles.infoRow, styles.selectRow)}>
                <p className={styles.title}>옵션 선택</p>
                <div className={styles.optionWrap}>
                  <FormControl
                    fullWidth
                    color="primary"
                    className={styles.optionSelectBox}
                  >
                    <Select
                      id="optionSelect"
                      displayEmpty
                      onChange={handleChange}
                      value={""}
                    >
                      <MenuItem
                        value=""
                        disabled="disabled"
                        hidden="hidden"
                        selected="selected"
                      >
                        옵션 선택
                      </MenuItem>
                      {
                        product.optionDetail?.map((data) => (
                          <MenuItem
                            key={data.odno}
                            value={data.od_name}
                          >
                            <p className={styles.optionName}>{data.od_name} ( + {addComma(data.od_price)} 원)&nbsp;</p>
                            <p className={styles.optionPrice}>
                              <span className={styles.beforePrice}>{addComma((data.od_price + product.pPrice))}원</span>
                              <span className={styles.afterPrice}> {addComma((data.od_price + Math.ceil((product.pPrice * ((100 - product.pSalePer) / 100)) / 10) * 10))}원</span>
                            </p>
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
              {selectedOptions?.map((option) => (
                <div className={styles.optionRow} key={option.od_name}>
                  <div className={styles.optionCard}>
                    <div className={styles.optionCardHeader}>
                      <p className={styles.optionCardTitle}>{option.od_name} ( + {addComma(option.od_price)} 원 )</p>
                      <Button
                        variant="text"
                        disableElevation
                        size="small"
                        color="primary"
                        className={styles.removeButton}
                        onClick={() => handleRemoveOption(option.od_name)}
                      >
                        선택 취소
                      </Button>
                    </div>
                    <div className={styles.optionCardBody}>
                      <div className={styles.quantityControl}>
                        <Button
                          color="primary"
                          className={styles.quantityBtn}
                          onClick={() => decrementQuantity(option.odno)}
                        >
                          -
                        </Button>
                        <span className={styles.quantity}>{option.c_cnt}</span>
                        <Button
                          color="primary"
                          className={styles.quantityBtn}
                          onClick={() => incrementQuantity(option.odno)}
                        >
                          +
                        </Button>
                      </div>
                      <p className={styles.optionCardPrice}>
                        <span className={styles.beforePrice}>{addComma((option.od_price + product.pPrice) * option.c_cnt)} 원</span>
                        <span>&nbsp;</span>
                        <span className={styles.afterPrice}>{addComma((option.od_price + Math.ceil((product.pPrice * ((100 - product.pSalePer) / 100)) / 10) * 10) * option.c_cnt)} 원</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.buttonContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={checkWish ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                  className={styles.likeBtn}
                  onClick={handleAddWishList}
                >
                  찜하기
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartRounded />}
                  className={styles.cartBtn}
                  onClick={onCartAdd}
                >
                  장바구니에 담기
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.productMenu} ref={productMenuRef}>
          <div
            onClick={() => handleClickScroll('info')}
            className={classNames(
              styles.productMenuBtn,
              {[styles.active]: currentSection === 'info'},
            )}
          >
            상품정보
          </div>
          <div
            onClick={() => handleClickScroll('detailed')}
            className={classNames(
              styles.productMenuBtn,
              {[styles.active]: currentSection === 'detailed'},
            )}
          >
            상품상세
          </div>
          <div
            onClick={() => handleClickScroll('review')}
            className={classNames(
              styles.productMenuBtn,
              {[styles.active]: currentSection === 'review'},
            )}
          >
            리뷰&nbsp;
            <span className={styles.reviewCnt}>&#40; {reviewCnt} &#41;</span>
          </div>
          <div
            onClick={() => handleClickScroll('qa')}
            className={classNames(
              styles.productMenuBtn,
              {[styles.active]: currentSection === 'qa'},
            )}
          >
            문의
          </div>
        </div>
        <div className={styles.productDetails}>
          <div
            ref={infoRef}
            className={styles.productInfoImgWrap}
          >
            <img
              src=""
              alt="상품정보"
              onError={handleImageError}
              className={styles.productInfoImg}
            />
          </div>
          <div
            ref={infoDetailedRef}
            className={styles.productInfoDetailed}
          >
            <img src="" alt="상품상세" onError={handleImageError} className={styles.productInfoDetailedImg} />
          </div>
          <div
            ref={reviewRef}
            className={styles.productReview}
          >
            <ReviewComponent pno={pno}/>
          </div>
          <div
            ref={qaRef}
            className={styles.productQA}
          >
            <ProductQAComponent pno={pno} mno={mno}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
