import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomMove } from '../../hooks/useCustomMove';
import { getOne } from '../../api/productAPI';

const SellerProductDetail = () => {
  const location = useLocation();
  const pno = location.state?.pno;
  const [product, setProduct] = useState([]);
  const { moveToList } = useCustomMove();
  const navigate = useNavigate();

  const handleModifyProduct = () => {
    console.log('modifyProduct');
    navigate('/seller', { state: { modifyProduct: true, product } });
  };

  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
    });
  }, [pno]);

  return (
    <>
      <div>
        <h1>{product.pName}</h1>
        <div>
          <img src={product.img} />
        </div>
        <div>{product.pContent}</div>
        <div>가격: {product.pPrice} 원</div>
        <div>할인 가격: {product.pSalePer}% 할인</div>

        <div> 
          <ul>
            {product.optionDetail && product.optionDetail.length > 0 ? (
              product.optionDetail.map((option) => (
                <li key={option.odno}>
                  <p>{option.od_name}</p>
                  <p>추가금: {option.od_price} 원</p>
                </li>
              ))
            ) : (
              <p>옵션이 없습니다.</p>
            )}
          </ul>
        </div>

        <div>
          <button onClick={() => handleModifyProduct(product.pno)}>
            수정 및 삭제
          </button>

          <button type="button" onClick={() => moveToList({ page: 1 })}>
            목록으로
          </button>
        </div>
      </div>
    </>
  );
};

export default SellerProductDetail;
