import * as React from 'react';

import Fab from './components/Fab';
import ConfigPanel from './components/ConfigPanel';
import { PAGES } from './pages';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
    const currentStage = useSelector((state) => state.app.currentStage);
    const experimentType = useSelector((state) => state.app.experimentType);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode]
    );

    const getPageBody = React.useCallback(() => {
        const currStagePage = PAGES[currentStage];
        if (['welcome', 'experiment'].includes(currentStage)) {
            return currStagePage[experimentType];
        } else {
            return currStagePage;
        }
    }, [currentStage, experimentType]);

    return (
        <ThemeProvider theme={theme}>
            <Box id={'root-box'} sx={{ backgroundColor: 'background.paper' }}>
                <ConfigPanel />
                <Fab />
                {getPageBody()}
            </Box>
        </ThemeProvider>
    );
}

export default App;
