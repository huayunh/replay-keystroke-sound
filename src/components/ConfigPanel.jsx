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
import {
    changeCurrentTrainingSubjectName,
    closeConfigPanel,
    toggleFABVisibility,
    setRepsPerTrainingClip as _setRepsPerTrainingClip,
    setSilenceBetweenReps as _setSilenceBetweenReps,
    clearAllAudios,
    changeCurrentTestSubjectName,
    setPlaybackSpeed,
    setPreset,
} from '../redux/appSlice';

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
    const currentTestSubjectName = useSelector((state) => state.app.currentTestSubjectName);
    const currentTrainingSubjectNameList = useSelector((state) => state.app.currentTrainingSubjectNameList);
    const _repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const _silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const logText = useSelector((state) => state.app.logText);
    const preset = useSelector((state) => state.app.preset);
    const participantID = useSelector((state) => state.app.participantID);
    const experimentType = useSelector((state) => state.app.experimentType);

    // store value locally with "useState", and submit value on blur
    const [repsPerTrainingClip, setRepsPerTrainingClip] = React.useState(_repsPerTrainingClip);
    const [silenceBetweenReps, setSilenceBetweenReps] = React.useState(_silenceBetweenReps);

    const handleClickCloseIcon = React.useCallback(() => {
        dispatch(closeConfigPanel());
    }, [dispatch]);

    const handleDownload = React.useCallback(() => {
        dispatch(clearAllAudios());
        download(`${participantID}.log`, logText);
    }, [dispatch, logText, participantID]);

    const isTestSubjectInTrainingSubjects = React.useMemo(() => {
        return currentTrainingSubjectNameList.includes(currentTestSubjectName);
    }, [currentTrainingSubjectNameList, currentTestSubjectName]);

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
                <Stack spacing={4} margin={2} marginTop={3} divider={<Divider flexItem />}>
                    <Stack direction={'column'} spacing={2}>
                        {/* Preset */}
                        <FormControl>
                            <InputLabel id="preset">Preset</InputLabel>
                            <Select
                                labelId="preset"
                                value={preset}
                                label="Preset"
                                onChange={(event) => {
                                    dispatch(setPreset(event.target.value));
                                }}
                            >
                                <MenuItem value={'Random'}>Random</MenuItem>
                                <Divider />
                                <MenuItem value={'Preset A'}>Preset A</MenuItem>
                                <MenuItem value={'Preset B'}>Preset B</MenuItem>
                                <MenuItem value={'Preset C'}>Preset C</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Test Clip */}
                        {experimentType !== 'areTheyTheSame' && (
                            <FormControl disabled={preset !== 'Random'}>
                                <InputLabel id="test-subject" error={!isTestSubjectInTrainingSubjects}>
                                    Test Clip
                                </InputLabel>
                                <Select
                                    labelId="test-subject"
                                    value={isTestSubjectInTrainingSubjects ? currentTestSubjectName : ''}
                                    label="Test Clip"
                                    onChange={(event) => {
                                        dispatch(changeCurrentTestSubjectName(event.target.value));
                                    }}
                                    error={!isTestSubjectInTrainingSubjects}
                                >
                                    {currentTrainingSubjectNameList.map((trainingSubjectName, trainingSubjectIndex) => (
                                        <MenuItem value={trainingSubjectName} key={trainingSubjectIndex}>
                                            {trainingSubjectName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {/* Subjects */}
                        <Stack direction={'row'} spacing={2}>
                            {currentTrainingSubjectNameList.map((subjectName, subjectIndex) => (
                                <FormControl fullWidth key={subjectIndex} disabled={preset !== 'Random'}>
                                    <InputLabel id="training-subject-a">Subject {subjectIndex + 1}</InputLabel>
                                    <Select
                                        labelId="training-subject-a"
                                        value={subjectName}
                                        label={`Subject ${subjectIndex + 1}`}
                                        onChange={(event) => {
                                            dispatch(
                                                changeCurrentTrainingSubjectName({
                                                    name: event.target.value,
                                                    index: subjectIndex,
                                                })
                                            );
                                        }}
                                    >
                                        {getSubjectSelectMenuItem()}
                                    </Select>
                                </FormControl>
                            ))}
                        </Stack>
                    </Stack>
                    {/* MISC Controls */}
                    <Stack direction="column" spacing={2}>
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
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ConfigPanel;
