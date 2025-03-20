import { configureStore } from '@reduxjs/toolkit';
// loginSlice를 import해야 합니다.
import LoginSlice from './slice/LoginSlice';


export default configureStore({
  
  reducer: {
    LoginSlice: LoginSlice,  // loginSlice를 reducer에 추가
  },
});