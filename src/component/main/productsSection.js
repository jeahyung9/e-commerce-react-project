import { useNavigate } from 'react-router-dom';
import styles from './productsSection.module.css';
import { ArrowBackIosOutlined, ArrowForwardIosRounded } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { getList } from '../../api/productAPI';
import { getMember } from '../../api/MemberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import ProductItem from '../product/ProductItem';

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ProductsSection = ({ title, sortOption, size, mno }) => {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(initState);
  const [loading, setLoading] = useState(true);
  const [itemsPerRow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ member, setMember ] = useState();
  const { isLogin, loginState } = useCustomLogin();
  const wrapRef = useRef(null);
  const groupRefs = useRef([]);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if(isLogin){
      if(loginState.email){
        getMember(loginState.email).then(data => {
          setMember(data);
        });
      }
    }else{
      setMember(0);
    }
    
  }, [isLogin]);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const data = await getList([1, size], sortOption);
        //console.log(data);
        setServerData(data);
      } catch (error) {
        console.error(`Error fetching data for ${title}: `, error);
        setServerData(initState);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [size, sortOption, title]);

  const handleMenuClick = (sort) => {
    const state = {
      menu: true,
      sortBy: sort,
    };

    navigate('/product/list', { state });
  }

  const handleScroll = () => {
    if (isScrollingRef.current) return;
    if (wrapRef.current) {
      const wrap = wrapRef.current;
      const newIndex = groupRefs.current.findIndex(
        (group) => group && group.offsetLeft >= wrap.scrollLeft
      );
      setCurrentIndex(newIndex);
      console.log(currentIndex);
    }
  };

  const scrollRight = () => {
    if (wrapRef.current) {
      isScrollingRef.current = true;
      const wrap = wrapRef.current;
      const maxIndex = groupRefs.current.length - 1;
      const nextIndex = Math.min(currentIndex + 1, maxIndex);
      const nextScrollPosition = groupRefs.current[nextIndex].offsetLeft;
      wrap.scrollTo({ left: nextScrollPosition, behavior: 'smooth' });
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  const scrollLeft = () => {
    if (wrapRef.current) {
      isScrollingRef.current = true;
      const wrap = wrapRef.current;
      let prevIndex = currentIndex - 1;
      if (groupRefs.current[prevIndex] && groupRefs.current[prevIndex].offsetLeft >= wrap.scrollLeft) {
        prevIndex = currentIndex - 1;
      }
      prevIndex = Math.max(prevIndex, 0);
      const prevScrollPosition = groupRefs.current[prevIndex].offsetLeft;
      wrap.scrollTo({ left: prevScrollPosition, behavior: 'smooth' });
      setCurrentIndex(prevIndex);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  if (loading)
    return (
      <section className={styles.section}>
        <div className={styles.title}>
          <div className={styles.bar}></div>
          <Skeleton
            className={styles.titleText}
            variant="text"
            animation="wave"
            width={160}
          />
          <Skeleton
            className={styles.showBtn}
            variant="text"
            animation="wave"
            width={60}
          />
        </div>
        <div className={styles.productsWrap}>
          <div className={styles.productsSlider}>
            <div
              className={styles.productsGroup}
              style={{
                gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
              }}
            >
              {[...Array(itemsPerRow)].map((_, index) => (
                <div key={index} className={styles.productContainer}>
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={200}
                    className={styles.imgWrap}
                  />
                  <div className={styles.productText}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width="80%"
                      height={24}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width="60%"
                      height={24}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width="40%"
                      height={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        <div className={styles.bar}></div>
        <h3 className={styles.titleText}>{title}</h3>
        <div 
          onClick={() => handleMenuClick(title === "픽앤딜 베스트" ? "p_salesVol" : title === "신상품" ? "pno" : "")} 
          className={styles.showBtn}
        >
          <span>전체 보기</span>
          <ArrowForwardIosRounded />
        </div>
      </div>
      {serverData && serverData.dtoList && serverData.dtoList.length !== 0 ? (
        <div className={styles.productsContainer}>
          <div className={styles.productsWrap} ref={wrapRef} onScroll={handleScroll}>
            <div className={styles.productsSlider}>
              {Array.from({
                length: Math.ceil(serverData.dtoList.length / itemsPerRow),
              }).map((_, groupIndex) => {
                const startIndex = groupIndex * itemsPerRow;
                const groupProducts = serverData.dtoList.slice(
                  startIndex,
                  startIndex + itemsPerRow
                );

                return (
                  <div
                    key={groupIndex}
                    ref={(el) => (groupRefs.current[groupIndex] = el)}
                    className={styles.productsGroup}
                    style={{
                      gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
                    }}
                  >
                    {groupProducts.map((product) => (
                      <div className={styles.itemWrap}>
                        <ProductItem key={product.pno} product={product} mno={mno} />
                      </div>
                    ))}
                    {groupProducts.length < itemsPerRow &&
                      groupIndex ===
                        Math.ceil(serverData.dtoList.length / itemsPerRow) -
                          1 && (
                        <div
                          className={styles.productContainer}
                          style={{ gridColumn: itemsPerRow }}
                        >
                          <div
                            onClick={() => handleMenuClick(title === "픽앤딜 베스트" ? "p_salesVol" : title === "신상품" ? "pno" : "")}
                            className={styles.moreBtn}>
                            <div className={styles.moreBtnGrad}>
                              <p>
                                <span>더보기</span>
                                <ArrowForwardIosRounded />
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.slideButtonLeft} onClick={scrollLeft}>
            <ArrowBackIosOutlined />
          </div>
          <div className={styles.slideButtonRight} onClick={scrollRight}>
            <ArrowForwardIosRounded />
          </div>
        </div>
      ) : (
        <div className={styles.noProducts}>상품을 불러올 수 없습니다.</div>
      )}
    </section>
  );
};

export default ProductsSection;
