import { createSlice } from '@reduxjs/toolkit';

export const logSlice = createSlice({
    name: 'log',
    initialState: {
        logText: '',
        timestamp: new Date().getTime(),
    },
    reducers: {
        logAction: (state, action) => {
            const currentTime = new Date().getTime();
            state.logText += `[+${(currentTime - state.timestamp) / 1000}s] ${action.payload}\n`;
            state.timestamp = currentTime;
        },
        clearLog: (state) => {
            const currentDate = new Date();
            state.logText = `--- New Session Begins ---\n${currentDate.toDateString()} ${currentDate.toTimeString()}\n`;
            state.timestamp = currentDate.getTime();
        },
    },
});

export const { logAction, clearLog } = logSlice.actions;

export default logSlice.reducer;
