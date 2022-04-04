import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function EndPage() {
    return (
        <Box>
            <Stack direction={'column'} alignItems={'center'} justifyContent={'center'} marginTop={8}>
                <Typography variant={'h4'}>Great Job!</Typography>
                <Typography variant={'subtitle1'}>Please signal your experimenter, blah blah blah.</Typography>
            </Stack>
        </Box>
    );
}

export default EndPage;
