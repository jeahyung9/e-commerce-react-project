import { useEffect, useState } from 'react';
import { getOne } from '../../api/productsApi';

const ProductsSection = ({
  title,
  products,
  loading,
  error,
  fetchProducts,
  sortOption,
}) => {
  const [dtoList, setDTOList] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
  }, []);
  return (
    <>
      <h3>{title}</h3>
      <div></div>
    </>
  );
};

export default ProductsSection;
