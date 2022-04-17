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
    const participantID = useSelector((state) => state.app.participantID);
    const experimentType = useSelector((state) => state.app.experimentType);
    const experimentStartTime = useSelector((state) => state.app.experimentStartTime);
    const subjectSequence = useSelector((state) => state.app.subjectSequence);
    const answerSequence = useSelector((state) => state.app.answerSequence);
    const answerIndexSequence = useSelector((state) => state.app.answerIndexSequence);
    const handleDownload = () => {
        dispatch(clearAllAudios());
        const correctCount = answerSequence.filter((ans) => ans === 'Correct').length;
        const startTimeDateObj = new Date(experimentStartTime);
        let summary = `Participant,${participantID}
Time,${startTimeDateObj.toLocaleDateString()} ${startTimeDateObj.toLocaleTimeString()}
Type,${experimentType}
Preset,${preset}
Total Number of Questions,${answerSequence.length}
Sequence,${subjectSequence.map((subjectPair) => subjectPair.join('-')).join(',')}
Answer Correct:Incorrect,${correctCount}:${answerSequence.length - correctCount}
Playback Speed,${playbackSpeed}
`;
        if (experimentType === 'whoTypedIt') {
            summary += `Repitions for Each Subject Clip,${repsPerTrainingClip}
Silence between Repitions (ms),${silenceBetweenReps}
`;
        }
        summary += ` ========================
Answers to Each Question
========================
Question No.,Raw Data,Question Answered Correctly?
`;
        for (let i = 0; i < answerSequence.length; i++) {
            summary += `${i + 1},${answerIndexSequence[i]},${answerSequence[i]}\n`;
        }

        summary += `===============
Detailed Events
===============
Time Elapsed Since Previous Log Item (seconds),Action,Raw Data,Explanation
`;
        download(`${participantID}.csv`, summary + logText);
    };

    return (
        <Button variant={'contained'} disableElevation onClick={handleDownload}>
            Download Experiment Log
        </Button>
    );
};

export default DownloadButton;
