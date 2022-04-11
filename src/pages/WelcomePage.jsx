import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { startExperiment, welcomeScreenOnStart } from '../redux/appSlice';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    margin: '64px auto 0',
};

function WelcomePage() {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(startExperiment());
        // we want this to be run only once when the experiment start
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box>
            <Stack spacing={2} sx={wrapperStyle}>
                <Typography variant={'h4'}>Welcome</Typography>
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    In the next few screens, you will be tasked to select xxx out of xxx. If you xxx, just xxx. If you
                    xxx, just xxx.
                </Typography>
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    Click the button below when you are ready.
                </Typography>
                <Button
                    onClick={() => {
                        dispatch(welcomeScreenOnStart());
                    }}
                    startIcon={<PlayIcon />}
                    variant={'contained'}
                >
                    Start
                </Button>
            </Stack>
        </Box>
    );
}

export default WelcomePage;
