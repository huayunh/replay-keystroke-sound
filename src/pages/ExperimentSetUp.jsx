import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { startExperiment, setPreset, setParticipantID, setUpScreenOnStart } from '../redux/appSlice';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    margin: '64px auto 0',
};

function ExperimentSetUp() {
    const dispatch = useDispatch();
    const preset = useSelector((state) => state.app.preset);
    const [participantIDEntered, setParticipantIDEntered] = React.useState(false);
    const participantID = useSelector((state) => state.app.participantID);

    React.useEffect(() => {
        dispatch(startExperiment());
        // we want this to be run only once when the experiment start
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box>
            <Stack spacing={2} sx={wrapperStyle}>
                <Typography variant={'h4'}>Set Up the Experiment</Typography>
                <Stack direction={'row'} divider={<Divider orientation={'vertical'} flexItem />} spacing={4}>
                    <Stack spacing={3}>
                        <TextField
                            autoFocus
                            label={'Subject ID'}
                            variant={'outlined'}
                            value={participantID === null ? '' : participantID}
                            onChange={(e) => dispatch(setParticipantID(e.target.value))}
                            onBlur={() => setParticipantIDEntered(true)}
                            error={participantIDEntered && (participantID === null || participantID === '')}
                            required
                            helperText={'Required'}
                        />
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
                    </Stack>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Button
                                onClick={() => {
                                    dispatch(setUpScreenOnStart('areTheyTheSame'));
                                }}
                                startIcon={<PlayIcon />}
                                variant={'contained'}
                                disabled={!participantID}
                            >
                                Experiment: Are They The Same
                            </Button>
                            <Typography variant={'caption'} color={'text.secondary'}>
                                Given two clips, identify if they are identical
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <Button
                                onClick={() => {
                                    dispatch(setUpScreenOnStart('whoTypedIt'));
                                }}
                                startIcon={<PlayIcon />}
                                variant={'contained'}
                                disabled={!participantID}
                            >
                                Experiment: Who Typed It
                            </Button>
                            <Typography variant={'caption'} color={'text.secondary'}>
                                Choose the typist who typed the test clip
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}

export default ExperimentSetUp;
