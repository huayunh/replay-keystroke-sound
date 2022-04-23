import * as React from 'react';

import { getURLParameterObject } from '../shared/utils';
import {
    setPreset,
    setSubjectID,
    setPlaybackSpeed,
    setIsFABVisible,
    setIsProgressBarVisible,
    setSilenceBetweenReps,
    setRepsPerTrainingClip,
} from '../redux/appSlice';
import { useSelector, useDispatch } from 'react-redux';

const useUpdateStateFromURLParameter = () => {
    const dispatch = useDispatch();
    const parameters = getURLParameterObject();

    const preset = useSelector((state) => state.app.preset);
    const subjectID = useSelector((state) => state.app.subjectID);
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const isFABVisible = useSelector((state) => state.app.isFABVisible);
    const isProgressBarVisible = useSelector((state) => state.app.isProgressBarVisible);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);

    React.useEffect(() => {
        if (parameters.preset && parameters.preset !== preset) {
            dispatch(setPreset(parameters.preset));
        }
        if (parameters.subjectID && parameters.subjectID !== subjectID) {
            dispatch(setSubjectID(parameters.subjectID));
        }
        if (parameters.playbackSpeed) {
            const parsedPlaybackSpeed = parseFloat(parameters.playbackSpeed);
            if (parsedPlaybackSpeed !== playbackSpeed) {
                dispatch(setPlaybackSpeed(parsedPlaybackSpeed));
            }
        }
        if (parameters.isFABVisible) {
            const parsedIsFABVisible = parameters.isFABVisible === 'true';
            if (parsedIsFABVisible !== isFABVisible) {
                dispatch(setIsFABVisible(parsedIsFABVisible));
            }
        }
        if (parameters.isProgressBarVisible) {
            const parsedIsProgressBarVisible = parameters.isProgressBarVisible === 'true';
            if (parsedIsProgressBarVisible !== isProgressBarVisible) {
                dispatch(setIsProgressBarVisible(parsedIsProgressBarVisible));
            }
        }
        if (parameters.silenceBetweenReps) {
            const parsedSilenceBetweenReps = parseInt(parameters.silenceBetweenReps);
            if (parsedSilenceBetweenReps !== silenceBetweenReps) {
                dispatch(setSilenceBetweenReps(parsedSilenceBetweenReps));
            }
        }
        if (parameters.repsPerTrainingClip) {
            const parsedRepsPerTrainingClip = parseInt(parameters.repsPerTrainingClip);
            if (parsedRepsPerTrainingClip !== repsPerTrainingClip) {
                dispatch(setRepsPerTrainingClip(parsedRepsPerTrainingClip));
            }
        }
    }, [
        dispatch,
        parameters,
        preset,
        subjectID,
        playbackSpeed,
        isFABVisible,
        isProgressBarVisible,
        silenceBetweenReps,
        repsPerTrainingClip,
    ]);
};

export default useUpdateStateFromURLParameter;
