import { useEffect, useState } from 'react';
import {
  getSubCategories,
  getCategoriesByDepth,
} from '../../../api/categoriesAPI';
import styles from './depthSelect.module.css';
import { Button } from '@mui/material';

const DepthSelect = ({ depth, parentCategory, selectedValue, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let data;
        if (depth === 1) {
          data = await getCategoriesByDepth(1);
        } else if ((depth === 2 || depth === 3) && parentCategory !== 'all') {
          data = await getSubCategories(parentCategory);
        }
        setCategories(data || []);
      } catch (error) {
        console.error(`depth${depth} 카테고리 로딩 실패:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [depth, parentCategory]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.depthTitle}>
        {depth === 1 ? '대분류' : depth === 2 ? '중분류' : '세부 카테고리'} 선택
      </h3>
      <div className={styles.buttonGroup}>
        <Button
          variant={selectedValue === 'all' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onSelect('all')}
          className={styles.categoryButton}
        >
          전체 보기
        </Button>
        {categories.map((category) => (
          <Button
            key={category.ctno}
            variant={
              selectedValue === category.ctno.toString()
                ? 'contained'
                : 'outlined'
            }
            color="primary"
            onClick={() => onSelect(category.ctno.toString())}
            className={styles.categoryButton}
          >
            {category.cateName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DepthSelect;
