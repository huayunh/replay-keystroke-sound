import { configureStore } from '@reduxjs/toolkit';
import app from './appSlice';

export default configureStore({
    reducer: { app },
});
