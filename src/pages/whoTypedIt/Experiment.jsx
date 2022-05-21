import * as React from 'react';

import SoundPlayerCard from '../../components/SoundPlayerCard';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Fade from '@mui/material/Fade';
import DoneIcon from '@mui/icons-material/Done';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { submitAnswer } from '../../redux/appSlice';

import Data from '../../assets/data.json';
import { getDownDownStartTimes } from '../../shared/utils';

const styles = {
    pageRoot: {
        width: '100%',
        backgroundColor: 'background.default',
    },
};

function ExperimentPage() {
    const dispatch = useDispatch();
    const selectedAnswer = useSelector((state) => state.app.selectedAnswer);
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const currentPage = useSelector((state) => state.app.currentPage);
    const numberOfScreensInCurrentPhase = useSelector((state) => state.app.numberOfScreensInCurrentPhase);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const currentTestTypistName = useSelector((state) => state.app.currentTestTypistName);
    const currentTrainingTypistNameList = useSelector((state) => state.app.currentTrainingTypistNameList);
    const [showSubmitMessage, setShowSubmitMessage] = React.useState(false);
    const [showPageBody, setShowPageBody] = React.useState(true);
    const [testClipListened, setTestClipListened] = React.useState(false);

    const handleSubmit = () => {
        dispatch(
            submitAnswer(currentTrainingTypistNameList[selectedAnswer] === currentTestTypistName ? 'Correct' : 'Wrong')
        );

        setTestClipListened(false);

        setShowSubmitMessage(true);
        setTimeout(() => {
            setShowSubmitMessage(false);
        }, 1500);

        setShowPageBody(false);
        setTimeout(() => {
            setShowPageBody(true);
        }, 500);
    };

    const getTestClip = React.useCallback(
        () => (
            <SoundPlayerCard
                downDownTimerStart={getDownDownStartTimes([Data[currentTestTypistName][0]], 0)}
                title={'Test Clip'}
                clipIndex={-1}
                selectable={false}
                secretIdentifier={currentTestTypistName}
            />
        ),
        // need to force a render when page turns
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, currentTestTypistName]
    );

    const getTypistClip = React.useCallback(
        (typistName, typistIndex) => (
            <SoundPlayerCard
                title={`Typist ${typistIndex + 1}`}
                clipIndex={typistIndex}
                downDownTimerStart={getDownDownStartTimes(
                    Data[typistName].slice(-repsPerTrainingClip),
                    silenceBetweenReps
                )}
                disabled={!testClipListened}
                selectable
                key={typistIndex}
                secretIdentifier={typistName}
            />
        ),
        // need to force a render when page turns
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, repsPerTrainingClip, silenceBetweenReps, testClipListened]
    );
    return (
        <Box sx={[styles.pageRoot]}>
            <Stack direction={'column'} spacing={3} sx={{ width: 600, margin: '32px auto 0' }}>
                <Breadcrumbs sx={{ alignItems: 'flex-end' }}>
                    <Typography variant={'h4'}>{currentPage + 1}</Typography>
                    <Typography variant={'h6'} color={'text.secondary'}>
                        {numberOfScreensInCurrentPhase}
                    </Typography>
                </Breadcrumbs>
                <Fade in={showPageBody}>
                    <Stack direction={'column'} spacing={4}>
                        <Box
                            onClick={() => {
                                setTestClipListened(true);
                            }}
                        >
                            {getTestClip()}
                        </Box>
                        <Stack direction={'column'} spacing={1}>
                            <Typography variant={'h4'}>Who typed the Test Clip?</Typography>
                            <Typography variant={'body1'}>
                                Listen to the two typing samples below, and make your best guess.
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            {currentTrainingTypistNameList.map(getTypistClip)}
                        </Stack>
                    </Stack>
                </Fade>
                <Stack spacing={2} direction={'row-reverse'}>
                    <Button
                        variant={'contained'}
                        disableElevation
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null || !testClipListened}
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
