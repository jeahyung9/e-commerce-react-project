import { Navigate } from 'react-router-dom';
import NoticePage from '../pages/board/notice/NoticePage';

const boardRouter = () => {
  return [
    {
      path: 'notice',
      element: <NoticePage />,
    },
    {
      path: '',
      element: <Navigate replace to={'notice'} />,
    },
  ];
};

export default boardRouter;
