import './styles/App.css';
import { RouterProvider } from 'react-router-dom';
import { root } from './router/root';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from '@mui/material';
import theme from './styles/theme';
import { AppProvider } from './context/Context';

function App() {
  return (
    <AppProvider>
      <Provider store={store}>
          <ThemeProvider theme={theme}>
              <RouterProvider router={root} />
          </ThemeProvider>
      </Provider>
    </AppProvider>
  );
}

export default App;
