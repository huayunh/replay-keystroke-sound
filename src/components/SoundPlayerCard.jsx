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
import { selectClip } from '../redux/appSlice';
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
    const [timeoutIDs, setTimeoutIDs] = React.useState([]);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const dispatch = useDispatch();
    const isSelected = useSelector((state) => state.app.selectedClip) === clipIndex && !isTestSubject;
    const playbackSpeed = useSelector((state) => state.playback.playbackSpeed);

    const playDuration = React.useMemo(
        () => downDownTimerStart[downDownTimerStart.length - 1] + 500,
        [downDownTimerStart]
    );

    const handlePlay = React.useCallback(() => {
        console.log('handlePlay');
        if (isPlaying) {
            return;
        }
        stopAllAudios();

        for (let i = 0; i < downDownTimerStart.length; i++) {
            const timeoutID = setTimeout(() => {
                const audio = document.createElement('audio');
                if (IS_KEY_PRESSED_HARD[i % IS_KEY_PRESSED_HARD.length]) {
                    audio.src = KeyStrokeHardSound;
                } else {
                    audio.src = KeyStrokeLightSound;
                }
                document.getElementById('root-box').appendChild(audio);
                audio.playbackRate = playbackSpeed;
                audio.play();
            }, downDownTimerStart[i] / playbackSpeed);
            timeoutIDs.push(timeoutID);
        }
        setIsPlaying(true);
        setPlayingTimer(
            setTimeout(() => {
                setIsPlaying(false);
            }, playDuration)
        );
    }, [isPlaying, downDownTimerStart, playDuration, timeoutIDs, playbackSpeed]);

    const handleStop = React.useCallback(() => {
        console.log('handleStop');
        stopAllAudios();
        timeoutIDs.forEach((timeoutID) => {
            clearTimeout(timeoutID);
        });
        setTimeoutIDs([]);
        if (playingTimer !== null) {
            clearTimeout(playingTimer);
        }
        setIsPlaying(false);
    }, [playingTimer, timeoutIDs]);

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
