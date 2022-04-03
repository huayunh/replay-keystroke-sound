import { createSlice } from '@reduxjs/toolkit';
import { rangeValue_repsPerTrainingClip, rangeValue_silenceBetweenReps } from '../shared/utils';

export const playbackSlice = createSlice({
    name: 'playback',
    initialState: {
        repsPerTrainingClip: 3, // between 1 and (<number of reps in data.json> - 1)
        silenceBetweenReps: 1500, // in milisecond
        playbackSpeed: 1.0,
    },
    reducers: {
        setRepsPerTrainingClip: (state, action) => {
            state.repsPerTrainingClip = rangeValue_repsPerTrainingClip(state.repsPerTrainingClip, action.payload);
        },
        setSilenceBetweenReps: (state, action) => {
            state.silenceBetweenReps = rangeValue_silenceBetweenReps(state.silenceBetweenReps, action.payload);
        },
        setPlaybackSpeed: (state, action) => {
            state.playbackSpeed = action.payload;
        },
    },
});

export const { setRepsPerTrainingClip, setSilenceBetweenReps, setPlaybackSpeed } = playbackSlice.actions;

export default playbackSlice.reducer;
