import React from 'react';

// components
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, Select, MenuItem, Stack, Divider, TextField, Button } from '@mui/material';

// icons
import CloseIcon from '@mui/icons-material/Close';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { closeConfigPanel, clearPlayingClip, clearTimeoutIDs, toggleFABVisibility } from '../redux/appSlice';
import {
    changeTrainingSubjectA,
    changeTrainingSubjectB,
    changeTestSubject,
    randomizeSubjects,
} from '../redux/subjectSlice';
import { clearLog } from '../redux/logSlice';
import {
    setSilenceBetweenReps as _setSilenceBetweenReps,
    setRepsPerTrainingClip as _setRepsPerTrainingClip,
    setPlaybackSpeed,
} from '../redux/playbackSlice';

import { rangeValue_repsPerTrainingClip, rangeValue_silenceBetweenReps, download } from '../shared/utils';
import { CONFIG_PANEL_WIDTH } from '../shared/constants';
import Data from '../assets/data.json';

const boxStyle = {
    width: CONFIG_PANEL_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
};

const getSubjectSelectMenuItem = () => {
    return Data.subjects.map((subjectName, index) => (
        <MenuItem key={index} value={subjectName}>
            {subjectName}
        </MenuItem>
    ));
};

const ConfigPanel = () => {
    const dispatch = useDispatch();
    const isConfigPanelOpen = useSelector((state) => state.app.isConfigPanelOpen);
    const invisibleFAB = useSelector((state) => state.app.invisibleFAB);
    const testSubject = useSelector((state) => state.subject.testSubject);
    const trainingSubjectA = useSelector((state) => state.subject.trainingSubjectA);
    const trainingSubjectB = useSelector((state) => state.subject.trainingSubjectB);
    const _repsPerTrainingClip = useSelector((state) => state.playback.repsPerTrainingClip);
    const _silenceBetweenReps = useSelector((state) => state.playback.silenceBetweenReps);
    const playbackSpeed = useSelector((state) => state.playback.playbackSpeed);
    const logText = useSelector((state) => state.log.logText);

    const [repsPerTrainingClip, setRepsPerTrainingClip] = React.useState(_repsPerTrainingClip);
    const [silenceBetweenReps, setSilenceBetweenReps] = React.useState(_silenceBetweenReps);

    const handleClickCloseIcon = React.useCallback(() => {
        dispatch(closeConfigPanel());
    }, [dispatch]);

    const handleDownload = React.useCallback(() => {
        dispatch(clearPlayingClip());
        dispatch(clearTimeoutIDs());
        download('data.log', logText);
        dispatch(clearLog());
        dispatch(randomizeSubjects());
    }, [dispatch, logText]);

    return (
        <Drawer anchor={'right'} open={isConfigPanelOpen} variant={'persistent'}>
            <Box sx={boxStyle}>
                <Box margin={2}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'} marginBottom={1}>
                        <IconButton onClick={handleClickCloseIcon} edge={'start'}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant={'h5'}>Settings</Typography>
                    </Stack>
                    <Typography variant={'body2'}>Bookmark the URL to save these settings.</Typography>
                </Box>
                <Stack spacing={4} margin={2} marginTop={4} divider={<Divider flexItem />}>
                    {/* Text Clip */}
                    <FormControl>
                        <InputLabel
                            id="test-subject"
                            error={![trainingSubjectA, trainingSubjectB].includes(testSubject)}
                        >
                            Test Clip
                        </InputLabel>
                        <Select
                            labelId="test-subject"
                            value={[trainingSubjectA, trainingSubjectB].includes(testSubject) ? testSubject : ''}
                            label="Test Clip"
                            onChange={(event) => {
                                dispatch(changeTestSubject(event.target.value));
                            }}
                            error={![trainingSubjectA, trainingSubjectB].includes(testSubject)}
                        >
                            <MenuItem value={trainingSubjectA}>{trainingSubjectA}</MenuItem>
                            <MenuItem value={trainingSubjectB}>{trainingSubjectB}</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Subjects */}
                    <Stack direction={'column'} spacing={3}>
                        <Stack direction={'row'} spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel id="training-subject-a">Subject A</InputLabel>
                                <Select
                                    labelId="training-subject-a"
                                    value={trainingSubjectA}
                                    label="Subject A"
                                    onChange={(event) => {
                                        dispatch(changeTrainingSubjectA(event.target.value));
                                    }}
                                >
                                    {getSubjectSelectMenuItem()}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="training-subject-b">Subject B</InputLabel>
                                <Select
                                    labelId="training-subject-b"
                                    value={trainingSubjectB}
                                    label="Subject B"
                                    onChange={(event) => {
                                        dispatch(changeTrainingSubjectB(event.target.value));
                                    }}
                                >
                                    {getSubjectSelectMenuItem()}
                                </Select>
                            </FormControl>
                        </Stack>
                        <TextField
                            label="Reps for Each Subject Clip"
                            variant="outlined"
                            value={repsPerTrainingClip}
                            type={'number'}
                            onBlur={() => {
                                const newVal = rangeValue_repsPerTrainingClip(
                                    _repsPerTrainingClip,
                                    repsPerTrainingClip
                                );
                                setRepsPerTrainingClip(newVal);
                                dispatch(_setRepsPerTrainingClip(newVal));
                            }}
                            onChange={(e) => {
                                setRepsPerTrainingClip(e.target.value);
                            }}
                        />
                        <TextField
                            label="Silence between Reps"
                            variant="outlined"
                            value={silenceBetweenReps}
                            type={'number'}
                            onBlur={() => {
                                const newVal = rangeValue_silenceBetweenReps(_silenceBetweenReps, silenceBetweenReps);
                                setSilenceBetweenReps(newVal);
                                dispatch(_setSilenceBetweenReps(newVal));
                            }}
                            onChange={(e) => {
                                setSilenceBetweenReps(e.target.value);
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                            }}
                        />
                    </Stack>
                    {/* MISC Controls */}
                    <Stack direction="column" spacing={2}>
                        <FormControl>
                            <InputLabel id="playback-speed">Playback Speed</InputLabel>
                            <Select
                                labelId="playback-speed"
                                value={playbackSpeed}
                                label="Playback Speed"
                                onChange={(event) => {
                                    dispatch(setPlaybackSpeed(event.target.value));
                                }}
                            >
                                <MenuItem value={0.5}>x0.5</MenuItem>
                                <MenuItem value={0.75}>x0.75</MenuItem>
                                <MenuItem value={1.0}>x1.0</MenuItem>
                                <MenuItem value={1.25}>x1.25</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={invisibleFAB}
                                    onChange={() => {
                                        dispatch(toggleFABVisibility());
                                    }}
                                />
                            }
                            label="Hide Config Panel Button"
                        />
                    </Stack>
                </Stack>
                <Box flex={1} />
                <Stack margin={2} spacing={1}>
                    <Button variant={'contained'} disableElevation onClick={handleDownload}>
                        Download Experiment Log
                    </Button>
                    <Typography variant={'caption'} color={'textSecondary'}>
                        This will download data and initiate a new session.
                    </Typography>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ConfigPanel;
