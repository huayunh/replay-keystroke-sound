import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { welcomeScreenOnStart } from '../../redux/appSlice';
import Step1Gif from '../../assets/areTheyTheSame/step-1.gif';
import Step2Gif from '../../assets/areTheyTheSame/step-2.gif';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '64px auto 48px',
    maxWidth: 1024,
    padding: 4,
};

function WelcomePage() {
    const dispatch = useDispatch();
    const typistSequence = useSelector((state) => state.app.typistSequence);

    return (
        <Box>
            <Stack spacing={2} sx={wrapperStyle}>
                <Typography variant={'h4'}>Welcome</Typography>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <img
                            src={Step1Gif}
                            style={{ border: `1px solid #0002`, maxWidth: 488, width: '100%' }}
                            alt={'Instruction for step 1'}
                        />
                        <Typography variant={'body1'} color={'text.secondary'}>
                            In the next few screens, you will be asked to listen to two "clips." Each one will play the
                            sound of someone typing. The two clips may be from the same typist, or they may be from
                            different typists.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img
                            src={Step2Gif}
                            style={{ border: `1px solid #0002`, maxWidth: 488, width: '100%' }}
                            alt={'Instruction for step 2'}
                        />
                        <Typography variant={'body1'} color={'text.secondary'}>
                            After that, a purple line will appear. Your task is to select a point on the purple line to
                            indicate whether you think the two clips are identical or not and how confident you are in
                            your answer. You can always replay the clips or adjust your answer before you submit.
                        </Typography>
                    </Grid>
                </Grid>
                {/* Both clips will play the same typed characters, so the only difference would be that one clip might
                    be typed by a different typist than the other clip.  */}
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    There will be {typistSequence.length} questions. Click the button below when you are ready.
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
