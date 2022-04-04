import MuiFab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { openConfigPanel } from '../redux/appSlice';

const fabStyle = {
    position: 'absolute',
    bottom: 24,
    right: 24,
};

const Fab = () => {
    const dispatch = useDispatch();
    const invisibleFAB = useSelector((state) => state.app.invisibleFAB);
    const handleClick = () => {
        dispatch(openConfigPanel());
    };
    return (
        <MuiFab sx={[fabStyle, invisibleFAB && { opacity: 0 }]} aria-label="settings" onClick={handleClick}>
            <EditIcon />
        </MuiFab>
    );
};

export default Fab;
