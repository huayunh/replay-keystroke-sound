import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { welcomeScreenOnStart } from '../../redux/appSlice';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 600,
    margin: '0 auto',
    padding: 8,
    minHeight: '100vh',
};

function WelcomePage() {
    const dispatch = useDispatch();

    return (
        <Box>
            <Stack spacing={2} sx={wrapperStyle}>
                <Typography variant={'h4'} color={'text.primary'}>
                    Welcome
                </Typography>
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    ("Who typed it" description goes here.)
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
