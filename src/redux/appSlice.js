import { createSlice } from '@reduxjs/toolkit';
import { PRESET_A, PRESET_B, PRESET_C } from '../shared/constants';
import {
    getRandomInt,
    randomItemsFromArray,
    rangeValue_repsPerTrainingClip,
    rangeValue_silenceBetweenReps,
    objectToURLParameter,
    getURLParameterObject,
} from '../shared/utils';
import Data from '../assets/data.json';

const initSubjects = (state) => {
    if (state.preset === 'Preset A') {
        state.subjectSequence = PRESET_A.slice();
    } else if (state.preset === 'Preset B') {
        state.subjectSequence = PRESET_B.slice();
    } else if (state.preset === 'Preset C') {
        state.subjectSequence = PRESET_C.slice();
    } else {
        // by default, choose 5 pairs of subjects by random
        const pairsOfSubject = 5;
        state.numberOfScreensInCurrentPhase = pairsOfSubject;
        const randomSubjects = randomItemsFromArray(Data.subjects.slice(), pairsOfSubject * 2);
        const newPairs = [];
        for (let i = 0; i < pairsOfSubject; i++) {
            newPairs.push([randomSubjects[i * 2], randomSubjects[i * 2 + 1]]);
        }
        state.subjectSequence = newPairs;
    }
    state.numberOfScreensInCurrentPhase = state.subjectSequence.length;
    state.currentTrainingSubjectNameList = state.subjectSequence[0].slice();
    state.currentTestSubjectIndex = getRandomInt(state.currentTrainingSubjectNameList.length);
    state.currentTestSubjectName = state.currentTrainingSubjectNameList[state.currentTestSubjectIndex];

    const currentTime = new Date().getTime();
    state.timestamp = currentTime;
};

const muteAllSounds = (state) => {
    state.playingClipIndex = null;
    for (let i = 0; i < state.timeoutIDs.length; i++) {
        clearTimeout(state.timeoutIDs[i]);
    }
    state.timeoutIDs = [];
    const allAudios = document.getElementsByTagName('audio');
    for (let i = 0; i < allAudios.length; i++) {
        allAudios[i].pause();
        allAudios[i].remove();
    }
};

const logText = (state, action, parameter = '', rawData = '', explanation = '') => {
    const currentTime = new Date().getTime();
    state.logText += `${((currentTime - state.timestamp) / 1000).toFixed(
        3
    )},${action},${parameter},${rawData},${explanation}\n`;
    state.timestamp = currentTime;
};

const logNewQuestion = (state) => {
    if (state.experimentType === 'areTheyTheSame') {
        logText(
            state,
            'New Question',
            'Current Question',
            state.currentPage + 1,
            `Clips: ${state.currentTrainingSubjectNameList.join('-')}`
        );
    } else if (state.experimentType === 'whoTypedIt') {
        logText(
            state,
            'New Question',
            'Current Question',
            state.currentPage + 1,
            `Test Clip: ${state.currentTestSubjectName}; Subjects: ${state.currentTrainingSubjectNameList.join('-')}`
        );
    }
};

const updateURLParameters = (state, name, val) => {
    state.URLParameters[name] = val;
    const documentSearch = objectToURLParameter(state.URLParameters);
    window.history.replaceState(null, '', document.location.pathname + documentSearch);
};

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        // UI controls
        isConfigPanelOpen: false,
        selectedAnswer: null,
        isFABVisible: false,
        isProgressBarVisible: true,
        currentPage: 0,
        numberOfPagesInCurrentStage: 1,
        currentStage: 'setup', // 'setup' | 'welcome' | 'experiment' | 'end'

        // Logs
        logText: '',
        timestamp: new Date().getTime(),
        participantID: null,
        experimentType: null, // null | 'areTheyTheSame' | 'whoTypedIt'
        answerSequence: [], // Array<'Correct'|'Incorrect'>
        answerIndexSequence: [], // number[]
        experimentStartTime: new Date().getTime(),

        // play controls
        repsPerTrainingClip: 1, // between 1 and (<number of reps in data.json> - 1)
        silenceBetweenReps: 1500, // in milisecond
        playbackSpeed: 1.0,
        playingClipIndex: null, // test = -1, first clip = 0, second clip = 1
        timeoutIDs: [], // to store all the setTimeout IDs from audios

        // subjects
        subjectSequence: [],
        currentTrainingSubjectNameList: [],
        currentTestSubjectIndex: null, // index in the name list parameter above
        currentTestSubjectName: null,
        preset: null, // null | 'Random' | 'Preset A' | 'Preset B' | 'Preset C'

        URLParameters: getURLParameterObject(),
    },
    reducers: {
        /*
         * UI controls
         */
        openConfigPanel: (state) => {
            state.isConfigPanelOpen = true;
            logText(state, 'Config Panel', '- -', 'Open', 'Config panel open');
        },
        closeConfigPanel: (state) => {
            state.isConfigPanelOpen = false;
            logText(state, 'Config Panel', '- -', 'Closed', 'Config panel closed');
        },
        nextPage: (state) => {
            state.currentPage += 1;
        },
        setIsFABVisible: (state, action) => {
            state.isFABVisible = action.payload;
            updateURLParameters(state, 'isFABVisible', action.payload);
        },
        toggleFABVisibility: (state) => {
            state.isFABVisible = !state.isFABVisible;
            updateURLParameters(state, 'isFABVisible', state.isFABVisible);
        },
        setIsProgressBarVisible: (state, action) => {
            state.isProgressBarVisible = action.payload;
            updateURLParameters(state, 'isProgressBarVisible', action.payload);
        },
        toggleProgressBarVisibility: (state) => {
            state.isProgressBarVisible = !state.isProgressBarVisible;
            updateURLParameters(state, 'isProgressBarVisible', state.isProgressBarVisible);
        },

        /*
         * store answer from users
         */
        selectAnswer: (state, action) => {
            state.selectedAnswer = action.payload.index;
            logText(state, 'Select', 'Selected Answer', state.selectedAnswer, action.payload.text);
        },
        clearSelectedAnswer: (state) => {
            state.selectedAnswer = null;
        },

        /*
         * logs
         */
        logAction: (state, action) => {
            logText(
                state,
                action.payload.action,
                action.payload.parameter,
                action.payload.rawData,
                action.payload.explanation
            );
        },

        /*
         * play controls
         */

        setRepsPerTrainingClip: (state, action) => {
            const newVal = rangeValue_repsPerTrainingClip(state.repsPerTrainingClip, action.payload);
            state.repsPerTrainingClip = newVal;
            updateURLParameters(state, 'repsPerTrainingClip', newVal);
        },
        setSilenceBetweenReps: (state, action) => {
            const newVal = rangeValue_silenceBetweenReps(state.silenceBetweenReps, action.payload);
            state.silenceBetweenReps = newVal;
            updateURLParameters(state, 'silenceBetweenReps', newVal);
        },
        setPlaybackSpeed: (state, action) => {
            const newVal = action.payload;
            if ([0.5, 0.75, 1.0, 1.25].includes(newVal)) {
                state.playbackSpeed = newVal;
                updateURLParameters(state, 'playbackSpeed', newVal);
            }
        },
        addTimeoutID: (state, action) => {
            state.timeoutIDs.push(action.payload);
        },
        setPlayingClip: (state, action) => {
            muteAllSounds(state);
            state.playingClipIndex = action.payload;
        },
        clearAllAudios: (state) => {
            muteAllSounds(state);
        },

        /*
         * Experiment control
         */

        setParticipantID: (state, action) => {
            const newVal = action.payload;

            if (newVal) {
                state.participantID = action.payload;
                updateURLParameters(state, 'participantID', action.payload);
            } else {
                state.participantID = null;
                updateURLParameters(state, 'participantID', undefined);
            }
        },

        /*
         * subjects
         */
        changeCurrentTestSubjectName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== 'Random') {
                return;
            }
            const newSubject = action.payload;
            if (!state.currentTrainingSubjectNameList.includes(newSubject)) {
                return;
            }
            state.currentTestSubjectName = newSubject;
            state.currentTestSubjectIndex = state.currentTrainingSubjectNameList.indexOf(newSubject);
        },
        changeCurrentTrainingSubjectName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== 'Random') {
                return;
            }
            const args = action.payload;
            state.currentTrainingSubjectNameList[args.index] = args.name;
            state.subjectSequence[state.currentPage] = state.currentTrainingSubjectNameList;
        },
        setPreset: (state, action) => {
            if (!['Random', 'Preset A', 'Preset B', 'Preset C', null].includes(action.payload)) {
                return;
            }
            state.preset = action.payload;
            if (action.payload !== null) {
                initSubjects(state);
                updateURLParameters(state, 'preset', action.payload);
            } else {
                updateURLParameters(state, 'preset', undefined);
            }
        },

        /*
         * submission
         */
        setUpScreenOnStart: (state, action) => {
            initSubjects(state);
            state.experimentType = action.payload;
            state.currentStage = 'welcome';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = 1;
        },
        welcomeScreenOnStart: (state) => {
            state.currentStage = 'experiment';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = state.subjectSequence.length;
            state.experimentStartTime = new Date().getTime();
            logNewQuestion(state);
        },
        // submit answer and log whether true or false
        submitAnswer: (state, action) => {
            muteAllSounds(state);

            // log users' answer and update UI
            logText(state, 'Submit', 'Selected Answer', state.selectedAnswer, action.payload);
            state.answerSequence.push(action.payload);
            state.answerIndexSequence.push(state.selectedAnswer);
            state.currentPage += 1;
            state.selectedAnswer = null;

            // reached the end of the experiment stage
            if (state.currentPage === state.numberOfPagesInCurrentStage) {
                state.currentPage = 0;
                state.currentStage = 'end';
                state.numberOfPagesInCurrentStage = 1;
            }
            // else, load new subjects
            else {
                state.currentTrainingSubjectNameList = state.subjectSequence[state.currentPage].slice();
                state.currentTestSubjectIndex = getRandomInt(state.currentTrainingSubjectNameList.length);
                state.currentTestSubjectName = state.currentTrainingSubjectNameList[state.currentTestSubjectIndex];
                logNewQuestion(state);
            }
        },
    },
});

export const {
    openConfigPanel,
    closeConfigPanel,
    nextPage,
    setIsFABVisible,
    toggleFABVisibility,
    setIsProgressBarVisible,
    toggleProgressBarVisibility,
    selectAnswer,
    clearSelectedAnswer,
    logAction,
    setRepsPerTrainingClip,
    setSilenceBetweenReps,
    setPlaybackSpeed,
    addTimeoutID,
    setPlayingClip,
    clearAllAudios,
    setParticipantID,
    changeCurrentTestSubjectName,
    changeCurrentTrainingSubjectName,
    setPreset,
    clearPreset,
    setUpScreenOnStart,
    welcomeScreenOnStart,
    submitAnswer,
} = appSlice.actions;

export default appSlice.reducer;
