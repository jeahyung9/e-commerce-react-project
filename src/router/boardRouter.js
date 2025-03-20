import { Navigate } from 'react-router-dom';
import BoardPage from '../page/board/BoardPage';
import NoticeComponent from '../component/board/NoticeComponent';
import NoticeTableComponent from '../component/board/NoticeTableComponent';
import NoticeDetailComponent from '../component/board/NoticeDetailComponent';
import FaqComponent from '../component/board/FaqComponent';

const boardRouter = () => {
  return [
    {
      path: '',
      element: <BoardPage />,
      children: [
        {
          path: 'notice',
          element: <NoticeComponent />,
          children: [
            {
              path: '',
              element: <NoticeTableComponent />,
            },
            {
              path: 'detail/:nno',
              element: <NoticeDetailComponent />,
            },
          ],
        },
        {
          path: 'faq',
          element: <FaqComponent />,
        },
      ],
    },
    {
      path: '',
      element: <Navigate replace to={'notice'} />,
    },
  ];
};

export default boardRouter;