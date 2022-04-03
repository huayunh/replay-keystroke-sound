import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isConfigPanelOpen: false,
        selectedClip: -1,
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
    },
});

export const { openConfigPanel, closeConfigPanel, selectClip, clearSelectedClip } = appSlice.actions;

export default appSlice.reducer;
