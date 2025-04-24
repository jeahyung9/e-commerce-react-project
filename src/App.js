import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import './styles/App.css';

function App() {
  return (
    // 기본 router 를 지정
    <RouterProvider router={root} />
  );
}

export default App;
