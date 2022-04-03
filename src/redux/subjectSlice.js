import { createSlice } from '@reduxjs/toolkit';

export const subjectSlice = createSlice({
    name: 'subject',
    initialState: {
        testSubject: 's002',
        trainingSubjectA: 's002',
        trainingSubjectB: 's003',
    },
    reducers: {
        changeTestSubject: (state, action) => {
            state.testSubject = action.payload;
        },
        changeTrainingSubjectA: (state, action) => {
            state.trainingSubjectA = action.payload;
        },
        changeTrainingSubjectB: (state, action) => {
            state.trainingSubjectB = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeTrainingSubjectA, changeTrainingSubjectB, changeTestSubject } = subjectSlice.actions;

export default subjectSlice.reducer;
