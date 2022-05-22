import React from 'react';

// components
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import { FormControl, InputLabel, Select, MenuItem, Stack, Divider, TextField } from '@mui/material';
import DownloadButton from './DownloadButton';

// icons
import CloseIcon from '@mui/icons-material/Close';

// redux
import { useSelector, useDispatch } from 'react-redux';
import {
    changeCurrentTrainingTypistName,
    closeConfigPanel,
    toggleFABVisibility,
    toggleProgressBarVisibility,
    setRepsPerTrainingClip as _setRepsPerTrainingClip,
    setSilenceBetweenReps as _setSilenceBetweenReps,
    changecurrentTestTypistName,
    setPlaybackSpeed,
    setPreset,
    setVariedKeystrokeSound,
} from '../redux/appSlice';

import { rangeValue_repsPerTrainingClip, rangeValue_silenceBetweenReps } from '../shared/utils';
import { CONFIG_PANEL_WIDTH } from '../shared/constants';
import Data from '../assets/data.json';

const boxStyle = {
    width: CONFIG_PANEL_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
};

const getTypistSelectMenuItem = () => {
    return Data.typists.map((typistName, index) => (
        <MenuItem key={index} value={typistName}>
            {typistName}
        </MenuItem>
    ));
};

const ConfigPanel = () => {
    const dispatch = useDispatch();
    const isConfigPanelOpen = useSelector((state) => state.app.isConfigPanelOpen);
    const isFABVisible = useSelector((state) => state.app.isFABVisible);
    const currentTestTypistName = useSelector((state) => state.app.currentTestTypistName);
    const currentTrainingTypistNameList = useSelector((state) => state.app.currentTrainingTypistNameList);
    const _repsPerTrainingClip = useSelector((state) => state.app.repsPerTrainingClip);
    const _silenceBetweenReps = useSelector((state) => state.app.silenceBetweenReps);
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const preset = useSelector((state) => state.app.preset);
    const experimentType = useSelector((state) => state.app.experimentType);
    const isProgressBarVisible = useSelector((state) => state.app.isProgressBarVisible);
    const variedKeystrokeSound = useSelector((state) => state.app.variedKeystrokeSound);

    // store value locally with "useState", and submit value on blur
    const [repsPerTrainingClip, setRepsPerTrainingClip] = React.useState(_repsPerTrainingClip);
    const [silenceBetweenReps, setSilenceBetweenReps] = React.useState(_silenceBetweenReps);

    const handleClickCloseIcon = React.useCallback(() => {
        dispatch(closeConfigPanel());
    }, [dispatch]);

    const isTestTypistInTrainingTypists = React.useMemo(() => {
        return currentTrainingTypistNameList.includes(currentTestTypistName);
    }, [currentTrainingTypistNameList, currentTestTypistName]);

    React.useEffect(() => {
        setSilenceBetweenReps(_silenceBetweenReps);
    }, [_silenceBetweenReps]);

    React.useEffect(() => {
        setRepsPerTrainingClip(_repsPerTrainingClip);
    }, [_repsPerTrainingClip]);

    return (
        <Drawer anchor={'left'} open={isConfigPanelOpen} variant={'persistent'}>
            <Box sx={boxStyle}>
                <Box margin={2}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'} marginBottom={0.5}>
                        <IconButton onClick={handleClickCloseIcon} edge={'start'}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant={'h6'}>Config Panel</Typography>
                    </Stack>
                    <Typography variant={'body2'} color={'text.secondary'}>
                        Bookmark the URL to save these settings.
                    </Typography>
                </Box>
                <Stack spacing={4} margin={2} marginTop={3} divider={<Divider flexItem />}>
                    <Stack direction={'column'} spacing={2}>
                        {/* Preset */}
                        <FormControl>
                            <InputLabel id="preset">Preset</InputLabel>
                            <Select
                                labelId="preset"
                                value={preset ? preset : ''}
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
                        {experimentType === 'whoTypedIt' && (
                            <FormControl disabled={preset !== 'Random'}>
                                <InputLabel id="test-typist" error={!isTestTypistInTrainingTypists}>
                                    Test Clip
                                </InputLabel>
                                <Select
                                    labelId="test-typist"
                                    value={isTestTypistInTrainingTypists ? currentTestTypistName : ''}
                                    label="Test Clip"
                                    onChange={(event) => {
                                        dispatch(changecurrentTestTypistName(event.target.value));
                                    }}
                                    error={!isTestTypistInTrainingTypists}
                                >
                                    {currentTrainingTypistNameList.map((trainingTypistName, trainingTypistIndex) => (
                                        <MenuItem value={trainingTypistName} key={trainingTypistIndex}>
                                            {trainingTypistName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {/* Typists */}
                        <Stack direction={'row'} spacing={2}>
                            {currentTrainingTypistNameList.map((typistName, typistIndex) => (
                                <FormControl fullWidth key={typistIndex} disabled={preset !== 'Random'}>
                                    <InputLabel id={`training-typist-${typistIndex}`}>
                                        Typist {typistIndex + 1}
                                    </InputLabel>
                                    <Select
                                        labelId={`training-typist-${typistIndex}`}
                                        value={typistName}
                                        label={`Typist ${typistIndex + 1}`}
                                        onChange={(event) => {
                                            dispatch(
                                                changeCurrentTrainingTypistName({
                                                    name: event.target.value,
                                                    index: typistIndex,
                                                })
                                            );
                                        }}
                                    >
                                        {getTypistSelectMenuItem()}
                                    </Select>
                                </FormControl>
                            ))}
                        </Stack>
                    </Stack>
                    {/* MISC Controls */}
                    <Stack direction="column" spacing={2}>
                        <TextField
                            label={'Reps for Each Typist Clip'}
                            variant={'outlined'}
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
                        <Collapse in={_repsPerTrainingClip !== 1}>
                            <TextField
                                label={'Silence between Reps'}
                                variant={'outlined'}
                                value={silenceBetweenReps}
                                type={'number'}
                                fullWidth
                                onBlur={() => {
                                    const newVal = rangeValue_silenceBetweenReps(
                                        _silenceBetweenReps,
                                        silenceBetweenReps
                                    );
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
                        </Collapse>
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
                                    checked={isFABVisible}
                                    onChange={() => {
                                        dispatch(toggleFABVisibility());
                                    }}
                                />
                            }
                            label={<Typography variant={'body2'}>Config Panel Button Stays Visible</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isProgressBarVisible}
                                    onChange={() => {
                                        dispatch(toggleProgressBarVisibility());
                                    }}
                                />
                            }
                            label={<Typography variant={'body2'}>Sound Clip Progress Bar Visible</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={variedKeystrokeSound}
                                    onChange={() => {
                                        dispatch(setVariedKeystrokeSound(!variedKeystrokeSound));
                                    }}
                                />
                            }
                            label={<Typography variant={'body2'}>Use Varied Keystroke Sound</Typography>}
                        />
                    </Stack>
                </Stack>
                <Box flex={1} />
                <Stack margin={2} spacing={1}>
                    <DownloadButton />
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ConfigPanel;
