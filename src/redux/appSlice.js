import { createSlice } from '@reduxjs/toolkit';
import { PRESETS, PRESET_KEYS } from '../shared/presets';
import {
    getRandomInt,
    randomItemsFromArray,
    rangeValue_repsPerTrainingClip,
    rangeValue_silenceBetweenReps,
    objectToURLParameter,
    getURLParameterObject,
    millisecondToHMS,
    localeDateToISO,
    UTCDateToISO,
} from '../shared/utils';
import Data from '../assets/data.json';

const initTypists = (state) => {
    if (PRESET_KEYS.includes(state.preset)) {
        state.typistSequence = PRESETS[state.preset].slice();
    } else {
        // by default, choose 5 pairs of typists by random
        const pairsOfTypist = 5;
        state.numberOfScreensInCurrentPhase = pairsOfTypist;
        const randomTypists = randomItemsFromArray(Data.typists.slice(), pairsOfTypist * 2);
        const newPairs = [];
        for (let i = 0; i < pairsOfTypist; i++) {
            newPairs.push([randomTypists[i * 2], randomTypists[i * 2 + 1]]);
        }
        state.typistSequence = newPairs;
    }
    state.numberOfScreensInCurrentPhase = state.typistSequence.length;
    state.currentTrainingTypistNameList = state.typistSequence[0].slice();
    state.currentTestTypistIndex = getRandomInt(state.currentTrainingTypistNameList.length);
    state.currentTestTypistName = state.currentTrainingTypistNameList[state.currentTestTypistIndex];

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

const logText = (state, event, typistPlayed = null, decision = null) => {
    const currentTime = new Date();
    const timestampLocal = localeDateToISO(currentTime);
    const timestampUTCISO = UTCDateToISO(currentTime);
    const timeElapsed = millisecondToHMS(currentTime.getTime() - state.timestamp).string;
    const testClip = state.experimentType === 'whoTypedIt' ? ',' + state.currentTestTypistName : '';
    let answerFromSubject = null;
    if (state.selectedAnswer !== null) {
        answerFromSubject =
            state.experimentType === 'whoTypedIt'
                ? state.currentTrainingTypistNameList[state.selectedAnswer]
                : `${state.selectedAnswer}%`;
    }
    state.logText += `${state.subjectID},${
        state.currentPage + 1
    },${timestampUTCISO},${timestampLocal},${timeElapsed},${state.currentTrainingTypistNameList.join(
        ','
    )}${testClip},${event},${typistPlayed},${answerFromSubject},${decision}\n`;
    state.timestamp = currentTime.getTime();
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
        subjectID: null,
        experimentType: null, // null | 'areTheyTheSame' | 'whoTypedIt'
        answerSequence: [], // Array<'Correct'|'Incorrect'>
        answerIndexSequence: [], // number[]
        experimentStartTime: new Date().getTime(),
        metrics: null,
        selectAnswerEventName: null,

        // play controls
        repsPerTrainingClip: 1, // between 1 and (<number of reps in data.json> - 1)
        silenceBetweenReps: 1500, // in milisecond
        playbackSpeed: 1.0,
        playingClipIndex: null, // test = -1, first clip = 0, second clip = 1
        timeoutIDs: [], // to store all the setTimeout IDs from audios
        variedKeystrokeSound: true,

        // typists
        typistSequence: [],
        currentTrainingTypistNameList: [],
        currentTestTypistIndex: null, // index in the name list parameter above
        currentTestTypistName: null,
        preset: null, // null | see PRESET_KEYS

        URLParameters: getURLParameterObject(),
    },
    reducers: {
        /*
         * UI controls
         */
        openConfigPanel: (state) => {
            state.isConfigPanelOpen = true;
            logText(state, 'Config Panel Open');
        },
        closeConfigPanel: (state) => {
            state.isConfigPanelOpen = false;
            logText(state, 'Config Panel Close');
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
        setVariedKeystrokeSound: (state, action) => {
            state.variedKeystrokeSound = action.payload;
            updateURLParameters(state, 'variedKeystrokeSound', action.payload);
        },

        /*
         * store answer from subjects
         */
        selectAnswer: (state, action) => {
            state.selectedAnswer = action.payload;
            logText(state, state.selectAnswerEventName);
        },
        clearSelectedAnswer: (state) => {
            state.selectedAnswer = null;
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
        clearAllAudios: (state) => {
            muteAllSounds(state);
        },
        onAudioPlayed: (state, action) => {
            muteAllSounds(state);
            state.playingClipIndex = action.payload.index;
            logText(state, 'Play', `${action.payload.title} (${action.payload.name})`);
        },
        onAudioStopped: (state, action) => {
            muteAllSounds(state);
            state.playingClipIndex = null;
            logText(state, 'Stop', `${action.payload.title} (${action.payload.name})`);
        },

        /*
         * Experiment control
         */

        setSubjectID: (state, action) => {
            // const newVal = action.payload;
            state.subjectID = action.payload;

            // if (newVal) {
            //     state.subjectID = action.payload;
            //     updateURLParameters(state, 'subjectID', action.payload);
            // } else {
            //     state.subjectID = null;
            //     updateURLParameters(state, 'subjectID', undefined);
            // }
        },

        /*
         * typists
         */
        changecurrentTestTypistName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== 'Random') {
                return;
            }
            const newTypist = action.payload;
            if (!state.currentTrainingTypistNameList.includes(newTypist)) {
                return;
            }
            state.currentTestTypistName = newTypist;
            state.currentTestTypistIndex = state.currentTrainingTypistNameList.indexOf(newTypist);
        },
        changeCurrentTrainingTypistName: (state, action) => {
            // only allows those without a preset to change
            if (state.preset !== 'Random') {
                return;
            }
            const args = action.payload;
            state.currentTrainingTypistNameList[args.index] = args.name;
            state.typistSequence[state.currentPage] = state.currentTrainingTypistNameList;
        },
        setPreset: (state, action) => {
            if (PRESET_KEYS.includes(action.payload) || action.payload == null) {
                state.preset = action.payload;
                if (action.payload !== null) {
                    initTypists(state);
                    updateURLParameters(state, 'preset', action.payload);
                } else {
                    updateURLParameters(state, 'preset', undefined);
                }
            }
        },

        /*
         * submission
         */
        setUpScreenOnStart: (state, action) => {
            initTypists(state);
            state.experimentType = action.payload;
            state.currentStage = 'welcome';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = 1;
            switch (state.experimentType) {
                case 'areTheyTheSame':
                    state.metrics = 'Confidence Level';
                    state.selectAnswerEventName = 'VAS Moved';
                    break;
                case 'whoTypedIt':
                    state.metrics = 'Identified Typist';
                    state.selectAnswerEventName = 'Typist Selected';
                    break;
                default:
                    break;
            }
        },
        welcomeScreenOnStart: (state) => {
            state.currentStage = 'experiment';
            state.currentPage = 0;
            state.numberOfPagesInCurrentStage = state.typistSequence.length;
            state.experimentStartTime = new Date().getTime();
            logText(state, 'New Question');
        },
        // submit answer and log whether true or false
        submitAnswer: (state, action) => {
            muteAllSounds(state);

            // log users' answer and update UI
            logText(state, 'Submit', null, action.payload);
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
            // else, load new typists
            else {
                state.currentTrainingTypistNameList = state.typistSequence[state.currentPage].slice();
                state.currentTestTypistIndex = getRandomInt(state.currentTrainingTypistNameList.length);
                state.currentTestTypistName = state.currentTrainingTypistNameList[state.currentTestTypistIndex];
                logText(state, 'New Question');
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
    setVariedKeystrokeSound,
    selectAnswer,
    clearSelectedAnswer,
    logAction,
    setRepsPerTrainingClip,
    setSilenceBetweenReps,
    setPlaybackSpeed,
    addTimeoutID,
    clearAllAudios,
    onAudioPlayed,
    onAudioStopped,
    setSubjectID,
    changecurrentTestTypistName,
    changeCurrentTrainingTypistName,
    setPreset,
    clearPreset,
    setUpScreenOnStart,
    welcomeScreenOnStart,
    submitAnswer,
} = appSlice.actions;

export default appSlice.reducer;
