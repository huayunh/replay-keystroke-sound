import React from 'react';

// Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Typography from '@mui/material/Typography';

// Assets
import { IS_KEY_PRESSED_HARD } from '../shared/constants';
import { stopAllAudios } from '../shared/utils';
import KeyStrokeHardSound from '../assets/keystroke-hard.mp3';
import KeyStrokeLightSound from '../assets/keystroke-light.wav';

// redux
import { selectClip, addTimeoutID, clearTimeoutIDs, clearPlayingClip, setPlayingClip } from '../redux/appSlice';
import { logAction } from '../redux/logSlice';
import { useDispatch, useSelector } from 'react-redux';

const cardHovered = {
    borderColor: 'text.primary',
};

const cardSelected = {
    borderColor: 'secondary.main',
    borderWidth: '2px',
};

const cardContentStyle = {
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
        color: 'primary.main',
    },
};

// const progressZero = {
//     width: 0,
//     left: 0,
//     top: 0,
//     bottom: 0,
//     position: 'absolute',
//     backgroundColor: 'primary.light',
//     opacity: 0.1,
// };
// const progressFull = {
//     width: '100%',
//     opacity: 0.2,
//     transition: 'width,opacity 2000ms',
// };

const actionHovered = {
    cursor: 'pointer',
    color: 'primary.dark',
};

const SoundPlayerCard = (props) => {
    const { downDownTimerStart, title, clipIndex = -1, isTestSubject = false } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const [playingTimer, setPlayingTimer] = React.useState(null);
    const dispatch = useDispatch();
    const isSelected = useSelector((state) => state.app.selectedClip) === clipIndex && !isTestSubject;
    const isPlaying = useSelector((state) => state.app.playingClip) === (isTestSubject ? -1 : clipIndex);
    const playbackSpeed = useSelector((state) => state.playback.playbackSpeed);

    const playDuration = React.useMemo(
        () => downDownTimerStart[downDownTimerStart.length - 1] + 500,
        [downDownTimerStart]
    );
    const clipName = React.useMemo(() => (isTestSubject ? 'Test' : ['A', 'B'][clipIndex]), [isTestSubject, clipIndex]);

    const handlePlay = React.useCallback(() => {
        console.log('handlePlay');
        if (isPlaying) {
            return;
        }
        stopAllAudios();
        dispatch(clearTimeoutIDs());
        dispatch(setPlayingClip(isTestSubject ? -1 : clipIndex));
        dispatch(logAction(`Play: ${clipName}`));

        for (let i = 0; i < downDownTimerStart.length; i++) {
            const timeoutID = setTimeout(() => {
                const audio = document.createElement('audio');
                if (IS_KEY_PRESSED_HARD[i % IS_KEY_PRESSED_HARD.length]) {
                    audio.src = KeyStrokeHardSound;
                } else {
                    audio.src = KeyStrokeLightSound;
                }
                document.getElementById('root-box').appendChild(audio);
                // Not optimal when the playbackRate is less than 1
                // audio.playbackRate = playbackSpeed;
                audio.play().catch((reason) => {
                    console.log(reason);
                });
            }, downDownTimerStart[i] / playbackSpeed);
            dispatch(addTimeoutID(timeoutID));
        }
        setPlayingTimer(
            setTimeout(() => {
                dispatch(clearTimeoutIDs());
                dispatch(clearPlayingClip());
            }, playDuration)
        );
    }, [dispatch, isPlaying, downDownTimerStart, playDuration, playbackSpeed, isTestSubject, clipIndex, clipName]);

    const handleStop = React.useCallback(() => {
        console.log('handleStop');
        stopAllAudios();
        dispatch(clearTimeoutIDs());
        dispatch(clearPlayingClip());

        if (playingTimer !== null) {
            clearTimeout(playingTimer);
        }
    }, [dispatch, playingTimer]);

    React.useEffect(() => {
        return () => {
            if (playingTimer !== null) {
                clearTimeout(playingTimer);
            }
        };
    }, [playingTimer]);

    return (
        <Card
            variant={'outlined'}
            sx={[{ flex: 1 }, isHovered && !isSelected && cardHovered, isSelected && cardSelected]}
        >
            <CardContent
                onClick={isPlaying ? handleStop : handlePlay}
                sx={[
                    {
                        color: !isPlaying ? 'text.primary' : 'primary.main',
                    },
                    cardContentStyle,
                ]}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {!isPlaying ? <PlayIcon /> : <StopIcon />}
                    <Typography variant={'h6'} sx={{ display: 'inline-block', marginLeft: 1 }}>
                        {title}
                    </Typography>
                </Box>
            </CardContent>
            {!isTestSubject && (
                <>
                    <Divider />
                    <CardActions
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{ '&:hover': actionHovered }}
                        onClick={() => {
                            dispatch(selectClip(clipIndex));
                            dispatch(logAction(`Select: ${clipName}`));
                        }}
                    >
                        <Typography variant={'button'} color={isSelected ? 'secondary.main' : 'primary.main'}>
                            {isSelected ? 'Selected' : 'Select'}
                        </Typography>
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default SoundPlayerCard;
