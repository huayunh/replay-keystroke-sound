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
import KeyStrokeHardSound from '../assets/keystroke-hard.mp3';
import KeyStrokeLightSound from '../assets/keystroke-light.wav';

// redux
import { onAudioPlayed, onAudioStopped, clearAllAudios, addTimeoutID, selectAnswer } from '../redux/appSlice';
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

// update progress bar every 200ms
const progressUpdatePeriod = 200;

const progressZero = {
    width: 0,
    left: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'primary.light',
    opacity: 0.1,
    transition: `width ${progressUpdatePeriod}ms linear`,
};

const actionHovered = {
    cursor: 'pointer',
    color: 'primary.dark',
};

/**
 * Sound player for keystrokes.
 * @param {number[]} downDownTimerStart - starting time for each keystroke, calculated using "DD.x" value
 * @param {string} title - string to be displayed on the card and logged for the experimenter
 * @param {number} clipIndex - a unique identifier for the clip
 * @param {boolean} selectable - when false, there will not be a "select" button on the bottom
 * @param {boolean} disableSelectButton - when disabled, the select button will still be rendered but will be disabled
 * @param {string} secretIdentifier - what this clip is (e.g., typist index); meaningful identifier for the experimenters of this study
 * @returns JSX.Element
 */
const SoundPlayerCard = (props) => {
    const {
        downDownTimerStart,
        title,
        clipIndex,
        selectable = false,
        disableSelectButton = false,
        secretIdentifier = '',
        ...otherProps
    } = props;
    const [isHovered, setIsHovered] = React.useState(false);
    const [playingTimer, setPlayingTimer] = React.useState(null);
    const [progress, setProgress] = React.useState(null);
    const dispatch = useDispatch();
    const isSelected = useSelector((state) => state.app.selectedAnswer) === clipIndex && selectable;
    const isPlaying = useSelector((state) => state.app.playingClipIndex) === clipIndex;
    const playbackSpeed = useSelector((state) => state.app.playbackSpeed);
    const currentPage = useSelector((state) => state.app.currentPage);
    const isProgressBarVisible = useSelector((state) => state.app.isProgressBarVisible);
    const variedKeystrokeSound = useSelector((state) => state.app.variedKeystrokeSound);

    const playDuration = React.useMemo(
        () => downDownTimerStart[downDownTimerStart.length - 1] / playbackSpeed + 500,
        [downDownTimerStart, playbackSpeed]
    );

    const handlePlay = React.useCallback(() => {
        if (isPlaying) {
            return;
        }
        dispatch(onAudioPlayed({ index: clipIndex, title: title, name: secretIdentifier }));
        setProgress(0);

        for (let i = 0; i < downDownTimerStart.length; i++) {
            const timeoutID = setTimeout(() => {
                const audio = document.createElement('audio');
                if (variedKeystrokeSound && IS_KEY_PRESSED_HARD[i % IS_KEY_PRESSED_HARD.length]) {
                    audio.src = KeyStrokeHardSound;
                } else {
                    audio.src = KeyStrokeLightSound;
                }
                document.getElementById('root-box').appendChild(audio);
                // Not optimal when the playbackRate is less than 1
                // audio.playbackRate = playbackSpeed;
                audio.play().catch((reason) => {
                    if (reason instanceof DOMException) {
                        // this happens sometimes; nothing to worry about
                    } else {
                        console.log(reason);
                    }
                });
            }, downDownTimerStart[i] / playbackSpeed);
            dispatch(addTimeoutID(timeoutID));
        }
        const progressTimeoutID = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === null) return null;
                if (oldProgress >= 100) {
                    return 100;
                }
                return oldProgress + 100 / (playDuration / progressUpdatePeriod);
            });
        }, progressUpdatePeriod);
        dispatch(addTimeoutID(progressTimeoutID));
        const playingTimeout = setTimeout(() => {
            dispatch(clearAllAudios());
            setProgress(null);
            clearInterval(progressTimeoutID);
        }, playDuration);
        setPlayingTimer(playingTimeout);
        dispatch(addTimeoutID(playingTimeout));
    }, [
        dispatch,
        isPlaying,
        downDownTimerStart,
        playDuration,
        playbackSpeed,
        clipIndex,
        title,
        secretIdentifier,
        variedKeystrokeSound,
    ]);

    const handleStop = React.useCallback(() => {
        dispatch(onAudioStopped({ index: clipIndex, title: title, name: secretIdentifier }));
        setProgress(null);
        if (playingTimer !== null) {
            clearTimeout(playingTimer);
        }
    }, [dispatch, playingTimer, clipIndex, title, secretIdentifier]);

    React.useEffect(() => {
        return () => {
            if (playingTimer !== null) {
                clearTimeout(playingTimer);
            }
        };
    }, [playingTimer]);

    React.useEffect(() => {
        setProgress(null);
    }, [currentPage]);

    return (
        <Card
            variant={'outlined'}
            sx={[{ flex: 1 }, isHovered && !isSelected && cardHovered, isSelected && cardSelected]}
            {...otherProps}
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
                {isPlaying && isProgressBarVisible && progress !== null && (
                    <Box sx={progressZero} style={{ width: `${progress}%` }} />
                )}
            </CardContent>
            {selectable && (
                <>
                    <Divider />
                    <CardActions
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{ '&:hover': actionHovered }}
                        onClick={() => {
                            if (disableSelectButton) {
                                return;
                            }
                            dispatch(selectAnswer(clipIndex));
                        }}
                    >
                        <Typography
                            variant={'button'}
                            color={
                                disableSelectButton ? 'text.disabled' : isSelected ? 'secondary.main' : 'primary.main'
                            }
                        >
                            {isSelected ? 'Selected' : 'Select'}
                        </Typography>
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default SoundPlayerCard;
