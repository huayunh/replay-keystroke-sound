import { createSlice } from '@reduxjs/toolkit';
import Data from '../assets/data.json';
import { randomItemsFromArray } from '../shared/utils';

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
        randomizeSubjects: (state) => {
            const randomSubjects = randomItemsFromArray(Data.subjects, 2);
            state.testSubject = randomSubjects[Math.round(Math.random())];
            state.trainingSubjectA = randomSubjects[0];
            state.trainingSubjectB = randomSubjects[1];
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeTestSubject, changeTrainingSubjectA, changeTrainingSubjectB, randomizeSubjects } =
    subjectSlice.actions;

export default subjectSlice.reducer;
