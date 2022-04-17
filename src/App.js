import * as React from 'react';

import Fab from './components/Fab';
import ConfigPanel from './components/ConfigPanel';
import { PAGES } from './pages';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

function App() {
    const currentStage = useSelector((state) => state.app.currentStage);
    const experimentType = useSelector((state) => state.app.experimentType);

    const getPageBody = React.useCallback(() => {
        const currStagePage = PAGES[currentStage];
        if (['welcome', 'experiment'].includes(currentStage)) {
            return currStagePage[experimentType];
        } else {
            return currStagePage;
        }
    }, [currentStage, experimentType]);
    return (
        <Box id={'root-box'}>
            <ConfigPanel />
            <Fab />
            {getPageBody()}
        </Box>
    );
}

export default App;
