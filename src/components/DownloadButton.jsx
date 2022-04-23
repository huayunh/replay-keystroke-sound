import React from 'react';

// components
import Button from '@mui/material/Button';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { clearAllAudios } from '../redux/appSlice';

import { download } from '../shared/utils';

const DownloadButton = () => {
    const dispatch = useDispatch();
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const logText = useSelector((state) => state.app.logText);
    const preset = useSelector((state) => state.app.preset);
    const subjectID = useSelector((state) => state.app.subjectID);
    const experimentType = useSelector((state) => state.app.experimentType);
    const experimentStartTime = useSelector((state) => state.app.experimentStartTime);
    const typistSequence = useSelector((state) => state.app.typistSequence);
    const answerSequence = useSelector((state) => state.app.answerSequence);
    const answerIndexSequence = useSelector((state) => state.app.answerIndexSequence);
    const isProgressBarVisible = useSelector((state) => state.app.isProgressBarVisible);

    const handleDownload = () => {
        dispatch(clearAllAudios());
        const correctCount = answerSequence.filter((ans) => ans === 'Correct').length;
        const startTimeDateObj = new Date(experimentStartTime);
        let summary = `Subject,${subjectID}
Time,${startTimeDateObj.toLocaleDateString()} ${startTimeDateObj.toLocaleTimeString()}
Type,${experimentType}
Preset,${preset}
Total Number of Questions,${answerSequence.length}
Typist Sequence,${typistSequence.map((typistPair) => typistPair.join('-')).join(',')}
CorrectAnswers,${correctCount}
IncorrectAnswers,${answerSequence.length - correctCount}
Playback Speed,${playbackSpeed}
Is Progress Bar Visible,${isProgressBarVisible}
`;
        if (experimentType === 'whoTypedIt') {
            summary += `Repitions for Each Typist Clip,${repsPerTrainingClip}
Silence between Repitions (ms),${silenceBetweenReps}
`;
        }
        summary += `========================
Answers to Each Question
========================
Question No.,${experimentType === 'areTheyTheSame' ? 'Confidence Level' : 'Raw Data'},Question Answered Correctly?
`;
        for (let i = 0; i < answerSequence.length; i++) {
            summary += `${i + 1},${answerIndexSequence[i]},${answerSequence[i]}\n`;
        }

        summary += `===============
Detailed Events
===============
Time Elapsed Since Previous Log Item (seconds),Action,Raw Data,Explanation
`;
        download(`${subjectID}.csv`, summary + logText);
    };

    return (
        <Button variant={'contained'} disableElevation onClick={handleDownload}>
            Download Experiment Log
        </Button>
    );
};

export default DownloadButton;
