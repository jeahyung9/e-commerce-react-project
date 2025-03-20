import AdminLayout from '../layouts/admin/AdminLayout';
import SellerLogin from '../page/seller/SellerLogin';

const sellerRouter = () => {
  return [
    {
      path: '',
      element: <AdminLayout />,
    },
    {
      path: 'login',
      element: <SellerLogin />,
    },
  ];
};
export default sellerRouter;
