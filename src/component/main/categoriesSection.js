import styles from './categoriesSection.module.css';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getRandomCategories } from '../../api/categoriesAPI';
import { Skeleton, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { API_SERVER_HOST } from '../../api/hostAPI';
import { useCustomMove } from '../../hooks/useCustomMove';

const CategoriesSection = ({mno}) => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryCount] = useState(12); // 5개씩 2줄로 고정
  const { page, sort, keyword } = useCustomMove();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getRandomCategories(categoryCount, 3); // depth 3
        setCategories(data);
        //console.log(data);
      } catch (error) {
        console.error('카테고리 가져오기 오류: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryCount]);

  const handleCategoryClick = (category) => {
    
    let state = {
      selectedDepth: 3,
      categories: {
        depth1: category.superCate?.superCate,
        depth2: category.superCate,
        depth3: category,
      },
    };

    navigate('/product/list', { state });
  };

  if (loading) {
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
        <div className={styles.categoriesWrap}>
          {[...Array(categoryCount)].map((_, index) => (
            <div key={index} className={styles.categoryContainer}>
              <div className={styles.categoryText}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={80}
                  className={styles.superCategory}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={90}
                  className={styles.middleCategory}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={110}
                  className={styles.subCategory}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        <div className={styles.bar}></div>
        <h3 className={styles.titleText}>카테고리</h3>
        <Link to="/product/list" className={styles.showBtn}>
          전체 보기 <ArrowForwardIosRounded />
        </Link>
      </div>
      {categories && categories.length > 0 ? (
        <div className={styles.categoriesWrap}>
          {categories.map((category) => (
            <Button
              key={category.ctno}
              className={styles.categoryContainer}
              onClick={() => handleCategoryClick(category)}
              color="primary"
              sx={{
                backgroundColor: 'var(--color-faintgray)',
              }}
            >
              <div className={styles.imgContainer}>
                <img src={`${API_SERVER_HOST}/baby_1.jpg`} alt="Category" />
              </div>
              <div className={styles.categoryText}>
                <span className={styles.superCategory}>
                  {category.superCate?.superCate?.cateName}
                </span>
                <span className={styles.middleCategory}>
                  {category.superCate?.cateName}
                </span>
                <span className={styles.subCategory}>{category.cateName}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className={styles.noCategories}>
          카테고리를 불러올 수 없습니다.
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
