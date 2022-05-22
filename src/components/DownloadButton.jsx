import React from 'react';

// components
import Button from '@mui/material/Button';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { clearAllAudios } from '../redux/appSlice';

import { download, millisecondToHMS, localeDateToISO, UTCDateToISO, localeDateToISONoPunct } from '../shared/utils';

const DownloadButton = () => {
    const dispatch = useDispatch();
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const variedKeystrokeSound = useSelector((state) => state.app.variedKeystrokeSound);
    const logText = useSelector((state) => state.app.logText);
    const preset = useSelector((state) => state.app.preset);
    const subjectID = useSelector((state) => state.app.subjectID);
    const experimentType = useSelector((state) => state.app.experimentType);
    const experimentStartTime = useSelector((state) => state.app.experimentStartTime);
    const typistSequence = useSelector((state) => state.app.typistSequence);
    const answerSequence = useSelector((state) => state.app.answerSequence);
    const answerIndexSequence = useSelector((state) => state.app.answerIndexSequence);
    const isProgressBarVisible = useSelector((state) => state.app.isProgressBarVisible);
    const metrics = useSelector((state) => state.app.metrics);

    const handleDownload = () => {
        dispatch(clearAllAudios());
        const correctCount = answerSequence.filter((ans) => ans === 'Correct').length;
        const startTimeDateObj = new Date(experimentStartTime);
        const currentTimeDateObj = new Date();
        const timeElapsed = millisecondToHMS(currentTimeDateObj.getTime() - experimentStartTime).string;
        const testCip = experimentType === 'whoTypedIt' ? ',Test Clip' : '';
        let summary = `Subject ID,${subjectID}
Experiment Start (Local),${localeDateToISO(startTimeDateObj)}
Experiment Start (UTC),${UTCDateToISO(startTimeDateObj)}
Experiment Start (UTC/ISO Format),${startTimeDateObj.toISOString()}
Time Elapsed (hh:mm:ss.ddd),${timeElapsed}
Task Type,${experimentType}
Preset,${preset}
Total Number of Questions,${answerSequence.length}
Typist Sequence,${typistSequence.map((typistPair) => typistPair.join('-')).join(',')}
Correct Answers,${correctCount}
Incorrect Answers,${answerSequence.length - correctCount}
Playback Speed,${playbackSpeed}
Is Progress Bar Visible,${isProgressBarVisible}
Use Varied Keystroke Sound,${variedKeystrokeSound}
`;
        if (experimentType === 'whoTypedIt') {
            summary += `Repitions for Each Typist Clip,${repsPerTrainingClip}`;
            if (repsPerTrainingClip > 1) {
                summary += `Silence between Repitions (ms),${silenceBetweenReps}
`;
            }
        }
        summary += `========================
Answers to Each Question
========================
Question No.,${metrics},Question Answered Correctly?
`;
        for (let i = 0; i < answerSequence.length; i++) {
            let subjectAnswer = null;
            switch (experimentType) {
                case 'whoTypedIt':
                    subjectAnswer = typistSequence[i][answerIndexSequence[i]];
                    break;
                case 'areTheyTheSame':
                    subjectAnswer = `${answerIndexSequence[i]}%`;
                    break;
                default:
                    break;
            }
            summary += `${i + 1},${subjectAnswer},${answerSequence[i]}\n`;
        }

        summary += `=========
Event Log
=========
Subject ID,Question No.,Timestamp (UTC),Timestamp (Local),Time Elapsed (hh:mm:ss.ddd),${typistSequence[0]
            .map((_, typistIndex) => `Typist ${typistIndex + 1}`)
            .join(',')}${testCip},Event,Typist Played,${metrics},Decision
`;
        download(`${subjectID}_${preset}_${localeDateToISONoPunct(startTimeDateObj)}.csv`, summary + logText);
    };

    return (
        <Button variant={'contained'} disableElevation onClick={handleDownload}>
            Download Experiment Log
        </Button>
    );
};

export default DownloadButton;
