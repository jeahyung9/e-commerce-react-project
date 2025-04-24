import LoginPage from '../pages/member/login/LoginPage.js';

const memberRouter = () => {
  return [
    {
      path: 'login',
      element: <LoginPage />,
    },
  ];
};

export default memberRouter;
