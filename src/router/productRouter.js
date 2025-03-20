import { Navigate } from 'react-router-dom';
import ProductList from '../page/product/list/ProductList';
import ProductDetail from '../page/product/detail/ProductDetail';

const productRouter = () => {
  return [
    {
      path: 'list',
      element: <ProductList />,
    },
    {
      path: '',
      element: <Navigate replace to={'list'} />,
    },
    {
      path: ':pno',
      element: <ProductDetail />,
    },
  ];
};

export default productRouter;
