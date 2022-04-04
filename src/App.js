import Fab from './components/Fab';
import ConfigPanel from './components/ConfigPanel';
import { getPage } from './pages';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

function App() {
    const currentPage = useSelector((state) => state.app.currentPage);
    return (
        <Box id={'root-box'}>
            <ConfigPanel />
            <Fab />
            {getPage(currentPage)}
        </Box>
    );
}

export default App;
