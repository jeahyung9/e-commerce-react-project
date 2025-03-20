import { useCallback, useEffect, useState } from 'react';
import { useCustomMove } from '../../hooks/useCustomMove';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getList, getOne } from '../../api/productAPI';
import { changeProductStatus, getSuperProductList } from '../../api/adminAPI';
import DepthSelect from '../product/category/depthSelect';
import PageComponent from '../paging/PageComponent';

const SellerProductManageComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [productList, setProductList] = useState([]);
  const [serverData, setServerData] = useState([]);
  const { page, size, moveToList } = useCustomMove();
  const [selectedDepth1, setSelectedDepth1] = useState('all');
  const [selectedDepth2, setSelectedDepth2] = useState('all');
  const [selectedDepth3, setSelectedDepth3] = useState('all');

  const getSelectedCategoryId = useCallback(() => {
    if (selectedDepth3 !== 'all') return selectedDepth3;
    if (selectedDepth2 !== 'all') return selectedDepth2;
    if (selectedDepth1 !== 'all') return selectedDepth1;
    return 0;
  }, [selectedDepth1, selectedDepth2, selectedDepth3]);

  const fetchProductList = async () => {
    try {
      const categoryId = getSelectedCategoryId();
      const data = await getSuperProductList([page, 10], {
        ctno: categoryId,
      });
      setProductList(data.dtoList);
      setServerData(data);
    } catch (error) {
      console.error('상품 목록 로딩 실패:', error);
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [selectedDepth1, selectedDepth2, selectedDepth3, page, searchParams]);

  const handleDepth1Select = (value) => {
    setSelectedDepth1(value);
    setSearchParams({ page: 1 });
    setSelectedDepth2('all');
    setSelectedDepth3('all');
  };

  const handleDepth2Select = (value) => {
    setSelectedDepth2(value);
    setSearchParams({ page: 1 });
    setSelectedDepth3('all');
  };

  const handleDepth3Select = (value) => {
    setSelectedDepth3(value);
    setSearchParams({ page: 1 });
  };

  const handleAddProduct = () => {
    console.log('addProduct');
    navigate('/seller', { state: { addProduct: true } });
  };

  const switchProductState = async (pno) => {
    try {
      const product = await getOne(pno);
      if (!product) {
        console.error('상품 정보를 찾을 수 없음');
        return;
      }

      await changeProductStatus(product.pno, product.delFlag);
      fetchProductList(); // 최신 데이터 반영
    } catch (error) {
      console.error('상품 상태 변경 실패:', error);
    }
  };

  return (
    <>
      <DepthSelect
        depth={1}
        selectedValue={selectedDepth1}
        onSelect={handleDepth1Select}
      />
      <DepthSelect
        depth={2}
        selectedValue={selectedDepth2}
        onSelect={handleDepth2Select}
      />
      <DepthSelect
        depth={3}
        selectedValue={selectedDepth3}
        onSelect={handleDepth3Select}
      />

      <div>
        <button onClick={handleAddProduct}>상품 등록</button>
      </div>

      <ul>
        {productList?.map((product) => (
          <li key={product.pno}>
            {product.pName}
            <button
              onClick={() => switchProductState(product.pno, product.delFlag)}
            >
              {product.delFlag ? '해제' : '삭제'}
            </button>
          </li>
        ))}
      </ul>

      <PageComponent serverData={serverData} movePage={moveToList} />
    </>
  );
};
export default SellerProductManageComponent;
