import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function EndPage() {
    return (
        <Box paddingTop={8} minHeight={'100vh'}>
            <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
                <Typography variant={'h4'} color={'text.primary'}>
                    Great Job!
                </Typography>
                <Typography variant={'subtitle1'} color={'text.secondary'}>
                    Thank you for joining our study. Please let your experimenter know that you are finished.
                </Typography>
            </Stack>
        </Box>
    );
}

export default EndPage;
