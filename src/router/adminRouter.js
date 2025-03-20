import AdminLayout from '../layouts/admin/AdminLayout';
import AdminLogin from '../page/admin/AdminLogin';
import { AdminFaqDetailPage } from '../page/admin/faq/AdminFaqDetailPage';
import { AdminNoticeDetailPage } from '../page/admin/notice/AdminNoticeDetailPage';

const adminRouter = () => {
  return [
    {
      path: '',
      element: <AdminLayout />,
    },
    {
      path: 'login',
      element: <AdminLogin />,
    },
    {
      path: 'notice',
      element: <AdminNoticeDetailPage />,
    },
    {
      path: 'faq',
      element: <AdminFaqDetailPage />,
    },
  ];
};
export default adminRouter;
