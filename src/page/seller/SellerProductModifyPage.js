import { useEffect, useState } from 'react';
import { useCustomMove } from '../../hooks/useCustomMove';
import useCustomLogin from '../../hooks/useCustomLogin';
import { putOne, updateProductStatus } from '../../api/productAPI';
import { useLocation } from 'react-router-dom';
import {
  getCategoriesByDepth,
  getSubCategories,
} from '../../api/categoriesAPI';
import { changeSellerProductStatus } from '../../api/adminAPI';

const SellerProductModifyPage = ({ pno }) => {
  const [images, setImages] = useState([]);
  const [opts, setOpts] = useState([]);
  const { moveToList } = useCustomMove();
  const { loginState } = useCustomLogin();
  const location = useLocation();
  const initState = location.state?.product || {
    pName: '',
    pContent: '',
    pPrice: 0,
    pSalePer: 0,
    pStock: 0,
    pSalesVol: 0,
    delFlag: false,
    sno: 0,
    s_email: '',
    businessName: '',
    categoryProductBumpers: [],
    productImage: [],
    optionDetail: [],
  };
  const [product, setProduct] = useState({ ...initState });
  const [selectedDepth1, setSelectedDepth1] = useState('all');
  const [selectedDepth2, setSelectedDepth2] = useState('all');
  const [selectedDepth3, setSelectedDepth3] = useState('all');
  const [depth1Categories, setDepth1Categories] = useState([]);
  const [depth2Categories, setDepth2Categories] = useState({});
  const [depth3Categories, setDepth3Categories] = useState({});

  useEffect(() => {
    if (pno) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        pno: pno,
      }));
    }
  }, [pno]);

  useEffect(() => {
    console.log(product);
    console.log(product.optionDetail);
  }, [product]);

  const handleModifyProduct = (evt) => {
    const { name, value, checked, type } = evt.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      sno: loginState.sno,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleModifyImages = (evt) => {
    const fileList = Array.from(evt.target.files);
    setImages(fileList);
  };

  const handleClickModifyOptsBtn = () => {
    setOpts([...opts, { op_name: '', od_stock: 0, odPrice: 0 }]);
  };

  const handleModifyOpts = (index, evt) => {
    const { name, value } = evt.target;
    const updatedOpts = opts.map((opt, i) =>
      i === index ? { ...opt, [name]: value } : opt
    );
    setOpts(updatedOpts);
  };

  const handleClickModifyProductBtn = async () => {
    if (!product.pName.trim()) {
      alert('상품명을 입력하시오');
      return;
    }
    if (!product.pContent.trim()) {
      alert('상품 설명을 입력하시오');
      return;
    }
    if (!product.pPrice || isNaN(product.pPrice)) {
      alert('상품 가격을 입력하시오');
      return;
    }
    if (!product.categoryProductBumpers.length) {
      alert('카테고리를 설정하시오');
      return;
    }

    try {
      const response = await putOne(
        product.pno,
        product,
        product.categoryProductBumpers.ctno,
        images,
        opts
      );
      alert('상품 수정 성공');
      moveToList({ page: 1 });
    } catch (error) {
      alert('상품 수정 실패');
      console.error('page 상품 수정 실패', error);
      return;
    }
  };

  const handleClickUpdateProductStatusBtn = async () => {
    console.log(product);
    try {
      await changeSellerProductStatus(product.pno, product.delFlag);
      alert('상품 삭제 성공');
      moveToList({ page: 1 });
    } catch (error) {
      alert('상품 삭제 실패');
      console.error('page 상품 삭제 실패', error);
      return;
    }
  };

  const LoadCategories = async () => {
    try {
      const depth1Data = await getCategoriesByDepth(1);
      setDepth1Categories(depth1Data);

      const depth2Data = {};
      for (const depth1 of depth1Data) {
        const subCategories = await getSubCategories(depth1.ctno);
        depth2Data[depth1.ctno] = subCategories;

        const depth3Data = {};
        for (const depth2 of subCategories) {
          const subSubCategories = await getSubCategories(depth2.ctno);
          depth3Data[depth2.ctno] = subSubCategories;
        }
        setDepth3Categories((prev) => ({ ...prev, ...depth3Data }));
      }
      setDepth2Categories(depth2Data);
    } catch (error) {
      console.error('Seller Page 카테고리 로딩 실패', error);
    }
  };

  useEffect(() => {
    LoadCategories();
  }, []);

  const handleDepth1Change = (evt) => {
    const selectedCategory = evt.target.value;
    setSelectedDepth1(selectedCategory);
    setSelectedDepth2('all');
    setSelectedDepth3('all');
    console.log(selectedCategory);
    setProduct((prevProduct) => ({
      ...prevProduct,
      categoryProductBumpers: prevProduct.categoryProductBumpers.filter(
        (cate) => cate.ctno !== selectedCategory
      ),
    }));
  };

  const handleDepth2Change = (evt) => {
    const selectedCategory = evt.target.value;
    console.log(selectedCategory);
    setSelectedDepth2(selectedCategory);
    setSelectedDepth3('all');
  };

  const handleDepth3Change = (evt) => {
    const selectedCategory = evt.target.value;
    setSelectedDepth3(selectedCategory);
  };

  const handleModifyCategory = () => {
    if (selectedDepth3) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        categoryProductBumpers: [
          ...prevProduct.categoryProductBumpers,
          { ctno: selectedDepth3 },
        ],
      }));

      setSelectedDepth1('all');
      setSelectedDepth2('all');
      setSelectedDepth3('all');
    } else {
      alert('최하위 카테고리를 설정하십시오');
    }
  };

  return (
    <>
      <div>상품 수정 및 삭제 페이지</div>
      <div>
        {/* 상품명 */}
        <input
          type="text"
          name="pName"
          value={product.pName}
          onChange={handleModifyProduct}
          placeholder="상품명"
        />

        {/* 상품 설명 */}
        <input
          type="text"
          name="pContent"
          value={product.pContent}
          onChange={handleModifyProduct}
          placeholder="상품 설명"
        />

        {/* 상품 가격 */}
        <input
          type="number"
          name="pPrice"
          value={product.pPrice}
          onChange={handleModifyProduct}
          placeholder="상품 가격"
        />

        {/* 상품 재고 */}
        <input
          type="number"
          name="pStock"
          value={product.pStock}
          onChange={handleModifyProduct}
          placeholder="상품 재고"
        />

        {/* 상품 할인율 */}
        <input
          type="number"
          name="pSalePer"
          value={product.pSalePer}
          onChange={handleModifyProduct}
          placeholder="상품 할인율"
        />

        {/* 이미지 */}
        <input type="file" multiple onChange={handleModifyImages} />

        {/* 옵션 */}
        {opts.map((opt, index) => (
          <div key={index}>
            <input
              type="text"
              name="od_name"
              value={opt.od_name}
              onChange={(e) => handleModifyOpts(index, e)}
              placeholder="옵션명"
            />
            <input
              type="number"
              name="od_stock"
              value={opt.od_stock}
              onChange={(e) => handleModifyOpts(index, e)}
              placeholder="옵션 재고"
            />
            <input
              type="number"
              name="od_price"
              value={opt.od_price}
              onChange={(e) => handleModifyOpts(index, e)}
              placeholder="0"
            />
          </div>
        ))}
        <button onClick={handleClickModifyOptsBtn}>옵션 추가</button>

        {/* 카테고리 선택 */}
        <div>
          <select onChange={handleDepth1Change} value={selectedDepth1}>
            <option value="">상위 카테고리 선택</option>
            {depth1Categories.map((category) => (
              <option key={category.ctno} value={category.ctno}>
                {category.cateName}
              </option>
            ))}
          </select>

          {selectedDepth1 && depth2Categories[selectedDepth1] && (
            <select onChange={handleDepth2Change} value={selectedDepth2}>
              <option value="">중위 카테고리 선택</option>
              {depth2Categories[selectedDepth1]?.map((category) => (
                <option key={category.ctno} value={category.ctno}>
                  {category.cateName}
                </option>
              ))}
            </select>
          )}

          {selectedDepth2 && depth3Categories[selectedDepth2] && (
            <select onChange={handleDepth3Change} value={selectedDepth3}>
              <option value="">하위 카테고리 선택</option>
              {depth3Categories[selectedDepth2]?.map((category) => (
                <option key={category.ctno} value={category.ctno}>
                  {category.cateName}
                </option>
              ))}
            </select>
          )}

          <button onClick={handleModifyCategory}>카테고리 추가</button>
        </div>

        {/* 상품 수정 버튼 */}
        <button onClick={handleClickModifyProductBtn}>상품 수정</button>

        {/* 상품 삭제 버튼 */}
        <button onClick={handleClickUpdateProductStatusBtn}>상품 삭제</button>
      </div>
    </>
  );
};

export default SellerProductModifyPage;
