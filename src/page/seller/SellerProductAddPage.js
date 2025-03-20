import { useEffect, useState } from 'react';
import { useCustomMove } from '../../hooks/useCustomMove';
import useCustomLogin from '../../hooks/useCustomLogin';
import { postAdd } from '../../api/productAPI';
import {
  getCategoriesByDepth,
  getSubCategories,
} from '../../api/categoriesAPI';

const initState = {
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

const SellerProductAddPage = () => {
  const [product, setProduct] = useState({ ...initState });
  const [images, setImages] = useState([]);
  const [opts, setOpts] = useState([]);
  const [selectedDepth1, setSelectedDepth1] = useState('all');
  const [selectedDepth2, setSelectedDepth2] = useState('all');
  const [selectedDepth3, setSelectedDepth3] = useState('all');
  const [depth1Categories, setDepth1Categories] = useState([]);
  const [depth2Categories, setDepth2Categories] = useState([]);
  const [depth3Categories, setDepth3Categories] = useState([]);
  const { moveToList } = useCustomMove();
  const { loginState } = useCustomLogin();

  useEffect(() => {
    console.log(product);
  }, [product])

  const handleAddProduct = (evt) => {
    //상품 입력 필드 변경 핸들러
    const { name, value, checked, type } = evt.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      sno: 1,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddImages = (evt) => {
    const fileList = Array.from(evt.target.files);
    setImages(fileList);
  };

  const handleClickAddOptsBtn = () => {
    setOpts([...opts, { od_name: '', od_stock: 0, od_price: 0 }]);
  };

  const handleSettingOpts = (index, evt) => {
    const { name, value } = evt.target;
    const updatedOpts = opts.map((opt, i) =>
      i === index ? { ...opt, [name]: value } : opt
    );
    setOpts(updatedOpts);
  };

  const handleClickAddProductBtn = async () => {
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
      const response = await postAdd(
        product,
        product.categoryProductBumpers,
        images,
        opts
      );
      alert('상품 등록 성공');
      moveToList({ page: 1 });
    } catch (error) {
      alert('상품 등록 실패');
      console.error('page 상품 등록 실패', error);
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

  const handleAddCategory = () => {
    if (selectedDepth3) {
      const selectedCategoryAsLong = parseInt(selectedDepth3, 10);

      if (isNaN(selectedCategoryAsLong)) {
        alert('유효한 카테고리를 선택하십시오');
        return;
      }

      setProduct((prevProduct) => ({
        ...prevProduct,
        categoryProductBumpers: [
          ...prevProduct.categoryProductBumpers,
          { ctno: selectedCategoryAsLong },
        ],
      }));
      console.log(product);

      setSelectedDepth1('all');
      setSelectedDepth2('all');
      setSelectedDepth3('all');
    } else {
      alert('최하위 카테고리를 설정하십시오');
    }
  };

  return (
    <>
      <div>상품 등록 페이지</div>
      <div>
        {/* 상품 */}
        <input
          type="text"
          name="pName"
          value={product.pName}
          onChange={handleAddProduct}
          placeholder="상품명"
        />

        <input
          type="text"
          name="pContent"
          value={product.pContent}
          onChange={handleAddProduct}
          placeholder="상품내용"
        />

        <input
          type="number"
          name="pPrice"
          value={product.pPrice}
          onChange={handleAddProduct}
          placeholder="상품 가격"
        />

        <input
          type="number"
          name="pStock"
          value={product.pStock}
          onChange={handleAddProduct}
          placeholder="상품 재고"
        />

        <input
          type="number"
          name="pSalePer"
          value={product.pSalePer}
          onChange={handleAddProduct}
          placeholder="상품 할인율"
        />

        {/* 이미지 */}
        <input type="file" multiple onChange={handleAddImages} />

        {/* 옵션 */}
        {opts.map((opt, index) => (
          <div key={index}>
            <input
              type="text"
              name="od_name"
              value={opt.od_name}
              onChange={(e) => handleSettingOpts(index, e)}
              placeholder="옵션명"
            />
            <input
              type="number"
              name="od_stock"
              value={opt.od_stock}
              onChange={(e) => handleSettingOpts(index, e)}
              placeholder="옵션 재고"
            />
            <input
              type="number"
              name="od_price"
              value={opt.od_price}
              onChange={(e) => handleSettingOpts(index, e)}
              placeholder="옵션 추가금"
            />
          </div>
        ))}
        <button onClick={handleClickAddOptsBtn}>옵션 추가</button>

        {/* 카테고리 */}
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

          <button onClick={handleAddCategory}>카테고리 추가</button>
        </div>

        <button onClick={handleClickAddProductBtn}>상품 등록</button>
      </div>
    </>
  );
};

export default SellerProductAddPage;
