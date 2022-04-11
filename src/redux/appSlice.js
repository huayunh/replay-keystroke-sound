import { createSlice } from '@reduxjs/toolkit';
import { PRESET_A, PRESET_B } from '../shared/constants';
import {
    getRandomInt,
    randomItemsFromArray,
    rangeValue_repsPerTrainingClip,
    rangeValue_silenceBetweenReps,
} from '../shared/utils';
import Data from '../assets/data.json';

// this function will be called by redux before welcome screen loads and
// when the user triggers a preset before the app enters the experiment stage
const initSubjects = (state) => {
    if (state.preset === 'Preset A') {
        state.subjectSequence = PRESET_A.slice();
    } else if (state.preset === 'Preset B') {
        state.subjectSequence = PRESET_B.slice();
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
    state.logText += `New session begins.\n`;
    state.logText += `Current time: ${new Date(state.timestamp).toString()}\n`;
    state.logText += `[+${(currentTime - state.timestamp) / 1000}s] Sequence=${JSON.stringify(
        state.subjectSequence
    )} (${state.preset})\n`;
    state.timestamp = currentTime;
    logCurrentSubjects(state);
};

const logCurrentSubjects = (state) => {
    const currentTime = new Date().getTime();
    state.logText += `[+${(currentTime - state.timestamp) / 1000}s] Page=${
        state.currentPage
    }; Clips=[${state.currentTrainingSubjectNameList.toString()}]; Test=${state.currentTestSubjectName}; Expect=${
        state.currentTestSubjectIndex
    }\n`;
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

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        // UI controls
        isConfigPanelOpen: false,
        selectedAnswer: null,
        invisibleFAB: true,
        currentPage: 0,
        numberOfPagesInCurrentStage: 1,
        currentStage: 'welcome', // 'welcome' || 'experiment' || 'end'

        // Logs
        logText: '',
        timestamp: new Date().getTime(),

        // play controls
        repsPerTrainingClip: 3, // between 1 and (<number of reps in data.json> - 1)
        silenceBetweenReps: 1500, // in milisecond
        playbackSpeed: 1.0,
        playingClipIndex: null, // test = -1, first clip = 0, second clip = 1
        timeoutIDs: [], // to store all the setTimeout IDs from audios

        // subjects
        subjectSequence: [],
        currentTrainingSubjectNameList: [],
        currentTestSubjectIndex: null, // index in the name list parameter above
        currentTestSubjectName: null,
        preset: 'Random', // 'Random' | 'Preset A' | 'Preset B'
    },
    reducers: {
        /*
         * UI controls
         */
        openConfigPanel: (state) => {
            state.isConfigPanelOpen = true;
        },
        closeConfigPanel: (state) => {
            state.isConfigPanelOpen = false;
        },
        nextPage: (state) => {
            state.currentPage += 1;
        },
        toggleFABVisibility: (state) => {
            state.invisibleFAB = !state.invisibleFAB;
        },

        /*
         * store answer from users
         */
        selectAnswer: (state, action) => {
            state.selectedAnswer = action.payload;
            const currentTime = new Date().getTime();
            state.logText += `[+${(currentTime - state.timestamp) / 1000}s] Select: ${state.selectedAnswer}\n`;
            state.timestamp = currentTime;
        },
        clearSelectedAnswer: (state) => {
            state.selectedAnswer = -1;
        },

        /*
         * logs
         */
        logAction: (state, action) => {
            const currentTime = new Date().getTime();
            state.logText += `[+${(currentTime - state.timestamp) / 1000}s] ${action.payload}\n`;
            state.timestamp = currentTime;
        },

        /*
         * play controls
         */

        setRepsPerTrainingClip: (state, action) => {
            state.repsPerTrainingClip = rangeValue_repsPerTrainingClip(state.repsPerTrainingClip, action.payload);
        },
        setSilenceBetweenReps: (state, action) => {
            state.silenceBetweenReps = rangeValue_silenceBetweenReps(state.silenceBetweenReps, action.payload);
        },
        setPlaybackSpeed: (state, action) => {
            state.playbackSpeed = action.payload;
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
         * subjects
         */
        changeCurrentTestSubjectName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== null) {
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
            if (state.preset !== null) {
                return;
            }
            const args = action.payload;
            state.currentTrainingSubjectNameList[args.index] = args.name;
            state.subjectSequence[state.currentPage] = state.currentTrainingSubjectNameList;
        },
        setPreset: (state, action) => {
            console.log('set preset', action.payload);

            state.preset = action.payload;
            if (action.payload !== null) {
                initSubjects(state);
            }
        },

        /*
         * submission
         */
        startExperiment: (state) => {
            initSubjects(state);
        },
        welcomeScreenOnStart: (state) => {
            state.currentStage = 'experiment';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = state.subjectSequence.length;
        },
        // submit answer and log whether true or false
        submitAnswer: (state, action) => {
            muteAllSounds(state);
            state.selectedAnswer = null;

            // log users' answer and update UI
            const currentTime = new Date().getTime();
            state.logText += `[+${(currentTime - state.timestamp) / 1000}s] Submit: ${state.selectedAnswer}. ${
                action.payload
            }\n======\n`;
            state.timestamp = currentTime;
            state.currentPage += 1;

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
                logCurrentSubjects(state);
            }
        },
    },
});

export const {
    openConfigPanel,
    closeConfigPanel,
    nextPage,
    toggleFABVisibility,
    selectAnswer,
    clearSelectedAnswer,
    logAction,
    setRepsPerTrainingClip,
    setSilenceBetweenReps,
    setPlaybackSpeed,
    addTimeoutID,
    setPlayingClip,
    clearAllAudios,
    changeCurrentTestSubjectName,
    changeCurrentTrainingSubjectName,
    setPreset,
    clearPreset,
    startExperiment,
    welcomeScreenOnStart,
    submitAnswer,
} = appSlice.actions;

export default appSlice.reducer;
