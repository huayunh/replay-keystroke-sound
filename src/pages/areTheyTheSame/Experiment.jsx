import * as React from 'react';

import SoundPlayerCard from '../../components/SoundPlayerCard';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Fade from '@mui/material/Fade';
import Slider from '@mui/material/Slider';
import DoneIcon from '@mui/icons-material/Done';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectAnswer, submitAnswer } from '../../redux/appSlice';

import Data from '../../assets/data.json';
import { CONFIG_PANEL_WIDTH } from '../../shared/constants';
import { getDownDownStartTimes } from '../../shared/utils';

const styles = {
    pageRoot: {
        width: '100%',
        backgroundColor: 'background.default',
        transition: (theme) => theme.transitions.create('width'),
    },
    pageRootConfigPanelOpen: {
        width: `calc(100% - ${CONFIG_PANEL_WIDTH}px)`,
        transition: (theme) => theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
    },
};

const sliderStyle = {
    '& .MuiSlider-thumb': {
        height: 16,
        width: 16,
    },
};
const sliderThumbHiddenStyle = {
    '& .MuiSlider-thumb': {
        opacity: 0,
    },
};

function ExperimentPage() {
    const dispatch = useDispatch();
    const selectedAnswer = useSelector((state) => state.app.selectedAnswer);
    const isConfigPanelOpen = useSelector((state) => state.app.isConfigPanelOpen);
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const currentPage = useSelector((state) => state.app.currentPage);
    const numberOfScreensInCurrentPhase = useSelector((state) => state.app.numberOfScreensInCurrentPhase);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const currentTrainingSubjectNameList = useSelector((state) => state.app.currentTrainingSubjectNameList);
    const [showSubmitMessage, setShowSubmitMessage] = React.useState(false);
    const [showPageBody, setShowPageBody] = React.useState(true);
    const [clipListened, setClipListened] = React.useState(
        new Array(currentTrainingSubjectNameList.length).fill(false)
    );
    const allClipsListened = React.useMemo(() => {
        return clipListened.reduce((prev, curr) => prev && curr);
    }, [clipListened]);
    const [hasInitialConfidenceValue, setHasInitialConfidenceValue] = React.useState(false);

    const handleSubmit = () => {
        const clipsAreTheSame = currentTrainingSubjectNameList.reduce((prev, curr) => prev === curr);
        if (selectedAnswer > 0) {
            dispatch(submitAnswer(clipsAreTheSame ? 'Correct' : 'Incorrect'));
        } else if (selectedAnswer < 0) {
            dispatch(submitAnswer(clipsAreTheSame ? 'Incorrect' : 'Correct'));
        } else {
            // subject was unsure, treat as an incorrect
            dispatch(submitAnswer('Incorrect'));
        }

        setShowSubmitMessage(true);
        setTimeout(() => {
            setShowSubmitMessage(false);
        }, 1500);

        setShowPageBody(false);
        setTimeout(() => {
            setShowPageBody(true);
        }, 500);

        setClipListened(new Array(currentTrainingSubjectNameList.length).fill(false));
        setHasInitialConfidenceValue(false);
    };

    const getSubjectClip = React.useCallback(
        (subjectName, subjectIndex) => (
            <SoundPlayerCard
                title={`Clip ${subjectIndex + 1}`}
                clipIndex={subjectIndex}
                downDownTimerStart={getDownDownStartTimes(
                    Data[subjectName].slice(-repsPerTrainingClip),
                    silenceBetweenReps
                )}
                key={subjectIndex}
                onClick={() => {
                    setClipListened((oldList) => {
                        const newList = oldList.slice();
                        newList[subjectIndex] = true;
                        return newList;
                    });
                }}
            />
        ),
        // need to force a render when page turns
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, repsPerTrainingClip, silenceBetweenReps]
    );
    return (
        <Box sx={[styles.pageRoot, isConfigPanelOpen && styles.pageRootConfigPanelOpen]}>
            <Stack direction={'column'} spacing={4} sx={{ width: 600, margin: '32px auto 0' }}>
                <Breadcrumbs sx={{ alignItems: 'flex-end' }}>
                    <Typography variant={'h4'}>{currentPage + 1}</Typography>
                    <Typography variant={'h6'} color={'text.secondary'}>
                        {numberOfScreensInCurrentPhase}
                    </Typography>
                </Breadcrumbs>
                <Fade in={showPageBody}>
                    <Stack spacing={3}>
                        <Stack direction={'column'} spacing={4}>
                            <Stack direction={'column'} spacing={2}>
                                <Typography variant={'h4'}>Are these two typing clips the same?</Typography>
                                <Typography variant={'body1'}>
                                    Listen to the two typing samples below, and make your best guess.
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} spacing={2}>
                                {currentTrainingSubjectNameList.map(getSubjectClip)}
                            </Stack>
                        </Stack>
                        <Fade in={allClipsListened}>
                            <Stack spacing={2} style={{ margin: '40px 0' }}>
                                <Typography variant={'body1'}>
                                    Click on the blue line below to indicate your answer and how confident you feel
                                    toward your answer:
                                </Typography>
                                <Slider
                                    sx={[sliderStyle, !hasInitialConfidenceValue && sliderThumbHiddenStyle]}
                                    track={false}
                                    marks={[
                                        { value: -100, label: 'Definitely NOT the same' },
                                        { value: 0, label: 'I am not sure' },
                                        { value: 100, label: 'Definitely the same' },
                                    ]}
                                    max={100}
                                    min={-100}
                                    defaultValue={-99}
                                    onMouseDown={() => setHasInitialConfidenceValue(true)}
                                    onChangeCommitted={(_, val) => {
                                        dispatch(
                                            selectAnswer({
                                                index: val,
                                                text: `${Math.abs(val)}% confident they are ${
                                                    val > 0 ? '' : 'not '
                                                }the same`,
                                            })
                                        );
                                    }}
                                    color={'secondary'}
                                />
                            </Stack>
                        </Fade>
                    </Stack>
                </Fade>
                <Stack spacing={2} direction={'row-reverse'}>
                    <Button
                        variant={'contained'}
                        disableElevation
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null || !allClipsListened}
                        color={'secondary'}
                    >
                        Submit
                    </Button>
                    <Fade in={showSubmitMessage}>
                        <Stack spacing={0.5} direction={'row'} alignItems={'center'} color={'success.main'}>
                            <DoneIcon />
                            <Typography variant={'body2'}>Submitted</Typography>
                        </Stack>
                    </Fade>
                </Stack>
            </Stack>
        </Box>
    );
}

export default ExperimentPage;
