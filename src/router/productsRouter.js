import { Navigate } from 'react-router-dom';
import ProductsList from '../pages/products/list/ProductsList';

const productsRouter = () => {
  return [
    {
      path: 'list',
      element: <ProductsList />,
    },
    {
      path: '',
      element: <Navigate replace to={'list'} />,
    },
  ];
};

export default productsRouter;
