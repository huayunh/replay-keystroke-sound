import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch, useSelector } from 'react-redux';
import { welcomeScreenOnStart } from '../../redux/appSlice';
import Step1Gif from '../../assets/areTheyTheSame/step-1.gif';
import Step2Gif from '../../assets/areTheyTheSame/step-2.gif';

const wrapperStyle = {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    margin: '48px auto',
    maxWidth: 500,
    padding: 4,
    marginTop: {
        xs: 2,
        md: 4,
    },
};

const TOTAL_STEPS = 4;

const STEP_0 = () => {
    return (
        <div>
            <Typography variant={'h4'}>Welcome!</Typography>
            <Typography variant={'body1'} color={'text.secondary'}>
                Please click the "NEXT" button above to read instructions about this experiment.
            </Typography>
        </div>
    );
};

const STEP_1 = () => {
    return (
        <div>
            <img src={Step1Gif} style={{ border: `1px solid #0002`, width: '100%' }} alt={'Instruction for step 1'} />
            <Typography variant={'body1'} color={'text.secondary'}>
                In the next few screens, you will be asked to listen to two "clips." Each one will play the sound of
                someone typing. The two clips may be from the same typist, or they may be from different typists.
            </Typography>
        </div>
    );
};

const STEP_2 = () => {
    return (
        <div>
            <img src={Step2Gif} style={{ border: `1px solid #0002`, width: '100%' }} alt={'Instruction for step 2'} />
            <Typography variant={'body1'} color={'text.secondary'}>
                After that, a purple line will appear. Your task is to select a point on the purple line to indicate
                whether you think the two clips are identical or not and how confident you are in your answer. You can
                always replay the clips or adjust your answer before you submit.
            </Typography>
        </div>
    );
};

function WelcomePage() {
    const dispatch = useDispatch();
    const typistSequence = useSelector((state) => state.app.typistSequence);
    const [activeStep, setActiveStep] = React.useState(0);

    const getLastStep = React.useCallback(() => {
        return (
            <div>
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    There will be {typistSequence.length} questions. Click the "START" button above when you are ready.
                </Typography>
            </div>
        );
    }, [typistSequence]);

    const getCurrentStep = React.useCallback(() => {
        switch (activeStep) {
            case 0:
                return <STEP_0 />;
            case 1:
                return <STEP_1 />;
            case 2:
                return <STEP_2 />;
            case 3:
                return getLastStep();
            default:
                return <></>;
        }
    }, [activeStep, getLastStep]);

    return (
        <Box>
            <Stack width={'100%'} spacing={2} sx={wrapperStyle}>
                <MobileStepper
                    variant={'dots'}
                    steps={TOTAL_STEPS}
                    activeStep={activeStep}
                    position={'static'}
                    nextButton={
                        activeStep !== TOTAL_STEPS - 1 ? (
                            <Button
                                disabled={activeStep === TOTAL_STEPS - 1}
                                variant={'contained'}
                                endIcon={<KeyboardArrowRight />}
                                onClick={() => {
                                    if (activeStep !== TOTAL_STEPS - 1) {
                                        setActiveStep(activeStep + 1);
                                    }
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    dispatch(welcomeScreenOnStart());
                                }}
                                startIcon={<PlayIcon />}
                                variant={'contained'}
                            >
                                Start
                            </Button>
                        )
                    }
                    backButton={
                        <Button
                            disabled={activeStep === 0}
                            style={{ opacity: activeStep === 0 ? 0 : undefined }}
                            startIcon={<KeyboardArrowLeft />}
                            variant={'outlined'}
                            onClick={() => {
                                if (activeStep !== 0) {
                                    setActiveStep(activeStep - 1);
                                }
                            }}
                        >
                            Back
                        </Button>
                    }
                />
                {getCurrentStep()}
            </Stack>
        </Box>
    );
}

export default WelcomePage;
