import ChooseClipPage from './ChooseClipPage';
import EndPage from './EndPage';
import WelcomePage from './WelcomePage';

const PAGES = [
    {
        name: 'Welcome Screen',
        numberOfScreens: 1,
        useComponent: <WelcomePage />,
    },
    {
        name: 'Experiment',
        numberOfScreens: 3,
        useComponent: <ChooseClipPage />,
    },
    {
        name: 'End Screen',
        numberOfScreens: 1,
        useComponent: <EndPage />,
    },
];

export const getPage = (index) => {
    let pageSum = 0;
    for (let i = 0; i < PAGES.length; i++) {
        pageSum += PAGES[i].numberOfScreens;
        if (index < pageSum) {
            return PAGES[i].useComponent;
        }
    }
    throw Error('Page Index Out of Range');
};
