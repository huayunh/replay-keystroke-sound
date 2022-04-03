import Fab from './components/Fab';
import ConfigPanel from './components/ConfigPanel';
import ChooseClipPage from './pages/ChooseClipPage';
import Box from '@mui/material/Box';

function App() {
    return (
        <Box id={'root-box'}>
            <ConfigPanel />
            <Fab />
            <ChooseClipPage />
        </Box>
    );
}

export default App;
