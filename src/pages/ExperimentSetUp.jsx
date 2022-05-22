import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { setPreset, setSubjectID as _setSubjectID, setUpScreenOnStart } from '../redux/appSlice';
import useUpdateStateFromURLParameter from '../hooks/useUpdateStateFromURLParameter';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 600,
    margin: '0 auto',
    paddingTop: 8,
    minHeight: '100vh',
};

function ExperimentSetUp() {
    const dispatch = useDispatch();
    const preset = useSelector((state) => state.app.preset);
    const [subjectIDEntered, setSubjectIDEntered] = React.useState(false);
    const _subjectID = useSelector((state) => state.app.subjectID);
    const [subjectID, setSubjectID] = React.useState(_subjectID);

    useUpdateStateFromURLParameter();

    React.useEffect(() => {
        setSubjectID(_subjectID);
    }, [_subjectID]);

    return (
        <Stack spacing={4} sx={wrapperStyle}>
            <Typography variant={'h4'} color={'text.primary'}>
                Set Up the Experiment
            </Typography>
            <Stack direction={'row'} divider={<Divider orientation={'vertical'} flexItem />} spacing={4}>
                <Stack spacing={3}>
                    <TextField
                        autoFocus
                        label={'Subject ID'}
                        variant={'outlined'}
                        value={subjectID === null ? '' : subjectID}
                        onChange={(e) => {
                            setSubjectID(e.target.value.replace(',', ''));
                        }}
                        onBlur={() => {
                            setSubjectIDEntered(true);
                            if (subjectID === '' || subjectID === null) {
                                dispatch(_setSubjectID(null));
                            } else {
                                dispatch(_setSubjectID(subjectID));
                            }
                        }}
                        error={subjectIDEntered && (subjectID === null || subjectID === '')}
                        required
                        helperText={'Required'}
                    />
                    <FormControl>
                        <InputLabel id={'preset'}>Preset *</InputLabel>
                        <Select
                            labelId={'preset'}
                            value={preset ? preset : ''}
                            label={'Preset *'}
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
                            disabled={!subjectID || preset === null}
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
                            disabled={!subjectID || preset === null}
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
    );
}

export default ExperimentSetUp;
