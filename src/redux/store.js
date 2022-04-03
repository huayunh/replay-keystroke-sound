import { configureStore } from '@reduxjs/toolkit';
import subject from './subjectSlice';
import app from './appSlice';
import playback from './playbackSlice';

export default configureStore({
    reducer: { app, subject, playback },
});
