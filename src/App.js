import * as React from 'react';

import Fab from './components/Fab';
import ConfigPanel from './components/ConfigPanel';
import { PAGES } from './pages';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

function App() {
    const currentStage = useSelector((state) => state.app.currentStage);
    return (
        <Box id={'root-box'}>
            <ConfigPanel />
            <Fab />
            {PAGES[currentStage]}
        </Box>
    );
}

export default App;
