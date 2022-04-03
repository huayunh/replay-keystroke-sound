import SoundPlayerCard from '../components/SoundPlayerCard';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedClip } from '../redux/appSlice';
import { randomizeSubjects } from '../redux/subjectSlice';
import { logAction, clearLog } from '../redux/logSlice';

import Data from '../assets/data.json';
import { KEYS, CONFIG_PANEL_WIDTH } from '../shared/constants';
import { useEffect } from 'react';

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
    const selectedClip = useSelector((state) => state.app.selectedClip);
    const isConfigPanelOpen = useSelector((state) => state.app.isConfigPanelOpen);
    const repsPerTrainingClip = useSelector((state) => state.playback.repsPerTrainingClip);
    const silenceBetweenReps = useSelector((state) => state.playback.silenceBetweenReps);
    const testSubject = useSelector((state) => state.subject.testSubject);
    const trainingSubjectA = useSelector((state) => state.subject.trainingSubjectA);
    const trainingSubjectB = useSelector((state) => state.subject.trainingSubjectB);

    const handleSubmit = () => {
        dispatch(clearSelectedClip());
        dispatch(logAction(`Submit: ${['A', 'B'][selectedClip]}. \n---`));
        dispatch(randomizeSubjects());
        dispatch(logAction(`New: A=${trainingSubjectA}, B=${trainingSubjectB}, Test=${testSubject}.`));
    };
    useEffect(() => {
        dispatch(clearLog());
        dispatch(randomizeSubjects());
        dispatch(logAction(`New: A=${trainingSubjectA}, B=${trainingSubjectB}, Test=${testSubject}.`));
        // only want this to run the first time this page is loaded
        // eslint-disable-next-line
    }, [dispatch]);
    return (
        <Box sx={[styles.pageRoot, isConfigPanelOpen && styles.pageRootConfigPanelOpen]}>
            <Stack direction={'column'} spacing={4} sx={{ width: 600, margin: '32px auto 0' }}>
                <SoundPlayerCard
                    title={'Test Clip'}
                    isTestSubject
                    downDownTimerStart={getDownDownStartTimes([Data[testSubject][0]], 0)}
                />
                <Stack direction={'column'} spacing={2}>
                    <Typography variant={'h4'}>Who typed the Test Clip?</Typography>
                    <Typography variant={'Body1'}>
                        Listen to the two typing samples below, and make your best guess.
                    </Typography>
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <SoundPlayerCard
                        title={'Subject A'}
                        clipIndex={0}
                        downDownTimerStart={getDownDownStartTimes(
                            Data[trainingSubjectA].slice(-repsPerTrainingClip),
                            silenceBetweenReps
                        )}
                    />
                    <SoundPlayerCard
                        title={'Subject B'}
                        clipIndex={1}
                        downDownTimerStart={getDownDownStartTimes(
                            Data[trainingSubjectB].slice(-repsPerTrainingClip),
                            silenceBetweenReps
                        )}
                    />
                </Stack>
                <Box>
                    <Button
                        variant={'contained'}
                        disableElevation
                        onClick={handleSubmit}
                        disabled={selectedClip === -1}
                        color={'secondary'}
                    >
                        Submit
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}

export default ChooseClipPage;
