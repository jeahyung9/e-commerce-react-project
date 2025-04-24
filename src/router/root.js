import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import memberRouter from './memberRouter';
import boardRouter from './boardRouter';
import productsRouter from './productsRouter';
import BasicLayout from '../layouts/basicLayout/BasicLayout';

// path 에 따른 컴포넌트를 보여줄 지를 결정하는 역할을 하는 함수.
const root = createBrowserRouter([
  {
    path: '',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'member',
        children: memberRouter(),
      },
      {
        path: 'board',
        children: boardRouter(),
      },
      {
        path: 'products',
        children: productsRouter(),
      },
    ],
  },
]);

export default root;
