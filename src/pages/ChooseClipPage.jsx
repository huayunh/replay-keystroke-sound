import * as React from 'react';

import SoundPlayerCard from '../components/SoundPlayerCard';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Fade from '@mui/material/Fade';
import DoneIcon from '@mui/icons-material/Done';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { submitAnswer } from '../redux/appSlice';

import Data from '../assets/data.json';
import { KEYS, CONFIG_PANEL_WIDTH } from '../shared/constants';

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

const getDownDownStartTimes = (reps, silenceBetweenReps) => {
    const downDownTimerStart = [];
    reps.forEach((rep, repIndex) => {
        const newRepStart = downDownTimerStart.length;
        if (repIndex !== 0) {
            downDownTimerStart[newRepStart] = downDownTimerStart[newRepStart - 1] + silenceBetweenReps;
        } else {
            downDownTimerStart[0] = 0;
        }
        for (let i = 1; i < KEYS.length; i++) {
            downDownTimerStart[newRepStart + i] =
                downDownTimerStart[newRepStart + i - 1] +
                Math.round(parseFloat(rep[`DD.${KEYS[i - 1]}.${KEYS[i]}`]) * 1000);
        }
    });
    return downDownTimerStart;
};

function ChooseClipPage() {
    const dispatch = useDispatch();
    const selectedAnswer = useSelector((state) => state.app.selectedAnswer);
    const isConfigPanelOpen = useSelector((state) => state.app.isConfigPanelOpen);
    const repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const currentPage = useSelector((state) => state.app.currentPage);
    const numberOfScreensInCurrentPhase = useSelector((state) => state.app.numberOfScreensInCurrentPhase);
    const silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const currentTestSubjectName = useSelector((state) => state.app.currentTestSubjectName);
    const currentTrainingSubjectNameList = useSelector((state) => state.app.currentTrainingSubjectNameList);
    const [showSubmitMessage, setShowSubmitMessage] = React.useState(false);
    const [showPageBody, setShowPageBody] = React.useState(true);
    const [testClipListened, setTestClipListened] = React.useState(false);

    const handleSubmit = () => {
        dispatch(
            submitAnswer(currentTrainingSubjectNameList[selectedAnswer] === currentTestSubjectName ? 'True' : 'False')
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
                downDownTimerStart={getDownDownStartTimes([Data[currentTestSubjectName][0]], 0)}
                title={'Test Clip'}
                clipIndex={-1}
                selectable={false}
            />
        ),
        // need to force a render when page turns
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, currentTestSubjectName]
    );

    const getSubjectClip = React.useCallback(
        (subjectName, subjectIndex) => (
            <SoundPlayerCard
                title={`Subject ${subjectIndex + 1}`}
                clipIndex={subjectIndex}
                downDownTimerStart={getDownDownStartTimes(
                    Data[subjectName].slice(-repsPerTrainingClip),
                    silenceBetweenReps
                )}
                disabled={!testClipListened}
                selectable
                key={subjectIndex}
            />
        ),
        // need to force a render when page turns
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, repsPerTrainingClip, silenceBetweenReps, testClipListened]
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
                    <Stack direction={'column'} spacing={4}>
                        <Box
                            onClick={() => {
                                setTestClipListened(true);
                            }}
                        >
                            {getTestClip()}
                        </Box>
                        <Stack direction={'column'} spacing={2}>
                            <Typography variant={'h4'}>Who typed the Test Clip?</Typography>
                            <Typography variant={'body1'}>
                                Listen to the two typing samples below, and make your best guess.
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            {currentTrainingSubjectNameList.map(getSubjectClip)}
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

export default ChooseClipPage;
