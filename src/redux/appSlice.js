import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isConfigPanelOpen: false,
        selectedClip: -1,
        timeoutIDs: [],
        playingClip: -2, // test = -1, subject A = 0, subject B = 1
    },
    reducers: {
        openConfigPanel: (state) => {
            state.isConfigPanelOpen = true;
        },
        closeConfigPanel: (state) => {
            state.isConfigPanelOpen = false;
        },
        selectClip: (state, action) => {
            state.selectedClip = action.payload;
        },
        clearSelectedClip: (state) => {
            state.selectedClip = -1;
        },
        addTimeoutID: (state, action) => {
            state.timeoutIDs.push(action.payload);
        },
        clearTimeoutIDs: (state) => {
            for (let i = 0; i < state.timeoutIDs.length; i++) {
                clearTimeout(state.timeoutIDs[i]);
            }
            state.timeoutIDs = [];
        },
        clearPlayingClip: (state) => {
            state.playingClip = -2;
        },
        setPlayingClip: (state, action) => {
            state.playingClip = action.payload;
        },
    },
});

export const {
    openConfigPanel,
    closeConfigPanel,
    selectClip,
    clearSelectedClip,
    addTimeoutID,
    clearTimeoutIDs,
    clearPlayingClip,
    setPlayingClip,
} = appSlice.actions;

export default appSlice.reducer;
