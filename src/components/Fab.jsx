import MuiFab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { openConfigPanel } from '../redux/appSlice';

const fabStyle = {
    position: 'absolute',
    bottom: 24,
    right: 24,
    opacity: 0,
};

const Fab = () => {
    const dispatch = useDispatch();
    const isFABVisible = useSelector((state) => state.app.isFABVisible);
    const isInSetupStage = useSelector((state) => state.app.currentStage) === 'setup';
    const handleClick = () => {
        dispatch(openConfigPanel());
    };
    return (
        <MuiFab
            sx={[fabStyle, (isFABVisible || isInSetupStage) && { opacity: 1 }]}
            aria-label="settings"
            onClick={handleClick}
        >
            <EditIcon />
        </MuiFab>
    );
};

export default Fab;
