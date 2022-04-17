import { createSlice } from '@reduxjs/toolkit';
import { PRESET_A, PRESET_B, PRESET_C } from '../shared/constants';
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
    state.logText += `New session begins.\n`;
    state.logText += `Current time: ${new Date(state.timestamp).toString()}\n`;
    state.logText += `[+${(currentTime - state.timestamp) / 1000}s] Sequence=${JSON.stringify(
        state.subjectSequence
    )} (${state.preset})\n`;
    state.timestamp = currentTime;
    logCurrentSubjects(state);
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

const logText = (state, text) => {
    const currentTime = new Date().getTime();
    state.logText += `[+${((currentTime - state.timestamp) / 1000).toFixed(3)}s] ${text}\n`;
    state.timestamp = currentTime;
};

const logCurrentSubjects = (state) => {
    logText(
        state,
        `Page=${state.currentPage}; Clips=[${state.currentTrainingSubjectNameList.toString()}]; Test=${
            state.currentTestSubjectName
        }; Expect=${state.currentTestSubjectIndex}`
    );
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
        currentStage: 'setup', // 'setup' | 'welcome' | 'experiment' | 'end'

        // Logs
        logText: '',
        timestamp: new Date().getTime(),
        numberOfCorrectAnswers: 0,
        numberOfIncorrectAnswers: 0,

        // Experiment record
        participantID: null,
        experimentType: null, // null | 'areTheyTheSame' | 'whoTypedIt'

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
        preset: 'Preset A', // 'Random' | 'Preset A' | 'Preset B' | 'Preset C'
    },
    reducers: {
        /*
         * UI controls
         */
        openConfigPanel: (state) => {
            state.isConfigPanelOpen = true;
            logText(state, 'Config panel open');
        },
        closeConfigPanel: (state) => {
            state.isConfigPanelOpen = false;
            logText(state, 'Config panel closed');
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
            state.selectedAnswer = action.payload.index;
            logText(state, `Select: ${state.selectedAnswer} (${action.payload.text})`);
        },
        clearSelectedAnswer: (state) => {
            state.selectedAnswer = null;
        },

        /*
         * logs
         */
        logAction: (state, action) => {
            logText(state, action.payload);
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
         * Experiment control
         */

        setParticipantID: (state, action) => {
            state.participantID = action.payload;
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
            logCurrentSubjects(state);
        },
        changeCurrentTrainingSubjectName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== 'Random') {
                return;
            }
            const args = action.payload;
            state.currentTrainingSubjectNameList[args.index] = args.name;
            state.subjectSequence[state.currentPage] = state.currentTrainingSubjectNameList;
            logCurrentSubjects(state);
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
        setUpScreenOnStart: (state, action) => {
            logText(state, `Start Experiment: ${action.payload}`);
            state.experimentType = action.payload;
            state.currentStage = 'welcome';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = 1;
        },
        welcomeScreenOnStart: (state) => {
            state.currentStage = 'experiment';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = state.subjectSequence.length;
        },
        // submit answer and log whether true or false
        submitAnswer: (state, action) => {
            muteAllSounds(state);

            // log users' answer and update UI
            logText(state, `Submit: ${state.selectedAnswer} (${action.payload})\n======`);
            if (action.payload === 'True') {
                state.numberOfCorrectAnswers += 1;
            } else {
                state.numberOfIncorrectAnswers += 1;
            }
            state.currentPage += 1;
            state.selectedAnswer = null;

            // reached the end of the experiment stage
            if (state.currentPage === state.numberOfPagesInCurrentStage) {
                state.currentPage = 0;
                state.currentStage = 'end';
                state.numberOfPagesInCurrentStage = 1;
                logText(state, `Stats: True/False = ${state.numberOfCorrectAnswers}/${state.numberOfIncorrectAnswers}`);
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
    setParticipantID,
    changeCurrentTestSubjectName,
    changeCurrentTrainingSubjectName,
    setPreset,
    clearPreset,
    startExperiment,
    setUpScreenOnStart,
    welcomeScreenOnStart,
    submitAnswer,
} = appSlice.actions;

export default appSlice.reducer;
