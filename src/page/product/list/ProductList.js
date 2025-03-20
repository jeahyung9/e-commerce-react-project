import VisualBanner from '../../../component/visual/visualBanner';
import foodImg from '../../../assets/img/KFood.png';
import styles from './ProductsList.module.css';
import DepthSelect from '../../../component/product/category/depthSelect';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getList } from '../../../api/productAPI';
import ShowProducts from '../../../component/product/showProducts';
import { useCustomMove } from '../../../hooks/useCustomMove';
import { Divider } from '@mui/material';
import { getCookie } from '../../../util/cookieUtil';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDepth1, setSelectedDepth1] = useState('all');
  const [selectedDepth2, setSelectedDepth2] = useState('all');
  const [selectedDepth3, setSelectedDepth3] = useState('all');
  const { page, size, sort } = useCustomMove();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ check,setCheck ] = useState(false);
  const mno = getCookie("member")?.mno;
  const menu = location.state?.menu;
  const sortBy = location.state?.sortBy || sort;
  const keyword = location.state?.keyword;

  // 선택된 카테고리에 따라 상품 목록 가져오기
  const fetchProducts = async (categoryId) => {
    setLoading(true);
    console.log(sort);
    console.log(categoryId);
    console.log(page);
    try {
      const data = await getList([page, 40, sort], {sort:sort, ctno:categoryId, keyword: keyword});
      console.log(data);
      
      setProducts(data);
    } catch (error) {
      console.error('상품 목록 로딩 실패:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategoryId = useCallback(() => {
    if (selectedDepth3 !== 'all') {
      return selectedDepth3;
    };
    if (selectedDepth2 !== 'all') {
      return selectedDepth2;
    };
    if (selectedDepth1 !== 'all') {
      return selectedDepth1;
    };
    
    return null;
  }, [selectedDepth1, selectedDepth2, selectedDepth3]);

  useEffect(() => {
    console.log(products);
    console.log(location.state);
    
  }, [products])

  // 카테고리 선택이 변경될 때마다 상품 목록 업데이트
  useEffect(() => {
    const categoryId = getSelectedCategoryId();
    console.log(categoryId);
    
    if(categoryId){
      fetchProducts(categoryId);
    }else if(check){
      fetchProducts(categoryId);
    }else if(menu){
      fetchProducts(categoryId);
    }else if(keyword){
      fetchProducts(categoryId);
    }else if(page){
      fetchProducts(categoryId);
    }else if(sort){
      fetchProducts(categoryId);
    }
    
  }, [getSelectedCategoryId, page, sort, keyword]);

  // 헤더에서 전달받은 카테고리 정보 처리
  useEffect(() => {
    console.log(location.state);
    console.log(page + " : " + size + " : " + sort + " : " + menu);
    
    if (location.state?.categories) {
      const { categories } = location.state;

      if (categories.depth1) {
        setSelectedDepth1(categories.depth1.ctno.toString());
      }
      if (categories.depth2) {
        setSelectedDepth2(categories.depth2.ctno.toString());
      }
      if (categories.depth3) {
        setSelectedDepth3(categories.depth3.ctno.toString());
      }
    }
  }, [location]);

  const handleDepth1Select = (value) => {
    setSelectedDepth1(value);
    navigate('', {state : {page : 1, isCate: true}});
    if (value === 'all' || value !== selectedDepth1) {
      setSelectedDepth2('all');
      setSelectedDepth3('all');
    }
    if(value === 'all'){
      setCheck(true);
    }else{
      setCheck(false);
    }
  };

  const handleDepth2Select = (value) => {
    setSelectedDepth2(value);
    navigate('', {state : {page : 1, isCate: true}});
    if (value === 'all' || value !== selectedDepth2) {
      setSelectedDepth3('all');
    }
  };

  const handleDepth3Select = (value) => {
    setSelectedDepth3(value);
    navigate('', {state : {page : 1, isCate: true}});
  };

  return (
    <div className={styles.productsWrap}>
      <div className={styles.visualBanner}>
        <VisualBanner
          title="장하루 신규 입점!"
          subTitle="전통과 일상을 잇는 품격 있는 찬"
          imgSrc={foodImg}
          imgAlt="장하루 한식 사진"
        />
      </div>
      <div className={styles.categorySelects}>
        <div className={styles.depthSelect}>
          <DepthSelect
            depth={1}
            selectedValue={selectedDepth1}
            onSelect={handleDepth1Select}
          />
        </div>
        <Divider />
        <div className={styles.depthSelect}>
          <DepthSelect
            depth={2}
            parentCategory={selectedDepth1}
            selectedValue={selectedDepth2}
            onSelect={handleDepth2Select}
          />
        </div>
        <Divider />
        <div className={styles.depthSelect}>
          <DepthSelect
            depth={3}
            parentCategory={selectedDepth2}
            selectedValue={selectedDepth3}
            onSelect={handleDepth3Select}
          />
        </div>
      </div>
      <ShowProducts products={products} loading={loading} mno={mno} menu={menu} sort={sort}/>
    </div>
  );
};

export default ProductList;
